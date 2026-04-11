import User from "../model/user.js";
import Resource from "../model/ressources.js";
import Event from "../model/event.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────────────────
// UTILITAIRE : Cosine Similarity entre deux vecteurs
// ─────────────────────────────────────────────────────────
function cosineSimilarity(vecA, vecB) {
    const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0, normA = 0, normB = 0;

    for (const key of allKeys) {
        const a = vecA[key] || 0;
        const b = vecB[key] || 0;
        dotProduct += a * b;
        normA += a * a;
        normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─────────────────────────────────────────────────────────
// UTILITAIRE : Construire le vecteur de préférences d'un user
// ─────────────────────────────────────────────────────────
async function buildUserVector(userId) {
    const events = await Event.find({ organisateur_id: userId }).populate("ressources_utiliser");
    const user = await User.findById(userId).populate("adore");
    const vector = {};

    for (const event of events) {
        for (const resource of event.ressources_utiliser) {
            if (resource?.category) {
                vector[resource.category] = (vector[resource.category] || 0) + 1;
            }
        }
    }

    for (const resource of user.adore || []) {
        if (resource?.category) {
            vector[resource.category] = (vector[resource.category] || 0) + 0.5;
        }
    }

    return { vector, user, events };
}

// ─────────────────────────────────────────────────────────
// KNN : Trouver les K users les plus similaires
// ─────────────────────────────────────────────────────────
async function findKNearestUsers(targetUserId, targetVector, K = 5) {
    const allUsers = await User.find({
        _id: { $ne: targetUserId },
        role: "organisateur",
        status: "valide",
    }).select("_id adore").lean();

    const similarities = [];

    for (const candidate of allUsers) {
        const { vector: candidateVector } = await buildUserVector(candidate._id);
        if (Object.keys(candidateVector).length === 0) continue;

        const similarity = cosineSimilarity(targetVector, candidateVector);
        if (similarity > 0) {
            similarities.push({ userId: candidate._id, similarity, adore: candidate.adore });
        }
    }

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, K);
}

// ─────────────────────────────────────────────────────────
// CAS 1 : User non connecté → Popularité globale
// ─────────────────────────────────────────────────────────
export async function getPopularResources(limit = 10) {
    return await Resource.aggregate([
        {
            $addFields: {
                popularityScore: {
                    $add: [
                        { $multiply: ["$averageRating", 0.6] },
                        {
                            $multiply: [
                                { $divide: ["$likesCount", { $add: ["$likesCount", 10] }] },
                                0.4,
                            ],
                        },
                    ],
                },
            },
        },
        { $sort: { popularityScore: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "prestataire",
                foreignField: "_id",
                as: "prestataire",
                pipeline: [{ $project: { nomSociete: 1, image: 1 } }],
            },
        },
        // ✅ CORRIGÉ : preserveNullAndEmptyArrays (pas double Arrays)
        { $unwind: { path: "$prestataire", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "media",
                localField: "media",
                foreignField: "_id",
                as: "media",
            },
        },
    ]);
}

// ─────────────────────────────────────────────────────────
// CAS 2 : User connecté → KNN + Géo
// ─────────────────────────────────────────────────────────
export async function getPersonalizedResources(userId, limit = 10, K = 5) {
    const { vector: targetVector, user, events } = await buildUserVector(userId);

    if (Object.keys(targetVector).length === 0) {
        return getPopularResources(limit);
    }

    const kNeighbors = await findKNearestUsers(userId, targetVector, K);

    const knnScores = {};
    for (const neighbor of kNeighbors) {
        for (const resourceId of neighbor.adore) {
            const id = resourceId.toString();
            knnScores[id] = (knnScores[id] || 0) + neighbor.similarity;
        }
    }

    const seenIds = [
        ...events.flatMap((e) => e.ressources_utiliser.map((r) => r._id)),
        ...(user.adore || []).map((r) => r._id),
    ];
    const seenSet = new Set(seenIds.map((id) => id.toString()));

    const knnResourceIds = Object.entries(knnScores)
        .filter(([id]) => !seenSet.has(id))
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => new mongoose.Types.ObjectId(id));

    const knnScoreMap = Object.entries(knnScores).reduce((acc, [id, score]) => {
        acc[id] = score;
        return acc;
    }, {});

    const pipeline = [];

    if (user.location?.coordinates?.length === 2) {
        pipeline.push({
            $geoNear: {
                near: { type: "Point", coordinates: user.location.coordinates },
                distanceField: "distance",
                maxDistance: 50000,
                spherical: true,
            },
        });
    }

    pipeline.push(
        {
            $match: {
                _id: { $nin: seenIds },
                $or: [{ type: "service" }, { stock: { $gt: 0 } }],
            },
        },
        {
            $addFields: {
                knnScore: {
                    $cond: {
                        if: { $in: ["$_id", knnResourceIds] },
                        then: { $literal: 1 },
                        else: 0,
                    },
                },
            },
        },
        {
            $addFields: {
                finalScore: {
                    $add: [
                        { $multiply: ["$knnScore", 0.5] },
                        { $multiply: ["$averageRating", 0.3] },
                        {
                            $multiply: [
                                { $divide: ["$likesCount", { $add: ["$likesCount", 10] }] },
                                0.2,
                            ],
                        },
                    ],
                },
            },
        },
        { $sort: { finalScore: -1, averageRating: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "prestataire",
                foreignField: "_id",
                as: "prestataire",
                pipeline: [{ $project: { nomSociete: 1, image: 1 } }],
            },
        },
        // ✅ CORRIGÉ
        { $unwind: { path: "$prestataire", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "media",
                localField: "media",
                foreignField: "_id",
                as: "media",
            },
        }
    );

    let resources = await Resource.aggregate(pipeline);

    resources = resources
        .map((r) => ({
            ...r,
            knnScore: knnScoreMap[r._id.toString()] || 0,
            finalScore:
                (knnScoreMap[r._id.toString()] || 0) * 0.5 +
                (r.averageRating || 0) * 0.3 +
                ((r.likesCount || 0) / ((r.likesCount || 0) + 10)) * 0.2,
        }))
        .sort((a, b) => b.finalScore - a.finalScore);

    if (resources.length < 5) {
        const extra = await getPopularResources(limit - resources.length);
        const existingIds = new Set(resources.map((r) => r._id.toString()));
        return [...resources, ...extra.filter((r) => !existingIds.has(r._id.toString()))];
    }

    return resources;
}

// ─────────────────────────────────────────────────────────
// CAS 3 : Création d'événement → Rule-based + KNN boost
// ─────────────────────────────────────────────────────────
const EVENT_RESOURCE_MAP = {
    Mariage:      { categories: ["salle", "traiteur", "photographe", "decoration", "dj", "serveur"], weights: [1.0, 0.9, 0.9, 0.8, 0.7, 0.7] },
    Conference:   { categories: ["salle", "materiel", "traiteur", "serveur"],                        weights: [1.0, 0.9, 0.6, 0.5] },
    Anniversaire: { categories: ["salle", "decoration", "traiteur", "dj", "photographe"],            weights: [1.0, 0.9, 0.8, 0.7, 0.6] },
    Seminaire:    { categories: ["salle", "materiel", "traiteur", "serveur"],                        weights: [1.0, 0.9, 0.7, 0.5] },
    autre:        { categories: ["salle", "traiteur", "decoration"],                                 weights: [1.0, 0.8, 0.6] },
};

export async function getEventBasedResources(eventData, userId = null, limit = 15) {
    const { category, lieu } = eventData;
    const mapping = EVENT_RESOURCE_MAP[category] || EVENT_RESOURCE_MAP["autre"];
    const { categories, weights } = mapping;

    let knnScoreMap = {};
    let seenIds = [];

    if (userId) {
        const { vector: targetVector, events } = await buildUserVector(userId);
        seenIds = events.flatMap((e) => e.ressources_utiliser.map((r) => r._id));

        if (Object.keys(targetVector).length > 0) {
            const kNeighbors = await findKNearestUsers(userId, targetVector, 5);
            for (const neighbor of kNeighbors) {
                for (const resourceId of neighbor.adore) {
                    const id = resourceId.toString();
                    knnScoreMap[id] = (knnScoreMap[id] || 0) + neighbor.similarity;
                }
            }
        }
    }

    const knnResourceIds = Object.keys(knnScoreMap).map(
        (id) => new mongoose.Types.ObjectId(id)
    );

    const categoryWeightBranches = categories.map((cat, i) => ({
        case: { $eq: ["$category", cat] },
        then: weights[i],
    }));

    const pipeline = [];

    if (lieu?.coordinates?.length === 2) {
        pipeline.push({
            $geoNear: {
                near: { type: "Point", coordinates: lieu.coordinates },
                distanceField: "distance",
                maxDistance: 100000,
                spherical: true,
            },
        });
    }

    pipeline.push(
        {
            $match: {
                category: { $in: categories },
                ...(seenIds.length > 0 && { _id: { $nin: seenIds } }),
                $or: [{ type: "service" }, { stock: { $gt: 0 } }],
            },
        },
        {
            $addFields: {
                categoryWeight: {
                    $switch: { branches: categoryWeightBranches, default: 0 },
                },
                knnBoost: {
                    $cond: {
                        if: { $in: ["$_id", knnResourceIds] },
                        then: 0.3,
                        else: 0,
                    },
                },
            },
        },
        {
            $addFields: {
                eventScore: {
                    $add: [
                        { $multiply: ["$categoryWeight", 0.5] },
                        { $multiply: ["$averageRating", 0.2] },
                        {
                            $multiply: [
                                { $divide: ["$likesCount", { $add: ["$likesCount", 10] }] },
                                0.1,
                            ],
                        },
                        "$knnBoost",
                    ],
                },
            },
        },
        { $sort: { categoryWeight: -1, eventScore: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "prestataire",
                foreignField: "_id",
                as: "prestataire",
                pipeline: [{ $project: { nomSociete: 1, image: 1, numTel: 1 } }],
            },
        },
        // ✅ CORRIGÉ
        { $unwind: { path: "$prestataire", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "media",
                localField: "media",
                foreignField: "_id",
                as: "media",
            },
        }
    );

    const resources = await Resource.aggregate(pipeline);

    const grouped = {};
    for (const cat of categories) {
        grouped[cat] = resources.filter((r) => r.category === cat);
    }

    return { flat: resources, grouped };
}
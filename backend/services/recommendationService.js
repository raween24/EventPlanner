import Resource from "../model/ressources.js";
import Event from "../model/event.js";
import User from "../model/user.js";
import Comment from "../model/commantaire.js";

import { distance } from "../utils/knn.js";
import { eventToResourceMap } from "../utils/mapping.js";
import {
    resourceToVector,
    eventToVector,
    isResourceAvailable,
    extractKeywords,
    keywordScore
} from "../utils/helpers.js";

// ❤️ likes
async function computeLikes(resources) {
    const users = await User.find();
    const map = {};

    users.forEach(u => {
        u.adore.forEach(id => {
            map[id] = (map[id] || 0) + 1;
        });
    });

    return resources.map(r => ({
        ...r._doc,
        likesCount: map[r._id] || 0
    }));
}

// ⭐ rating
async function computeRatings(resources) {
    const comments = await Comment.find();
    const sum = {}, count = {};

    comments.forEach(c => {
        const id = c.C_res.toString();
        sum[id] = (sum[id] || 0) + c.nbr_stars;
        count[id] = (count[id] || 0) + 1;
    });

    return resources.map(r => {
        const id = r._id.toString();
        const rating = count[id] ? sum[id] / count[id] : 0;
        return { ...r, rating };
    });
}

export const getRecommendations = async (userId, eventId = null) => {
    let resources = await Resource.find()
        .populate("availability")
        .populate("media")
        .populate("prestataire");

    resources = await computeLikes(resources);
    resources = await computeRatings(resources);
    const user = await User.findById(userId);

    let profile = null;
    let keywords = [];

    // 🎯 CAS 1 : EVENT
    if (eventId) {
        const event = await Event.findById(eventId);

        // 🔥 filtre catégorie
        const allowed = eventToResourceMap[event.category];
        resources = resources.filter(r => allowed.includes(r.category));

        // 🔥 filtre disponibilité
        resources = resources.filter(r => isResourceAvailable(r, event));

        profile = eventToVector(event);
        keywords = extractKeywords(event.description);
    }

    // 🎯 CAS 2 : HISTORIQUE
    else {
        const pastEvents = await Event.find({
            organisateur_id: userId,
            status: "terminé"
        }).populate("ressources_utiliser");

        if (pastEvents.length > 0) {
            let price = 0, capacity = 0, count = 0;

            pastEvents.forEach(e => {
                e.ressources_utiliser.forEach(r => {
                    price += r.price;
                    capacity += r.attributes?.get("capacity") || 0;
                    count++;
                });
            });

            profile = {
                price: price / count || 0,
                capacity: capacity / count || 0,
                location: user.location
            };
        }
    }

    // ❄️ CAS 3 : COLD START
    if (!profile) {
        return resources
            .sort((a, b) =>
                (b.likesCount + b.rating) - (a.likesCount + a.rating)
            )
            .slice(0, 5);
    }
    if (!userId) {
        return resources
            .sort((a, b) =>
                (b.likesCount + b.rating) - (a.likesCount + a.rating)
            )
            .slice(0, 5);
    }

    // 🔥 HYBRID SCORE FINAL
    const maxLikes = Math.max(...resources.map(r => r.likesCount));

    const result = resources.map(r => {
        const vec = resourceToVector(r);

        const dist = distance(profile, vec);
        const score_knn = 1 / (1 + dist);

        const score_location =
            vec.location === profile.location ? 1 : 0;

        const score_pop =
            r.likesCount / (maxLikes || 1);

        const score_rating =
            r.rating / 5;

        const score_keywords =
            keywordScore(r, keywords);

        const score =
            (score_knn * 0.3) +
            (score_location * 0.15) +
            (score_pop * 0.15) +
            (score_rating * 0.15) +
            (score_keywords * 0.25);

        return { ...r, score };
    });

    return result
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
};
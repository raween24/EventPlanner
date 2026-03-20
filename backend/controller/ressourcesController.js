import Resource from "../model/ressources.js";
import Media from "../model/media_ressources.js";
import Dispo from "../model/disponibilite.js";

const addResource = async (req, res) => {
    try {

        const {
            name,
            description,
            type,
            price,
            location,
            capacity
        } = req.body;
        const provider_name = req.user.firstname + " " + req.user.lastname;
        const provider_email = req.user.email;

        // ================= MEDIA =================
        let mediaId = null;

        if (req.files && req.files.length > 0) {

            const images = req.files.map(file => file.path);

            const media = await Media.create({
                img_vd: images
            });

            mediaId = media._id;
        }

        // ================= AVAILABILITY =================
        const availabilityIds = [];

        if (req.body.availability) {

            const events = JSON.parse(req.body.availability);

            for (let event of events) {

                const dispo = await Dispo.create({
                    date_deb: event.start,
                    date_fin: event.end,
                    satut_disp: event.type === "available"
                });

                availabilityIds.push(dispo._id);
            }
        }

        // ================= RESOURCE =================
        const resource = await Resource.create({

            name,
            description,
            type,
            price,
            location,
            capacity,

            provider_name,
            provider_email,

            media: mediaId ? [mediaId] : [],
            availability: availabilityIds,
            prestataire: req.user.id

        });

        res.status(201).json(resource);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// ================= VOIR TOUTES LES RESSOURCES =================
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate("media")
            .populate("availability");
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= VOIR UNE RESSOURCE PAR ID =================
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate("media")
            .populate("availability");

        if (!resource) return res.status(404).json({ message: "Ressource non trouvée" });

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getResourcesByUser = async (req, res) => {
    try {
        const resources = await Resource.find({
            prestataire: req.user.id
        })
            .populate("media")
            .populate("availability");

        res.status(200).json(resources);

    } catch (error) {
        res.status(500).json({
            message: "Erreur récupération ressources",
            error: error.message
        });
    }
};
// ================= MODIFIER RESSOURCE =================
const updateResource = async (req, res) => {
    try {
        if (req.user.role !== "prestataire") {
            return res.status(403).json({ message: "Accès refusé : seul le prestataire peut modifier des ressources" });
        }

        const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated) return res.status(404).json({ message: "Ressource non trouvée" });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= SUPPRIMER RESSOURCE =================
const deleteResource = async (req, res) => {
    try {
        if (req.user.role !== "prestataire") {
            return res.status(403).json({ message: "Accès refusé : seul le prestataire peut supprimer des ressources" });
        }

        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) return res.status(404).json({ message: "Ressource non trouvée" });

        res.status(200).json({ message: "Ressource supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    addResource,
    getAllResources,
    getResourceById,
    getResourcesByUser,
    updateResource,
    deleteResource
};
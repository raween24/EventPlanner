import Resource from "../model/ressources.js";

// ================= AJOUTER RESSOURCE =================
const addResource = async (req, res) => {
    try {
        if (req.user.role !== "prestataire") {
            return res.status(403).json({ message: "Accès refusé : seul le prestataire peut ajouter des ressources" });
        }

        const body = req.body || {};

        const name = body.name;
        const description = body.description;
        const type = body.type;
        const price = body.price;
        const location = body.location;
        const capacity = body.capacity;
        const provider_name = body.provider_name;
        const provider_email = body.provider_email;

        if (!name || !description || !type || !price || !provider_name) {
            return res.status(400).json({ message: "Champs obligatoires manquants : name, description, type, price, provider_name" });
        }

        const resource = new Resource({
            name,
            description,
            type,
            price,
            location,
            capacity,
            provider_name,
            provider_email,
        });

        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    updateResource,
    deleteResource
};
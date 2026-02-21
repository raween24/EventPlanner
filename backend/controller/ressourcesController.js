import Resource from "../model/ressources.js";

// ✅ CREATE
const addResource = async (req, res) => {
    try {
        const {
            name,
            description,
            type,
            price,
            location,
            capacity,
            provider_name,
            provider_email,
            image,
            availability
        } = req.body;

        const resource = new Resource({
            name,
            description,
            type,
            price,
            location,
            capacity,
            provider_name,
            provider_email,
            image,
            availability
        });

        await resource.save();
        res.status(201).json(resource);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ READ ALL
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ READ BY ID
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json(resource);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ UPDATE
const updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        resource.name = req.body.name || resource.name;
        resource.description = req.body.description || resource.description;
        resource.type = req.body.type || resource.type;
        resource.price = req.body.price || resource.price;
        resource.location = req.body.location || resource.location;
        resource.capacity = req.body.capacity || resource.capacity;
        resource.provider_name = req.body.provider_name || resource.provider_name;
        resource.provider_email = req.body.provider_email || resource.provider_email;
        resource.image = req.body.image || resource.image;
        resource.availability =
            req.body.availability !== undefined
                ? req.body.availability
                : resource.availability;

        await resource.save();

        res.status(200).json(resource);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ✅ DELETE
const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findByIdAndDelete(id);

        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json({ message: "Ressource supprimée avec succès" });

    } catch (error) {
        console.log(error);
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
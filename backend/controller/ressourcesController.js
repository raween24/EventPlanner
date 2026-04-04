import Resource from "../model/ressources.js";
import Media from "../model/media_ressources.js";
import Dispo from "../model/disponibilite.js";
import { resourceFields } from "../config/resourceFields.js";

// ================= AJOUTER RESSOURCE =================
const addResource = async (req, res) => {
  try {
    console.log("FILES:", req.files);

    const termsFile = req.files?.termsFile?.[0];
    const mediaFiles = req.files?.media || [];

    const pdfPath = termsFile ? termsFile.path : null;
    const mediaPaths = mediaFiles.map(f => f.path);

    const newResource = new Resource({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      price: req.body.price,
      location: req.body.location,
      category: req.body.categoryName,
      terms: req.body.terms || null,
      termsFile: pdfPath,
      media: mediaPaths
    });

    await newResource.save();

    res.status(201).json(newResource);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= VOIR TOUT =================
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate("media")
            .populate("availability")
            .populate("prestataire");

        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ================= VOIR PAR ID =================
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate("media")
            .populate("availability")
            .populate("prestataire");

        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json(resource);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ================= VOIR PAR USER =================
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



// ================= UPDATE =================
const updateResource = async (req, res) => {
    try {
        if (req.user.role !== "prestataire") {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        const { attributes, categoryName } = req.body;

        // 🔐 validation dynamique
        if (categoryName && attributes) {
            const fields = resourceFields[categoryName];

            if (fields) {
                fields.forEach(field => {
                    if (field.required && !(field.name in attributes)) {
                        throw new Error(`${field.name} est obligatoire`);
                    }
                });
            }

            resource.attributes = attributes;
        }

        // ================= UPDATE BASIQUE =================
        resource.name = req.body.name || resource.name;
        resource.description = req.body.description || resource.description;
        resource.type = req.body.type || resource.type;
        resource.price = req.body.price || resource.price;
        resource.location = req.body.location || resource.location;
        resource.categoryName = categoryName || resource.categoryName;
        resource.terms = req.body.terms || resource.terms;

        // ================= MEDIA =================
        let imagesToKeep = [];

        if (req.body.imagesToKeep) {
            try {
                imagesToKeep = JSON.parse(req.body.imagesToKeep);
            } catch {
                imagesToKeep = [];
            }
        }

        resource.media = resource.media.filter(id =>
            imagesToKeep.includes(id.toString())
        );

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => file.path);

            const newMedia = await Media.create({
                img_vd: imagePaths
            });

            resource.media.push(newMedia._id);
        }

        // ================= AVAILABILITY =================
        if (req.body.availability) {
            let availabilityData = [];

            try {
                availabilityData = JSON.parse(req.body.availability);
            } catch {
                availabilityData = [];
            }

            resource.availability = [];

            for (const avail of availabilityData) {
                const newDispo = await Dispo.create({
                    date_deb: avail.start,
                    date_fin: avail.end,
                    satut_disp: avail.status
                });

                resource.availability.push(newDispo._id);
            }
        }

        await resource.save();

        const updated = await Resource.findById(resource._id)
            .populate("media")
            .populate("availability");

        res.status(200).json(updated);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// ================= DELETE =================
const deleteResource = async (req, res) => {
    try {
        if (req.user.role !== "prestataire") {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json({ message: "Ressource supprimée" });

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
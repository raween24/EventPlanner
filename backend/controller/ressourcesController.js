import Resource from "../model/ressources.js";
import Media from "../model/media_ressources.js";
import Dispo from "../model/disponibilite.js";
import User from "../model/user.js";
import { getLocationName } from "../utils/geocode.js";
import { resourceFields } from "../config/resourceFields.js";


// ================= AJOUTER RESSOURCE =================
const addResource = async (req, res) => {
  try {
    const termsFile = req.files?.termsFile?.[0];
    const mediaFiles = req.files?.media || [];

    const pdfPath = termsFile ? termsFile.path : null;
    const mediaPaths = mediaFiles.map(f => f.path);

    // 🔹 AVAILABILITY
    const availabilityData = JSON.parse(req.body.availability || "[]");

    const dispoDocs = await Dispo.create(
      availabilityData.map(({ start, end, type }) => ({
        date_deb: new Date(start),
        date_fin: new Date(end),
        satut_disp: type === "available"
      }))
    );

    // 🔹 MEDIA
    const mediaDoc = await Media.create({
      img_vd: mediaPaths
    });

    // 🔥 FIX LOCATION
    let resourceLocation = undefined;

    if (req.body.location) {
      const parsedLocation =
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location;

      if (
        parsedLocation?.coordinates &&
        parsedLocation.coordinates.length === 2
      ) {
        const [lng, lat] = parsedLocation.coordinates;

        // 🔥 appel backend (PAS frontend)
        const locationName = await getLocationName(lat, lng);

        resourceLocation = {
          type: "Point",
          coordinates: parsedLocation.coordinates,
          name: locationName // 🔥 ajouté
        };
      }
    }
    console.log("📍 FULL DATA:", JSON.stringify(data, null, 2));

    // 🔹 CREATE RESOURCE
    const newResource = new Resource({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      price: Number(req.body.price),

      location: resourceLocation,

      stock: req.body.stock ? Number(req.body.stock) : 1,
      category: req.body.categoryName,
      prestataire: req.user.id,

      attributes: JSON.parse(req.body.attributes || "{}"),
      customAttributes: JSON.parse(req.body.customAttributes || "[]"),

      availability: dispoDocs.map(d => d._id),
      media: [mediaDoc._id],

      terms: {
        text: req.body.terms || null,
        file: pdfPath || null
      }
    });

    await newResource.save();

    const populatedResource = await Resource.findById(newResource._id)
      .populate("prestataire", "firstname email")
      .populate("media")
      .populate("availability");

    res.status(201).json(populatedResource);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= GET ALL (SMART 🔥) =================
const getAllResources = async (req, res) => {
  try {
    let userLocation = null;
    let userLikes = [];

    if (req.user) {
      const user = await User.findById(req.user.id);

      if (user?.location?.coordinates?.length === 2) {
        userLocation = user.location.coordinates;
      }

      userLikes = user.adore?.map(id => id.toString()) || [];
    }

    let resources;

    // 🔥 GEO SEARCH
    if (userLocation) {
      resources = await Resource.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: userLocation
            },
            distanceField: "distance",
            spherical: true
          }
        }
      ]);
    } else {
      resources = await Resource.find();
    }

    // 🔹 populate
    resources = await Resource.populate(resources, [
      { path: "media" },
      { path: "availability" },
      { path: "prestataire" }
    ]);

    // 🔥 SCORE IA
    const scored = resources.map(r => {
      let score = 0;

      if (r.distance) {
        score += 1000 / (r.distance + 1);
      }

      if (userLikes.includes(r._id.toString())) {
        score += 50;
      }

      return { ...r._doc, score };
    });

    scored.sort((a, b) => b.score - a.score);

    res.status(200).json(scored);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ================= GET BY ID =================
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


// ================= USER RESOURCES =================
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

    resource.name = req.body.name || resource.name;
    resource.description = req.body.description || resource.description;
    resource.type = req.body.type || resource.type;
    resource.price = req.body.price || resource.price;

    // 🔥 FIX LOCATION UPDATE
    if (req.body.location) {
      const parsedLocation =
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location;

      if (parsedLocation?.coordinates?.length === 2) {
        const [lng, lat] = parsedLocation.coordinates;

        const locationName = await getLocationName(lat, lng);

        resource.location = {
          type: "Point",
          coordinates: parsedLocation.coordinates,
          name: locationName
        };
      }
    }

    if (req.body.stock !== undefined) {
      resource.stock = Number(req.body.stock);
    }

    await resource.save();

    res.status(200).json(resource);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE =================
const deleteResource = async (req, res) => {
  try {
    if (req.user.role !== "prestataire") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await Resource.findByIdAndDelete(req.params.id);

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
import Resource from "../model/ressources.js";

// ✅ CREATE
const addResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ READ ALL
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("media")
      .populate("availability");

    res.status(200).json(resources);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// ✅ READ BY ID
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("media")
      .populate("availability");

    if (!resource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }

    res.status(200).json(resource);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};// ✅ UPDATE
const updateResource = async (req, res) => {
    try {
        const updated = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ✅ DELETE
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

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
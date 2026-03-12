// controllers/adminController.js
import User       from "../model/user.js";
import Event      from "../model/event.js";
import Ressource  from "../model/ressources.js";
import Document   from "../model/documents.js";

// ─── Stats ────────────────────────────────────────────────────────────────────
// GET /api/admin/stats
// Feeds the 4 cards on the dashboard
export const getStats = async (req, res) => {
  try {
    const [users, events, resources, documents] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Ressource.countDocuments(),
      Document.countDocuments(),
    ]);
    res.json({ users, events, resources, documents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────
// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["organisateur", "prestataire", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Events ───────────────────────────────────────────────────────────────────
// GET /api/admin/events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/events/:id
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Événement supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Resources ────────────────────────────────────────────────────────────────
// GET /api/admin/resources
export const getAllResources = async (req, res) => {
  try {
    const resources = await Ressource.find().sort({ _id: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/resources/:id
export const deleteResource = async (req, res) => {
  try {
    await Ressource.findByIdAndDelete(req.params.id);
    res.json({ message: "Ressource supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Documents ────────────────────────────────────────────────────────────────
// GET /api/admin/documents
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ _id: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/documents/:id
export const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/documents/:id/validate
export const validateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { statut: "Validé" },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Document introuvable" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import React, { useState } from "react";
import axios from "axios";
import { X, Calendar, Loader } from "lucide-react";

const QuickEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    dateDebut: "",
    category: "",  // ← renommé de "type" à "category"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || !formData.dateDebut || !formData.category) {
      setError("Tous les champs sont obligatoires");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/event/addEvent",
        {
          title: formData.title,
          description: `Événement créé depuis la réservation : ${formData.title}`,
          lieu: "À définir",
          category: formData.category,  // ← category (pas type)
          type: "privé",  // ← type est "public" ou "privé"
          dateDebut: new Date(formData.dateDebut),
          dateFin: new Date(formData.dateDebut),
          nombreParticipants: 0,
          // organisateur_id: userId, ← À SUPPRIMER ! Le backend utilise req.user.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onEventCreated(response.data._id);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Créer un événement
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Nom de l'événement *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Mariage de Sophie"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date de l'événement *</label>
            <input
              type="date"
              required
              value={formData.dateDebut}
              onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner</option>
              <option value="Mariage">Mariage</option>
              <option value="Conference">Conférence</option>
              <option value="Anniversaire">Anniversaire</option>
              <option value="Seminaire">Séminaire</option>
              <option value="autre">Autre</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Options: Mariage, Conference, Anniversaire, Seminaire, autre</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Création..." : "Créer et continuer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickEventModal;
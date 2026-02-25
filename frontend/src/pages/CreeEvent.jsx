import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
});

export default function CreerEvenement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    dateDebut: "",
    dateFin: "",
    nombreParticipants: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation des dates
    if (new Date(formData.dateFin) < new Date(formData.dateDebut)) {
      alert("La date de fin doit être après la date de début ❌");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        nombreParticipants: Number(formData.nombreParticipants),
      };

      await api.post("/event/addEvent", dataToSend);

      alert("Événement créé avec succès ✅");
      navigate("/les_ressources");

    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
      >

        {/* Bouton Retour */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-700 hover:text-white font-medium flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-blue-500 transition"
          >
            ← Retour
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-4">
          Créer un nouvel événement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Titre de l'événement
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Date de début
              </label>
              <input
                type="date"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-slate-300 px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                required
                min={formData.dateDebut}
                className="w-full border border-slate-300 px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Mariage">Mariage</option>
              <option value="Conference">Conférence</option>
              <option value="Anniversaire">Anniversaire</option>
              <option value="Seminaire">Séminaire</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Type + Nombre */}
          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Type d'événement
              </label>
              <div className="flex gap-6">
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="public"
                    onChange={handleChange}
                    required
                  />
                  Public
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="privé"
                    onChange={handleChange}
                  />
                  Privé
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Nombre de participants
              </label>
              <input
                type="number"
                name="nombreParticipants"
                value={formData.nombreParticipants}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-slate-300 px-4 py-2 rounded-lg"
              />
            </div>

          </div>

          {/* Bouton */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 transition"
            >
              Créer l'événement
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
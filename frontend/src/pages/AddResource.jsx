import { useState } from "react";
import axios from "axios";
import "../styles/Addressource.css";

export default function AddResource() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "salle",
    price: "",
    location: "",
    capacity: "",
    provider_name: "",
    provider_email: "",
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (e) => {
    setMediaFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resourceData = new FormData();

      // ✅ On envoie TOUS les champs sans condition
      Object.keys(formData).forEach((key) => {
        resourceData.append(key, formData[key]);
      });

      for (let i = 0; i < mediaFiles.length; i++) {
        resourceData.append("media", mediaFiles[i]);
      }

      const response = await axios.post(
        "http://localhost:5000/api/ressources/add_ressource",
        resourceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ✅ Ne pas mettre Content-Type manuellement avec FormData
            // axios le gère automatiquement avec le bon boundary
          },
        }
      );

      console.log("Ressource ajoutée :", response.data);
      setMessage("Ressource ajoutée avec succès !");
      setFormData({
        name: "",
        description: "",
        type: "salle",
        price: "",
        location: "",
        capacity: "",
        provider_name: "",
        provider_email: "",
      });
      setMediaFiles([]);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  return (
    <div className="add-resource-container">

      {/* ── GAUCHE : Formulaire ── */}
      <div className="add-resource-left">
        <h2>Ajouter une ressource</h2>
        <p className="add-resource-subtitle">Publiez votre ressource et connectez-vous avec des organisateurs.</p>

        <form onSubmit={handleSubmit} className="add-resource-form">

          <div className="form-group span-2">
            <label>Nom :</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Salle Jasmin" required />
          </div>

          <div className="form-group span-2">
            <label>Description :</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez votre ressource..." required />
          </div>

          <div className="form-group">
            <label>Type :</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="salle">Salle</option>
              <option value="materiel">Matériel</option>
              <option value="decoration">Décoration</option>
              <option value="traiteur">Traiteur</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prix :</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" min="0" required />
          </div>

          <div className="form-group">
            <label>Location :</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Ville, adresse..." />
          </div>

          <div className="form-group">
            <label>Capacité :</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Nb. personnes" />
          </div>

          <div className="form-group">
            <label>Nom du prestataire :</label>
            <input name="provider_name" value={formData.provider_name} onChange={handleChange} placeholder="Votre nom" required />
          </div>

          <div className="form-group">
            <label>Email du prestataire :</label>
            <input type="email" name="provider_email" value={formData.provider_email} onChange={handleChange} placeholder="contact@exemple.com" />
          </div>

          <div className="form-group span-2">
            <label>Fichiers médias :</label>
            <input type="file" multiple onChange={handleMediaChange} />
          </div>

          <button className="submit-btn" type="submit">Ajouter la ressource</button>

        </form>

        {message && <p className="message">{message}</p>}
      </div>

      {/* ── DROITE : Image + texte ── */}
      <div className="add-resource-right">
        <div className="add-resource-overlay">
          <div className="overlay-content">
            <div className="overlay-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h1>Publiez vos ressources</h1>
            <p>Connectez-vous avec des milliers d'organisateurs d'événements à la recherche de la ressource parfaite.</p>
            <div className="overlay-stats">
              <div className="overlay-stat">
                <strong>2 400+</strong>
                <span>Ressources publiées</span>
              </div>
              <div className="overlay-stat-divider" />
              <div className="overlay-stat">
                <strong>850+</strong>
                <span>Prestataires actifs</span>
              </div>
              <div className="overlay-stat-divider" />
              <div className="overlay-stat">
                <strong>98%</strong>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
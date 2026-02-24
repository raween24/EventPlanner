import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    firstName: "",
    lastName: "",
    dateNaissance: "",
    region: "",
    numTel: "",
    genre: "homme",
    email: "",
    password: "",
    image: "",
    role: "organisateur",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e) => {
    setForm({ ...form, genre: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // mapping frontend → backend model
    const body = {
      firstname: form.firstName,
      lastname: form.lastName,
      date_de_naissance: form.dateNaissance,
      region: form.region || null,
      numTel: form.numTel || null,
      gender: form.genre,
      email: form.email,
      password: form.password,
      role: form.role,
      image: form.image || null,
      passportOrCid: form.identifier || null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Compte créé avec succès ");

        // redirection login après signup
        navigate("/login");
      } else {
        alert(data.message || "Erreur signup");
      }
    } catch (err) {
      console.log("Erreur serveur:", err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-badge">✦ Event Planner</span>
          <h2>Créer un compte</h2>
          <p className="auth-subtitle">
            Rejoignez la plateforme et gérez vos événements.
          </p>
        </div>

        <div className="auth-divider" />

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="field-wrap span-2">
            <label>CID ou Numéro Passeport</label>
            <input
              name="identifier"
              placeholder="Ex: 12345678 ou AB123456"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-wrap">
            <label>Prénom</label>
            <input name="firstName" onChange={handleChange} required />
          </div>

          <div className="field-wrap">
            <label>Nom</label>
            <input name="lastName" onChange={handleChange} required />
          </div>

          <div className="field-wrap">
            <label>Date de naissance</label>
            <input type="date" name="dateNaissance" onChange={handleChange} required />
          </div>

          <div className="field-wrap">
            <label>Région</label>
            <input name="region" onChange={handleChange} />
          </div>

          <div className="field-wrap">
            <label>Téléphone</label>
            <input type="number" name="numTel" onChange={handleChange} />
          </div>

          <div className="field-wrap">
            <label>Genre</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  value="homme"
                  checked={form.genre === "homme"}
                  onChange={handleGenreChange}
                />
                Homme
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  value="femme"
                  checked={form.genre === "femme"}
                  onChange={handleGenreChange}
                />
                Femme
              </label>
            </div>
          </div>

          <div className="field-wrap span-2">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="field-wrap span-2">
            <label>Mot de passe</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <div className="field-wrap span-2">
            <label>Rôle</label>
            <select name="role" onChange={handleChange}>
              <option value="organisateur">Organisateur</option>
              <option value="prestataire">Prestataire</option>
            </select>
          </div>

          <div className="field-wrap span-2">
            <label>Photo de profil</label>
            <div className="image-upload-wrap">
              <label className="image-upload-label" htmlFor="imageInput">
                {preview ? (
                  <img src={preview} alt="preview" className="image-preview" />
                ) : (
                  <div className="image-upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Cliquez pour choisir une photo</span>
                  </div>
                )}
              </label>

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn span-2">
            Créer le compte
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ?{" "}
          <span onClick={() => navigate("/login")}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}
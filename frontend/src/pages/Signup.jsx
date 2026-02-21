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
    genre: "homme", // default
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

    const body = {
      ...form,
      CID: form.identifier.length === 8 ? form.identifier : "",
      numPassport: form.identifier.length !== 8 ? form.identifier : "",
    };
    delete body.identifier;

    try {
      const res = await fetch("http://localhost:7000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Compte créé avec succès ✅");
        navigate("/");
      } else {
        alert(data || "Erreur signup");
      }
    } catch (err) {
      console.log(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-badge">✦ Event Planner</span>
          <h2>Créer un compte</h2>
          <p className="auth-subtitle">Rejoignez la plateforme et gérez vos événements.</p>
        </div>

        <div className="auth-divider" />

        <form className="signup-form" onSubmit={handleSubmit}>

          {/* Identifiant */}
          <div className="field-wrap span-2">
            <label>CID ou Numéro Passeport</label>
            <input
              name="identifier"
              placeholder="Ex: 12345678 ou AB123456"
              onChange={handleChange}
              required
            />
          </div>

          {/* Prénom + Nom */}
          <div className="field-wrap">
            <label>Prénom</label>
            <input name="firstName" placeholder="Prénom" onChange={handleChange} required />
          </div>
          <div className="field-wrap">
            <label>Nom</label>
            <input name="lastName" placeholder="Nom" onChange={handleChange} required />
          </div>

          {/* Date + Région */}
          <div className="field-wrap">
            <label>Date de naissance</label>
            <input type="date" name="dateNaissance" onChange={handleChange} required />
          </div>
          <div className="field-wrap">
            <label>Région</label>
            <input name="region" placeholder="Ex: Tunis, Sfax..." onChange={handleChange} />
          </div>

          {/* Téléphone */}
          <div className="field-wrap">
            <label>Téléphone</label>
            <input type="number" name="numTel" placeholder="+216 XX XXX XXX" onChange={handleChange} />
          </div>

          {/* Genre avec Radio */}
          <div className="field-wrap">
            <label>Genre</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="genre"
                  value="homme"
                  checked={form.genre === "homme"}
                  onChange={handleGenreChange}
                />
                Homme
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="genre"
                  value="femme"
                  checked={form.genre === "femme"}
                  onChange={handleGenreChange}
                />
                Femme
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="field-wrap span-2">
            <label>Email</label>
            <input type="email" name="email" placeholder="vous@exemple.com" onChange={handleChange} required />
          </div>

          {/* Mot de passe */}
          <div className="field-wrap span-2">
            <label>Mot de passe</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          {/* Rôle */}
          <div className="field-wrap span-2">
            <label>Rôle</label>
            <select name="role" onChange={handleChange}>
              <option value="organisateur">Organisateur</option>
              <option value="prestataire">Prestataire</option>
            </select>
          </div>

          {/* Photo */}
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
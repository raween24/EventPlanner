import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    passportOrCid: "",
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
      passportOrCid: form.passportOrCid || null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Compte créé avec succès");
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

      {/* ===== BACK BUTTON ===== */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Retour
      </button>

      {/* ===== LEFT — FORM ===== */}
      <div className="auth-left">
        <div className="form-wrapper">

          <div className="auth-card-header">
            <span className="auth-badge">✦ Event Planner</span>
            <h2>Créer un compte</h2>
            <p className="auth-subtitle">
              Rejoignez la plateforme et gérez vos événements.
            </p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>

            {/* CID / Passeport */}
            <div className="field-wrap span-2">
              <label>CID ou Numéro Passeport</label>
              <input
                name="passportOrCid"
                placeholder="Ex: 12345678 ou AB123456"
                onChange={handleChange}
                required
              />
            </div>

            {/* Prénom + Nom */}
            <div className="field-wrap">
              <label>Prénom</label>
              <input name="firstName" placeholder="Votre prénom" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Nom</label>
              <input name="lastName" placeholder="Votre nom" onChange={handleChange} required />
            </div>

            {/* Date + Région */}
            <div className="field-wrap">
              <label>Date de naissance</label>
              <input type="date" name="dateNaissance" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Région</label>
              <input name="region" placeholder="Votre région" onChange={handleChange} />
            </div>

            {/* Téléphone + Genre */}
            <div className="field-wrap">
              <label>Téléphone</label>
              <input type="number" name="numTel" placeholder="Ex: 0612345678" onChange={handleChange} />
            </div>

            {/* Genre — radio inline stylés */}
            <div className="field-wrap">
              <label>Genre</label>
              <div className="radio-options">

                <label className="radio-option">
                  <input
                    type="radio"
                    name="genre"
                    value="homme"
                    checked={form.genre === "homme"}
                    onChange={handleGenreChange}
                  />
                  <span className="radio-label">
                    <span className="radio-dot"></span>
                    <span className="radio-icon"></span>
                    Homme
                  </span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="genre"
                    value="femme"
                    checked={form.genre === "femme"}
                    onChange={handleGenreChange}
                  />
                  <span className="radio-label">
                    <span className="radio-dot"></span>
                    <span className="radio-icon"></span>
                    Femme
                  </span>
                </label>

              </div>
            </div>

            {/* Email */}
            <div className="field-wrap span-2">
              <label>Email</label>
              <input type="email" name="email" placeholder="exemple@email.com" onChange={handleChange} required />
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

            {/* Photo de profil — rectangle stylé */}
            <div className="photo-upload-wrap">
              <label className="field-label">Photo de profil</label>

              <label
                className={`photo-upload-area ${preview ? "has-photo" : ""}`}
                htmlFor="imageInput"
              >
                {/* État vide */}
                {!preview && (
                  <div className="photo-placeholder">
                    <div className="photo-placeholder-icon">
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </div>
                    <div className="photo-placeholder-text">
                      <strong>Ajouter une photo de profil</strong>
                      <span>Cliquez ou glissez une image ici · JPG, PNG ou WEBP — max 5 MB</span>
                    </div>
                    <div className="photo-upload-badge">Parcourir</div>
                  </div>
                )}

                {/* État prévisualisation */}
                {preview && (
                  <div className="photo-preview-wrap">
                    <img src={preview} alt="Photo de profil" />
                    <div className="photo-preview-overlay">
                      <div className="photo-change-btn">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
                          />
                        </svg>
                        Changer la photo
                      </div>
                    </div>
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

            {/* Submit */}
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

      {/* ===== RIGHT — IMAGE ===== */}
      <div className="split-right">
        <div className="image-overlay">
          <div className="overlay-content">
            <h1>Gérez vos événements</h1>
            <p>Créez, planifiez et coordonnez tous vos événements en un seul endroit.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
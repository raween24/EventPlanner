import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [showPendingPopup, setShowPendingPopup] = useState(false);

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
    const formData = new FormData();

    formData.append("firstname", form.firstName);
    formData.append("lastname", form.lastName);
    formData.append("date_de_naissance", form.dateNaissance);
    formData.append("region", form.region || "");
    formData.append("numTel", form.numTel || "");
    formData.append("gender", form.genre);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    formData.append("passportOrCid", form.passportOrCid || "");

    if (form.image) {
      formData.append("image", form.image);
    }
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user.status === "en_attente") {
          setShowPendingPopup(true);
        } else {
          alert("Compte créé avec succès");
          navigate("/login");
        }
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
      {showPendingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fadeIn">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden relative animate-slideUp">

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full opacity-20 animate-pulse-slower"></div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setShowPendingPopup(false);
                navigate("/login");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="relative p-8">

              {/* Animated Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>

                  {/* Rotating ring */}
                  <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-spin-slow"></div>

                  {/* Main icon */}
                  <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-2xl p-5 shadow-lg shadow-yellow-200 animate-float">
                    <div className="animate-spin-slow">
                      ⏳
                    </div>
                  </div>

                  {/* Success checkmark */}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg animate-bounce-in">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title with gradient */}
              <h3 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-yellow-600 to-indigo-600 bg-clip-text text-transparent animate-slideDown">
                Demande envoyée !
              </h3>

              {/* Message */}
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-center leading-relaxed animate-slideUp delay-100">
                  Votre compte prestataire est en cours de validation par l'administrateur.
                </p>

                {/* Animated progress bar */}
                {/* Barre de progression - Option 2 : Pulsation */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute h-full bg-gradient-to-r from-yellow-400 via-indigo-400 to-yellow-400 rounded-full"
                  />
                </div>

                {/* Info icons */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1 animate-bounce-gentle">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1 animate-bounce-gentle delay-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span>Notification</span>
                  </div>
                </div>
              </div>

              {/* Estimated time */}
              <div className="bg-gradient-to-r from-yellow-50 to-indigo-50 rounded-xl p-4 mb-6 animate-scaleUp">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Temps estimé</span>
                  <span className="font-semibold text-indigo-600 animate-pulse">
                    24-48 heures
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>Début</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <span>Finalisation</span>
                </div>
              </div>

              {/* Main button */}
              <button
                onClick={() => {
                  setShowPendingPopup(false);
                  navigate("/login");
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">J'ai compris</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>

              {/* Footer note */}
              <p className="text-xs text-center text-gray-400 mt-4 animate-fadeIn delay-500">
                Vous recevrez une confirmation une fois votre demande approuvée
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
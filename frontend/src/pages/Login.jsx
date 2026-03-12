import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import axios from "axios";

export default function Login() {
  const [showPendingPopup, setShowPendingPopup] = useState(false);

  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      // 🚨 prestataire en attente
      if (res.status === 403) {
        setShowPendingPopup(true);
        return;
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) throw new Error("Pas de token reçu de Google");

      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      // stocke token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`Bienvenue ${res.data.user.firstname || res.data.user.name || "Utilisateur"}`);

      //  redirection vers Home, RoleGuard fera la protection
      navigate("/");

    } catch (err) {
      alert("Erreur connexion Google : " + (err.response?.data?.message || err.message || "Inconnue"));
    }
  };

  const triggerGoogle = () => {
    const btn = googleBtnRef.current?.querySelector("div[role=button]");
    if (btn) btn.click();
  };

  return (
    <div className="split-container">

      {/* ===== LEFT — FORM ===== */}
      <div className="split-left">
        <div className="form-container">

          {/* ===== BACK BUTTON ===== */}
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Retour
          </button>

          <div className="form-header">
            <span className="badge">✦ Event Planner</span>
            <h2>Connexion</h2>
            <p className="subtitle">Connectez-vous pour gérer vos événements.</p>
          </div>

          <form className="split-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="vous@exemple.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            {/* Divider */}
            <div className="google-divider-wrap">
              <span className="google-divider-text">ou continuer avec</span>
            </div>

            {/* Google Button */}
            <button type="button" className="google-custom-btn" onClick={triggerGoogle}>
              <span className="google-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </span>
              <span className="google-btn-text">Se connecter avec Google</span>
            </button>

            {/* Hidden real GoogleLogin */}
            <div className="google-hidden" ref={googleBtnRef}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("La connexion Google a échoué")}
                useOneTap={false}
              />
            </div>

            <button type="submit" className="submit-btn">
              Se connecter
            </button>

          </form>

          <p className="signup-link">
            Pas de compte ?{" "}
            <span onClick={() => navigate("/signup")}>S'inscrire</span>
          </p>

        </div>
      </div>

      {/* ===== RIGHT — IMAGE ===== */}
      <div className="split-right">
        <div className="image-overlay">
          <div className="overlay-content">
            <h1>Event Planner</h1>
            <p>Organisez vos événements en toute simplicité</p>
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
                Demande en cours de traitement !
              </h3>

              {/* Message */}
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-center leading-relaxed animate-slideUp delay-100">
                  Votre compte prestataire est en cours de validation par l'administrateur.
                </p>

                {/* Animated progress bar */}
                {/* Barre de progression - Option 3 : Segments animés */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <motion.div
                      animate={{ x: ['-100%', '400%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-1/3 h-full bg-gradient-to-r from-yellow-400 via-indigo-400 to-yellow-400"
                    />
                  </div>
                </div>
                {/* Info icons */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">

                   
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
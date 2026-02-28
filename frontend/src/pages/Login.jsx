import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Bienvenue ${data.user.firstname}`);
        navigate("/");
      } else {
        alert(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur serveur :", err);
      alert("Erreur serveur");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) throw new Error("Pas de token reçu de Google");
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`Bienvenue ${res.data.user.firstname || res.data.user.name || "Utilisateur"}`);
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

            {/* Beautiful Google Button */}
            <button type="button" className="google-custom-btn" onClick={triggerGoogle}>
              <span className="google-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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

    </div>
  );
}
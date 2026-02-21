import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // ici on connectera le backend
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-badge">✦ Event Planner</span>
          <h2>Connexion</h2>
          <p className="auth-subtitle">
            Connectez-vous pour gérer vos événements.
          </p>
        </div>

        <div className="auth-divider" />

        <form className="auth-form login-form" onSubmit={handleSubmit}>
          <div className="field-wrap">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="vous@exemple.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-wrap">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Se connecter
          </button>
        </form>

        <p className="auth-link">
          Pas de compte ?{" "}
          <span onClick={() => navigate("/signup")}>
            S'inscrire
          </span>
        </p>
      </div>
    </div>
  );
}

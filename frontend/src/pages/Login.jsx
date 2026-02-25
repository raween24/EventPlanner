import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(`Bienvenue ${data.user.firstname} `);
        navigate("/");
      } else {
        alert(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.log("Erreur serveur:", err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="split-container">
      {/* Left side - Formulaire */}
      <div className="split-left">
        <div className="form-container">
          <div className="form-header">
            <span className="badge">✦ Event Planner</span>
            <h2>Connexion</h2>
            <p className="subtitle">
              Connectez-vous pour gérer vos événements.
            </p>
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

            {/* ===== Google Login Button ===== */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await axios.post(
                      "http://localhost:5000/api/auth/google",
                      {
                        token: credentialResponse.credential,
                      }
                    );

                    // Récupère l'utilisateur et JWT
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("user", JSON.stringify(res.data.user));

                    alert(
                      `Bienvenue ${res.data.user.firstname || res.data.user.name}`
                    );
                    navigate("/");
                  } catch (err) {
                    console.error(err);
                    alert("Erreur lors de la connexion Google");
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                  alert("Connexion Google échouée");
                }}
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

      {/* Right side - Image */}
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
import { useNavigate } from "react-router-dom";

export default function SignupChoice() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-left" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
        <div className="form-wrapper" style={{ textAlign: "center" }}>

          <div className="auth-card-header">
            <span className="auth-badge">✦ Event Planner</span>
            <h2>Vous êtes ?</h2>
            <p className="auth-subtitle">Choisissez votre rôle pour créer votre compte.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>

            <button className="auth-btn" onClick={() => navigate("/signup/organisateur")}
              style={{ padding: "18px 24px", fontSize: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 28 }}>🎯</span>
              <strong>Organisateur</strong>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Je crée et gère des événements</span>
            </button>

            <button className="auth-btn" onClick={() => navigate("/signup/prestataire")}
              style={{ padding: "18px 24px", fontSize: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <span style={{ fontSize: 28 }}>🛠️</span>
              <strong>Prestataire</strong>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Je propose des services</span>
            </button>

          </div>

          <p className="auth-link" style={{ marginTop: 24 }}>
            Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span>
          </p>

        </div>
      </div>

      <div className="split-right">
        <div className="image-overlay">
          <div className="overlay-content">
            <h1>Bienvenue</h1>
            <p>La plateforme qui connecte organisateurs et prestataires.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
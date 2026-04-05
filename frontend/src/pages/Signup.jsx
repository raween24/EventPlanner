import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import "../styles/signup.css";

const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
    <AnimatePresence>
      {toasts.map(t => {
        const cfg = {
          success: { bg: "#f0fdf4", border: "#86efac", color: "#16a34a", icon: <CheckCircle size={18} /> },
          error:   { bg: "#fef2f2", border: "#fca5a5", color: "#dc2626", icon: <XCircle size={18} /> },
          info:    { bg: "#eff6ff", border: "#93c5fd", color: "#2563eb", icon: <Info size={18} /> },
          warning: { bg: "#fffbeb", border: "#fcd34d", color: "#d97706", icon: <AlertTriangle size={18} /> },
        }[t.type] || {};
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: "13px 16px", minWidth: 300, maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,.1)", pointerEvents: "all" }}
          >
            <span style={{ color: cfg.color, flexShrink: 0 }}>{cfg.icon}</span>
            <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, pointerEvents: "all" }}>
              <X size={14} />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
  };
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
  return {
    toasts, remove,
    success: m => add(m, "success"),
    error:   m => add(m, "error"),
    info:    m => add(m, "info"),
    warning: m => add(m, "warning"),
  };
};

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();

  const [role, setRole] = useState("organisateur");
  const [showPendingPopup, setShowPendingPopup] = useState(false);
  const [form, setForm] = useState({
    firstname: "", lastname: "", email: "", password: "", patente: "", image: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setForm({ ...form, image: file });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm(f => ({ ...f, patente: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", form.firstname);
    formData.append("lastname", form.lastname);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", role);
    if (role === "prestataire") formData.append("patente", form.patente);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        if (role === "prestataire") {
          setShowPendingPopup(true);
        } else {
          toast.success("Compte créé avec succès ! 🎉");
          setTimeout(() => navigate("/login"), 1200);
        }
      } else {
        toast.error(data.message || "Erreur lors de la création du compte");
      }
    } catch (err) {
      toast.error("Erreur serveur — veuillez réessayer");
    }
  };

  const isPrestataire = role === "prestataire";

  return (
    <div className="auth-container">
      <ToastContainer toasts={toast.toasts} removeToast={toast.remove} />

      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Retour
      </button>

      <div className="auth-left">
        <div className="form-wrapper">

          <div className="auth-card-header">
            <span className="auth-badge">✦ Event Planner</span>
            <h2>Créer un compte</h2>
            <p className="auth-subtitle">
              {isPrestataire
                ? "Proposez vos services aux organisateurs d'événements."
                : "Gérez et planifiez vos événements."}
            </p>
          </div>

          {/* ── Toggle rôle ── */}
          <div style={{
            display: "flex",
            background: "#f1f5f9",
            borderRadius: 12,
            padding: 4,
            gap: 4,
            marginBottom: 28,
          }}>
            <button
              type="button"
              onClick={() => handleRoleChange("organisateur")}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: !isPrestataire ? "#fff" : "transparent",
                color: !isPrestataire ? "#2563eb" : "#64748b",
                boxShadow: !isPrestataire ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
              }}
            >
              🎯 Organisateur
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("prestataire")}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: isPrestataire ? "#fff" : "transparent",
                color: isPrestataire ? "#7c3aed" : "#64748b",
                boxShadow: isPrestataire ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
              }}
            >
              🛠️ Prestataire
            </button>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>

            <div className="field-wrap">
              <label>Prénom</label>
              <input name="firstname" placeholder="Votre prénom" value={form.firstname} onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Nom</label>
              <input name="lastname" placeholder="Votre nom" value={form.lastname} onChange={handleChange} required />
            </div>

            <div className="field-wrap span-2">
              <label>Email</label>
              <input type="email" name="email" placeholder="exemple@email.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="field-wrap span-2">
              <label>Mot de passe</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            {/* ── Patente — uniquement prestataire ── */}
            <AnimatePresence>
              {isPrestataire && (
                <motion.div
                  className="field-wrap span-2"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <label>Numéro de patente</label>
                  <input
                    name="patente"
                    placeholder="Ex: TU-123456"
                    value={form.patente}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Photo de profil ── */}
            <div className="photo-upload-wrap">
              <label className="field-label">Photo de profil</label>
              <label className={`photo-upload-area ${preview ? "has-photo" : ""}`} htmlFor="imageInput">
                {!preview ? (
                  <div className="photo-placeholder">
                    <div className="photo-placeholder-icon">
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                    </div>
                    <div className="photo-placeholder-text">
                      <strong>Ajouter une photo de profil</strong>
                      <span>Cliquez ou glissez une image ici · JPG, PNG ou WEBP — max 5 MB</span>
                    </div>
                    <div className="photo-upload-badge">Parcourir</div>
                  </div>
                ) : (
                  <div className="photo-preview-wrap">
                    <img src={preview} alt="Photo de profil" />
                    <div className="photo-preview-overlay">
                      <div className="photo-change-btn">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                        </svg>
                        Changer la photo
                      </div>
                    </div>
                  </div>
                )}
              </label>
              <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </div>

            <button type="submit" className="auth-btn span-2">
              {isPrestataire ? "Envoyer ma demande" : "Créer mon compte"}
            </button>

          </form>

          <p className="auth-link">
            Déjà un compte ?{" "}
            <span onClick={() => navigate("/login")}>Se connecter</span>
          </p>

        </div>
      </div>

      {/* ── Partie droite ── */}
      <div className="split-right">
        <div className="image-overlay">
          <div className="overlay-content">
            <h1>{isPrestataire ? "Proposez vos services" : "Gérez vos événements"}</h1>
            <p>
              {isPrestataire
                ? "Rejoignez notre réseau de prestataires et développez votre activité."
                : "Créez, planifiez et coordonnez tous vos événements en un seul endroit."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Popup en attente ── */}
      {showPendingPopup && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 50, padding: 16 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: 420, overflow: "hidden", position: "relative" }}
          >
            <button
              onClick={() => { setShowPendingPopup(false); navigate("/login"); }}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
            >
              <X size={20} />
            </button>

            <div style={{ padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>
                Demande envoyée !
              </h3>
              <p style={{ color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
                Votre compte prestataire est en cours de validation par l'administrateur.
              </p>

              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>Temps estimé</span>
                  <span style={{ fontWeight: 600, color: "#6366f1" }}>24-48 heures</span>
                </div>
              </div>

              <button
                onClick={() => { setShowPendingPopup(false); navigate("/login"); }}
                style={{ width: "100%", background: "#4f46e5", color: "#fff", fontWeight: 600, padding: "14px 0", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 15 }}
              >
                J'ai compris
              </button>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 16 }}>
                Vous recevrez une confirmation une fois votre demande approuvée
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
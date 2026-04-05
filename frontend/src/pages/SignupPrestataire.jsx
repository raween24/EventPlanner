import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import "../styles/signup.css";

// ─── Toast (même code) ────────────────────────────────────────────────────────
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
          <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} transition={{ duration: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: "13px 16px", minWidth: 300, maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,.1)", pointerEvents: "all" }}>
            <span style={{ color: cfg.color, flexShrink: 0 }}>{cfg.icon}</span>
            <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, pointerEvents: "all" }}><X size={14} /></button>
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
  return { toasts, remove, success: m => add(m, "success"), error: m => add(m, "error"), info: m => add(m, "info"), warning: m => add(m, "warning") };
};

// ─── Signup Prestataire ───────────────────────────────────────────────────────
export default function SignupPrestataire() {
  const navigate = useNavigate();
  const toast = useToast();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", form.firstname);
    formData.append("lastname", form.lastname);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("patente", form.patente);
    formData.append("role", "prestataire"); // ✅ fixe
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setShowPendingPopup(true); // ✅ toujours en_attente pour prestataire
      } else {
        toast.error(data.message || "Erreur lors de la création du compte");
      }
    } catch (err) {
      toast.error("Erreur serveur — veuillez réessayer");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer toasts={toast.toasts} removeToast={toast.remove} />

      <button className="back-btn" onClick={() => navigate("/role-guard")}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Retour
      </button>

      <div className="auth-left">
        <div className="form-wrapper">
          <div className="auth-card-header">
            <span className="auth-badge">✦ Prestataire</span>
            <h2>Créer un compte</h2>
            <p className="auth-subtitle">Proposez vos services aux organisateurs d'événements.</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>

            <div className="field-wrap">
              <label>Prénom</label>
              <input name="firstname" placeholder="Votre prénom" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Nom</label>
              <input name="lastname" placeholder="Votre nom" onChange={handleChange} required />
            </div>

            <div className="field-wrap span-2">
              <label>Email</label>
              <input type="email" name="email" placeholder="exemple@email.com" onChange={handleChange} required />
            </div>

            <div className="field-wrap span-2">
              <label>Mot de passe</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            {/* ✅ Champ spécifique prestataire */}
            <div className="field-wrap span-2">
              <label>Numéro de patente</label>
              <input name="patente" placeholder="Ex: TU-123456" onChange={handleChange} required />
            </div>

            <div className="photo-upload-wrap">
              <label className="field-label">Photo de profil</label>
              <label className={`photo-upload-area ${preview ? "has-photo" : ""}`} htmlFor="imageInput">
                {!preview ? (
                  <div className="photo-placeholder">
                    <div className="photo-placeholder-text">
                      <strong>Ajouter une photo de profil</strong>
                      <span>JPG, PNG ou WEBP — max 5 MB</span>
                    </div>
                    <div className="photo-upload-badge">Parcourir</div>
                  </div>
                ) : (
                  <div className="photo-preview-wrap">
                    <img src={preview} alt="Photo de profil" />
                  </div>
                )}
              </label>
              <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </div>

            <button type="submit" className="auth-btn span-2">Envoyer ma demande</button>
          </form>

          <p className="auth-link">
            Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span>
          </p>
        </div>
      </div>

      <div className="split-right">
        <div className="image-overlay">
          <div className="overlay-content">
            <h1>Proposez vos services</h1>
            <p>Rejoignez notre réseau de prestataires et développez votre activité.</p>
          </div>
        </div>
      </div>

      {/* Pending popup — identique à ton code actuel */}
      {showPendingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden relative">
            <button onClick={() => { setShowPendingPopup(false); navigate("/login"); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <X size={20} />
            </button>
            <div className="relative p-8 text-center">
              <div className="text-5xl mb-4">⏳</div>
              <h3 className="text-2xl font-bold mb-3">Demande envoyée !</h3>
              <p className="text-gray-600 mb-6">Votre compte prestataire est en cours de validation par l'administrateur.</p>
              <button onClick={() => { setShowPendingPopup(false); navigate("/login"); }} className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl">
                J'ai compris
              </button>
              <p className="text-xs text-gray-400 mt-4">Vous recevrez une confirmation sous 24-48h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
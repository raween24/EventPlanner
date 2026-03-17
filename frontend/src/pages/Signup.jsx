import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import "../styles/signup.css";

// ─── Toast system ─────────────────────────────────────────────────────────────
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
            style={{ display: "flex", alignItems: "center", gap: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: "13px 16px", minWidth: 300, maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,.1)", pointerEvents: "all" }}
          >
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

// ─── Signup ───────────────────────────────────────────────────────────────────
export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPendingPopup, setShowPendingPopup] = useState(false);

  const [form, setForm] = useState({
    passportOrCid: "", firstName: "", lastName: "", dateNaissance: "",
    region: "", numTel: "", genre: "homme", email: "", password: "", image: "", role: "organisateur",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleGenreChange = (e) => setForm({ ...form, genre: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, image: file });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        if (data.user.status === "en_attente") {
          setShowPendingPopup(true);
        } else {
          toast.success("Compte créé avec succès ! 🎉");
          setTimeout(() => navigate("/login"), 1200);
        }
      } else {
        toast.error(data.message || "Erreur lors de la création du compte");
      }
    } catch (err) {
      console.log("Erreur serveur:", err);
      toast.error("Erreur serveur — veuillez réessayer");
    }
  };

  return (
    <div className="auth-container">

      {/* Toast notifications */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.remove} />

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
            <p className="auth-subtitle">Rejoignez la plateforme et gérez vos événements.</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>

            <div className="field-wrap span-2">
              <label>CID ou Numéro Passeport</label>
              <input name="passportOrCid" placeholder="Ex: 12345678 ou AB123456" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Prénom</label>
              <input name="firstName" placeholder="Votre prénom" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Nom</label>
              <input name="lastName" placeholder="Votre nom" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Date de naissance</label>
              <input type="date" name="dateNaissance" max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]} onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label>Région</label>
              <input name="region" placeholder="Votre région" onChange={handleChange} />
            </div>

            <div className="field-wrap">
              <label>Téléphone</label>
              <input type="number" name="numTel" placeholder="Ex: +216 12 345 678" onChange={handleChange} />
            </div>

            <div className="field-wrap">
              <label>Genre</label>
              <div className="radio-options">
                <label className="radio-option">
                  <input type="radio" name="genre" value="homme" checked={form.genre === "homme"} onChange={handleGenreChange} />
                  <span className="radio-label"><span className="radio-dot"></span>Homme</span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="genre" value="femme" checked={form.genre === "femme"} onChange={handleGenreChange} />
                  <span className="radio-label"><span className="radio-dot"></span>Femme</span>
                </label>
              </div>
            </div>

            <div className="field-wrap span-2">
              <label>Email</label>
              <input type="email" name="email" placeholder="exemple@email.com" onChange={handleChange} required />
            </div>

            <div className="field-wrap span-2">
              <label>Mot de passe</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <div className="field-wrap span-2">
              <label>Rôle</label>
              <select name="role" onChange={handleChange}>
                <option value="organisateur">Organisateur</option>
                <option value="prestataire">Prestataire</option>
              </select>
            </div>

            <div className="photo-upload-wrap">
              <label className="field-label">Photo de profil</label>
              <label className={`photo-upload-area ${preview ? "has-photo" : ""}`} htmlFor="imageInput">
                {!preview && (
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
                )}
                {preview && (
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

            <button type="submit" className="auth-btn span-2">Créer le compte</button>

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

      {/* ===== PENDING POPUP ===== */}
      {showPendingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden relative animate-slideUp">

            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full opacity-20 animate-pulse-slower"></div>
            </div>

            <button onClick={() => { setShowPendingPopup(false); navigate("/login"); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative p-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-spin-slow"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-2xl p-5 shadow-lg shadow-yellow-200 animate-float">
                    <div className="animate-spin-slow">⏳</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg animate-bounce-in">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-yellow-600 to-indigo-600 bg-clip-text text-transparent">
                Demande envoyée !
              </h3>

              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-center leading-relaxed">
                  Votre compte prestataire est en cours de validation par l'administrateur.
                </p>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <motion.div animate={{ x: ['-100%', '400%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-1/3 h-full bg-gradient-to-r from-yellow-400 via-indigo-400 to-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Temps estimé</span>
                  <span className="font-semibold text-indigo-600 animate-pulse">24-48 heures</span>
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

              <button onClick={() => { setShowPendingPopup(false); navigate("/login"); }} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                <span className="relative z-10">J'ai compris</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Vous recevrez une confirmation une fois votre demande approuvée
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
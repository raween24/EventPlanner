import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import NavbarProfileOrg from "../components/navbarProfileOrg";

/* ── SVG Icons ── */
const Ic = {
  bag:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  box:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  service:  (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  send:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  trash:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  plus:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  clock:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  xmark:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  card:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  info:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  upload:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  user:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  calendar: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  event:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  search:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  lock:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

const cx = (...a) => a.filter(Boolean).join(" ");

/* ── TOAST ── */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  const colors = { success: "#10B981", error: "#EF4444", info: "#6366F1", warning: "#F59E0B" };
  return (
    <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-2xl"
      style={{ background: colors[toast.type] || colors.info, animation: "toastIn .28s cubic-bezier(.34,1.56,.64,1)", maxWidth: 360 }}>
      {toast.type === "success" ? <Ic.check width={16} height={16} /> : toast.type === "error" ? <Ic.xmark width={16} height={16} /> : <Ic.info width={16} height={16} />}
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition"><Ic.close width={15} height={15} /></button>
    </div>
  );
}

/* ── STATUS PILL ── */
function StatusPill({ status }) {
  const cfg = {
    "en attente": { bg: "#FEF3C7", fg: "#92400E", Icon: Ic.clock, label: "En attente" },
    "acceptée":   { bg: "#D1FAE5", fg: "#065F46", Icon: Ic.check, label: "Acceptée"   },
    "refusée":    { bg: "#FEE2E2", fg: "#991B1B", Icon: Ic.xmark, label: "Refusée"    },
  };
  const c = cfg[status] || cfg["en attente"];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
      style={{ background: c.bg, color: c.fg }}>
      <c.Icon width={11} height={11} /> {c.label}
    </span>
  );
}

/* ── TYPE BADGE ── */
function TypeBadge({ type }) {
  return type === "product" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: "#DCFCE7", color: "#166534" }}>
      <Ic.box width={11} height={11} /> Produit
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: "#EDE9FE", color: "#5B21B6" }}>
      <Ic.service width={11} height={11} /> Service
    </span>
  );
}

/* ── form field helper ── */
const fieldCls = (err) => cx(
  "w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition",
  err ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-100"
      : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
);
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-rose-500 text-[10px] mt-1">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   AUTH MODAL INLINE
   Modal de connexion/inscription sans redirection
───────────────────────────────────────────────────── */
function AuthModal({ isOpen, onClose, pendingItem, onAuthSuccess }) {
  const [tab, setTab] = useState("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstname: "", lastname: "", email: "", password: ""
  });

  useEffect(() => {
    if (isOpen) {
      setError("");
      setLoginForm({ email: "", password: "" });
      setSignupForm({ firstname: "", lastname: "", email: "", password: "" });
      setTab("login");
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();
      if (res.status === 403) { setError("Votre compte prestataire est en cours de validation (24-48h)."); return; }
      if (!res.ok) { setError(data.message || "Email ou mot de passe incorrect"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuthSuccess();
    } catch {
      setError("Erreur serveur, veuillez réessayer.");
    } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("firstname", signupForm.firstname);
      fd.append("lastname", signupForm.lastname);
      fd.append("email", signupForm.email);
      fd.append("password", signupForm.password);
      fd.append("role", "organisateur");
      const res = await fetch("http://localhost:5000/api/users/register", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur lors de la création du compte"); return; }
      // Auto-login après inscription
      const loginRes = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupForm.email, password: signupForm.password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(loginData.user));
        onAuthSuccess();
      }
    } catch {
      setError("Erreur serveur, veuillez réessayer.");
    } finally { setLoading(false); }
  };

  const handleGoogle = () => {
    // Sauvegarder l'item en attente, puis rediriger vers Google OAuth
    // (gardez votre flux Google existant si vous en avez un)
    window.location.href = "/login?redirect=/mes-reservations";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,30,.65)", backdropFilter: "blur(8px)", animation: "fadeIn .2s ease" }}
    >
      <div
        className="w-full max-w-[400px] rounded-3xl bg-white overflow-hidden shadow-2xl"
        style={{ animation: "modalIn .25s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#4338CA)" }}>
          <div className="flex items-center gap-2 text-white">
            <Ic.lock width={16} height={16} className="opacity-80" />
            <span className="font-bold text-sm">
              {tab === "login" ? "Connectez-vous pour envoyer" : "Créez un compte pour envoyer"}
            </span>
          </div>
          <button onClick={onClose}
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition">
            <Ic.close width={15} height={15} />
          </button>
        </div>

        {/* Context — ressource concernée */}
        {pendingItem && (
          <div className="mx-5 mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: "#EEF2FF", color: "#3730A3" }}>
            <Ic.info width={13} height={13} className="flex-shrink-0" />
            <span>Demande pour&nbsp;: <strong>{pendingItem.resourceName}</strong></span>
            <TypeBadge type={pendingItem.type || "service"} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex mx-5 mt-4 border-b border-gray-100">
          {[["login","Connexion"],["signup","Inscription"]].map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all border-b-2"
              style={{
                color: tab === t ? "#4338CA" : "#9CA3AF",
                borderBottomColor: tab === t ? "#4338CA" : "transparent"
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="px-5 py-5">

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
              style={{ background: "#FEF2F2", color: "#991B1B" }}>
              <Ic.xmark width={13} height={13} /> {error}
            </div>
          )}

          {/* Google button */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm font-medium text-gray-700 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-3">
              <Field label="Email" required>
                <input type="email" placeholder="vous@exemple.com" value={loginForm.email}
                  onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  className={fieldCls(false)} required />
              </Field>
              <Field label="Mot de passe" required>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="••••••••" value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    className={cx(fieldCls(false), "pr-10")} required />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <Ic.eyeOff width={15} height={15} /> : <Ic.eye width={15} height={15} />}
                  </button>
                </div>
              </Field>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 mt-1"
                style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connexion...</>
                  : <><Ic.send width={13} height={13} /> Se connecter et envoyer</>}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                Pas de compte ?{" "}
                <button type="button" onClick={() => { setTab("signup"); setError(""); }}
                  className="text-indigo-600 font-semibold hover:underline">S'inscrire</button>
              </p>
            </form>
          )}

          {/* SIGNUP FORM */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom" required>
                  <input type="text" placeholder="Sophie" value={signupForm.firstname}
                    onChange={e => setSignupForm(p => ({ ...p, firstname: e.target.value }))}
                    className={fieldCls(false)} required />
                </Field>
                <Field label="Nom" required>
                  <input type="text" placeholder="Martin" value={signupForm.lastname}
                    onChange={e => setSignupForm(p => ({ ...p, lastname: e.target.value }))}
                    className={fieldCls(false)} required />
                </Field>
              </div>
              <Field label="Email" required>
                <input type="email" placeholder="vous@exemple.com" value={signupForm.email}
                  onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))}
                  className={fieldCls(false)} required />
              </Field>
              <Field label="Mot de passe" required>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="••••••••" value={signupForm.password}
                    onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))}
                    className={cx(fieldCls(false), "pr-10")} required />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <Ic.eyeOff width={15} height={15} /> : <Ic.eye width={15} height={15} />}
                  </button>
                </div>
              </Field>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 mt-1"
                style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Création...</>
                  : <><Ic.check width={13} height={13} /> Créer un compte et envoyer</>}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                Déjà un compte ?{" "}
                <button type="button" onClick={() => { setTab("login"); setError(""); }}
                  className="text-indigo-600 font-semibold hover:underline">Se connecter</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MODAL INFOS PERSONNELLES + CRÉATION EVENT
───────────────────────────────────────────────────── */
function InfoModal({ isOpen, onClose, onConfirm, item, stockMax }) {
  const isService = item?.type === "service";

  const [form, setForm]         = useState({ nom: "", email: "", tel: "", adresse: "", cin: "" });
  const [qty, setQty]           = useState(1);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQty(isService ? 1 : (item?.quantity || 1));
      setForm({ nom: "", email: "", tel: "", adresse: "", cin: "" });
      setFile(null); setPreview(null); setErrors({});
      setEventName(""); setEventType("");
    }
  }, [isOpen, item]);

  const bump = (d) => {
    if (isService) return;
    const n = qty + d;
    if (n < 1 || n > stockMax) return;
    setQty(n);
  };

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5e6) { setErrors(p => ({ ...p, file: "Fichier trop lourd (max 5 Mo)" })); return; }
    setFile(f); setErrors(p => ({ ...p, file: null }));
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(f);
  };

  const validate = () => {
    const e = {};
    if (!form.nom.trim())    e.nom       = "Champ requis";
    if (!form.email.trim())  e.email     = "Champ requis";
    if (!form.tel.trim())    e.tel       = "Champ requis";
    if (!form.cin.trim())    e.cin       = "Champ requis";
    if (!eventName.trim())   e.eventName = "Nom de l'événement requis";
    if (!eventType)          e.eventType = "Type requis";
    if (!file)               e.file      = "Veuillez uploader votre CIN";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("quantity",  isService ? 1 : qty);
    fd.append("cinFile",   file);
    fd.append("eventName", eventName);
    fd.append("eventType", eventType);

    const dateStr = item?.selectedDate || new Date().toISOString();
    fd.append("dateDebut", dateStr);
    fd.append("dateFin",   dateStr);

    await onConfirm({ ...item, quantity: isService ? 1 : qty }, form, fd);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const total = isService
    ? (item?.totalPrice || item?.price || 0)
    : qty * (item?.price || 0);

  const displayDate = item?.selectedDate
    ? new Date(item.selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Date non définie";

  const displaySlots = item?.selectedTimes?.map(s => s.display).join(", ") || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,30,.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-[460px] rounded-3xl bg-white overflow-hidden shadow-2xl"
        style={{ animation: "modalIn .24s cubic-bezier(.34,1.56,.64,1)" }}>

        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#4338CA)" }}>
          <div className="flex items-center gap-2 text-white">
            <Ic.user width={17} height={17} className="opacity-80" />
            <span className="font-bold text-sm tracking-wide">Envoyer une demande</span>
          </div>
          <button onClick={onClose}
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition">
            <Ic.close width={15} height={15} />
          </button>
        </div>

        <div className="mx-5 mt-4 space-y-2">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: "#EEF2FF", color: "#3730A3" }}>
            <Ic.info width={13} height={13} />
            <span>Demande pour&nbsp;: <strong>{item?.resourceName}</strong></span>
            <TypeBadge type={item?.type || "service"} />
          </div>
          {item?.selectedDate && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
              style={{ background: "#F0FDF4", color: "#166534" }}>
              <Ic.calendar width={12} height={12} />
              <span>{displayDate}{displaySlots && ` · ${displaySlots}`}</span>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>

          <div className="flex items-end justify-between">
            <div>
              {!isService && (
                <>
                  <p className="text-xs text-gray-400 mb-2">Quantité</p>
                  <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden w-fit">
                    <button type="button" onClick={() => bump(-1)} disabled={qty <= 1}
                      className="px-3 py-2.5 hover:bg-gray-50 disabled:opacity-30 transition border-r border-gray-200 text-gray-500">
                      <Ic.minus width={13} height={13} />
                    </button>
                    <span className="px-5 py-2.5 text-sm font-black text-gray-900 tabular-nums">{qty}</span>
                    <button type="button" onClick={() => bump(1)} disabled={qty >= stockMax}
                      className="px-3 py-2.5 hover:bg-gray-50 disabled:opacity-30 transition border-l border-gray-200 text-gray-500">
                      <Ic.plus width={13} height={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1">Stock dispo : {stockMax}</p>
                </>
              )}
              {isService && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Prestation</p>
                  <span className="text-sm font-semibold text-gray-700">1 × {item?.resourceName}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Total estimé</p>
              <p className="text-2xl font-black" style={{ color: "#4338CA" }}>{total}€</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section event */}
          <div className="rounded-2xl border border-indigo-100 p-4 space-y-3"
            style={{ background: "#FAFBFF" }}>
            <p className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ic.event width={13} height={13} /> Votre événement
            </p>
            <Field label="Nom de l'événement" required error={errors.eventName}>
              <input type="text" placeholder="Ex : Mariage de Sophie et Thomas"
                value={eventName}
                onChange={e => { setEventName(e.target.value); setErrors(p => ({ ...p, eventName: null })); }}
                className={fieldCls(errors.eventName)} />
            </Field>
            <Field label="Type d'événement" required error={errors.eventType}>
              <select value={eventType}
                onChange={e => { setEventType(e.target.value); setErrors(p => ({ ...p, eventType: null })); }}
                className={fieldCls(errors.eventType)}>
                <option value="">Sélectionner un type</option>
                <option value="Mariage">Mariage</option>
                <option value="Soirée privée">Soirée privée</option>
                <option value="Anniversaire">Anniversaire</option>
                <option value="Corporate">Corporate</option>
                <option value="Séminaire">Séminaire</option>
                <option value="Conférence">Conférence</option>
                <option value="Gala">Gala</option>
                <option value="Autre">Autre</option>
              </select>
            </Field>
            <div className="text-[10px] text-indigo-400 bg-indigo-50 rounded-lg px-3 py-2">
              Les ressources avec la même date seront automatiquement regroupées sous cet événement.
            </div>
          </div>

          <hr className="border-gray-100" />

          <Field label="Nom complet" required error={errors.nom}>
            <input type="text" placeholder="Sophie Martin" value={form.nom}
              onChange={e => { setForm(p => ({ ...p, nom: e.target.value })); setErrors(p => ({ ...p, nom: null })); }}
              className={fieldCls(errors.nom)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" required error={errors.email}>
              <input type="email" placeholder="sophie@email.com" value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: null })); }}
                className={fieldCls(errors.email)} />
            </Field>
            <Field label="Téléphone" required error={errors.tel}>
              <input type="tel" placeholder="06 12 34 56 78" value={form.tel}
                onChange={e => { setForm(p => ({ ...p, tel: e.target.value })); setErrors(p => ({ ...p, tel: null })); }}
                className={fieldCls(errors.tel)} />
            </Field>
          </div>

          <Field label="Adresse">
            <textarea rows={2} placeholder="Votre adresse..." value={form.adresse}
              onChange={e => setForm(p => ({ ...p, adresse: e.target.value }))}
              className={cx(fieldCls(null), "resize-none")} />
          </Field>

          <hr className="border-gray-100" />

          <Field label="Numéro CIN" required error={errors.cin}>
            <input type="text" placeholder="12345678" value={form.cin}
              onChange={e => { setForm(p => ({ ...p, cin: e.target.value })); setErrors(p => ({ ...p, cin: null })); }}
              className={fieldCls(errors.cin)} />
          </Field>

          <Field label="Photo de la CIN" required error={errors.file}>
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="CIN" className="h-24 rounded-xl border border-gray-200 object-cover" />
                <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md">
                  <Ic.close width={12} height={12} />
                </button>
              </div>
            ) : (
              <label className={cx(
                "flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-dashed cursor-pointer transition",
                errors.file ? "border-rose-300 bg-rose-50" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
              )}>
                <Ic.upload width={26} height={26} className="text-gray-300" />
                <span className="text-xs text-gray-400">Cliquez pour uploader votre CIN</span>
                <span className="text-[10px] text-gray-300">JPG · PNG · PDF — max 5 Mo</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={pickFile} />
              </label>
            )}
          </Field>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Envoi en cours...</>
              : <><Ic.check width={14} height={14} />Confirmer et envoyer la demande</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── CART ROW ── */
function CartRow({ item, stockMax, onQty, onRemove, onSend, isSending }) {
  const isService = item.type === "service";
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <TypeBadge type={item.type || "product"} />
          <span className="text-sm font-bold text-gray-800 truncate">{item.resourceName}</span>
        </div>
        <div className="text-xs text-gray-400">
          {item.price}€ / {isService ? "prestation" : "unité"}
          {!isService && ` · Stock : ${stockMax}`}
          {item.selectedDate && ` · ${new Date(item.selectedDate).toLocaleDateString("fr-FR")}`}
          {item.selectedTimes?.length > 0 && ` · ${item.selectedTimes.length} créneau(x)`}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {!isService ? (
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => onQty(item.resourceId, item.quantity - 1)} disabled={item.quantity <= 1}
              className="px-2.5 py-2 hover:bg-gray-50 disabled:opacity-30 transition text-gray-400 border-r border-gray-200">
              <Ic.minus width={13} height={13} />
            </button>
            <span className="px-4 py-2 text-sm font-black text-gray-900 tabular-nums min-w-[2.5rem] text-center">
              {item.quantity}
            </span>
            <button onClick={() => onQty(item.resourceId, item.quantity + 1)} disabled={item.quantity >= stockMax}
              className="px-2.5 py-2 hover:bg-gray-50 disabled:opacity-30 transition text-gray-400 border-l border-gray-200">
              <Ic.plus width={13} height={13} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400 border border-gray-200 rounded-xl px-3 py-2 font-medium">
            1 prestation
          </span>
        )}

        <span className="text-sm font-black tabular-nums min-w-[56px] text-right" style={{ color: "#4338CA" }}>
          {item.totalPrice}€
        </span>

        <button onClick={() => onSend(item)} disabled={isSending || stockMax === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
          {isSending
            ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Envoi...</>
            : <><Ic.send width={13} height={13} />Envoyer la demande</>
          }
        </button>

        <button onClick={() => onRemove(item.resourceId)}
          className="p-2 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition">
          <Ic.trash width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

/* ── RESERVATION CARD ── */
function ReservationCard({ res, onPay }) {
  const accepted = res.status === "acceptée";
  const refused  = res.status === "refusée";
  const pending  = res.status === "en attente";
  return (
    <div className={cx(
      "bg-white rounded-2xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 transition hover:shadow-md",
      accepted ? "border-emerald-200" : refused ? "border-rose-100" : "border-gray-100"
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap mb-2">
          <span className="font-bold text-sm text-gray-900 truncate">{res.resource?.name || "Ressource"}</span>
          <StatusPill status={res.status} />
          {res.resource?.type && <TypeBadge type={res.resource.type} />}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Ic.calendar width={12} height={12} />
            {format(new Date(res.dateDebut), "dd MMM yyyy", { locale: fr })}
            {" → "}
            {format(new Date(res.dateFin), "dd MMM yyyy", { locale: fr })}
          </span>
          <span className="font-bold" style={{ color: "#4338CA" }}>{res.resource?.price}€</span>
          {res.event?.title && <span className="text-gray-300">· {res.event.title}</span>}
        </div>
      </div>
      {accepted && (
        <button onClick={() => onPay(res)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#059669,#10B981)" }}>
          <Ic.card width={14} height={14} /> Payer {res.resource?.price}€
        </button>
      )}
      {pending && (
        <span className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 border border-gray-200 whitespace-nowrap">
          En attente de réponse
        </span>
      )}
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black tabular-nums" style={{ color: accent }}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════ */
export default function MesReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [cartItems, setCartItems]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sending, setSending]           = useState(null);
  const [modal, setModal]               = useState({ open: false, item: null, stock: 0 });
  const [authModal, setAuthModal]       = useState({ open: false, item: null });
  const [toast, setToast]               = useState(null);
  const [stockLimits, setStockLimits]   = useState({});

  const token  = localStorage.getItem("token");
  const user   = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const notify = (message, type = "info") => setToast({ message, type });

  useEffect(() => {
    loadCart();
    if (token) fetchReservations();
    else setLoading(false);
  }, []);

  /* ── PANIER ── */
  const loadCart = async () => {
    const raw = localStorage.getItem("reservationCart");
    if (!raw) return;
    const items = JSON.parse(raw);
    setCartItems(items);
    const stocks = {};
    await Promise.all(items.map(async (i) => {
      try {
        const r = await axios.get(`http://localhost:5000/api/ressources/get_by_id/${i.resourceId}`);
        stocks[i.resourceId] = r.data.stock ?? 999;
      } catch { stocks[i.resourceId] = i.type === "service" ? 1 : 999; }
    }));
    setStockLimits(s => ({ ...s, ...stocks }));
  };

  const saveCart = (items) => { localStorage.setItem("reservationCart", JSON.stringify(items)); setCartItems(items); };
  const removeItem = (id) => saveCart(cartItems.filter(i => i.resourceId !== id));

  const updateQty = (resourceId, newQty) => {
    const max = stockLimits[resourceId] ?? 999;
    if (newQty < 1)   { removeItem(resourceId); return; }
    if (newQty > max) { notify(`Stock maximum : ${max}`, "error"); return; }
    saveCart(cartItems.map(i => i.resourceId === resourceId ? { ...i, quantity: newQty, totalPrice: newQty * i.price } : i));
  };

  /* ── Ouvrir la modal d'envoi — vérifie la connexion d'abord ── */
  const openSendModal = (item) => {
    const currentToken = localStorage.getItem("token");
    const currentUser  = JSON.parse(localStorage.getItem("user") || "null");

    if (!currentToken || !currentUser) {
      // Pas connecté → ouvrir le modal auth inline (plus de redirect !)
      setAuthModal({ open: true, item });
      return;
    }
    const max = stockLimits[item.resourceId] ?? 999;
    setModal({ open: true, item, stock: max });
  };

  /* ── Appelé après connexion/inscription réussie dans AuthModal ── */
  const handleAuthSuccess = () => {
    const item = authModal.item;
    setAuthModal({ open: false, item: null });
    notify("Connexion réussie !", "success");

    // Petite pause pour que localStorage soit bien mis à jour
    setTimeout(() => {
      if (item) {
        const max = stockLimits[item.resourceId] ?? 999;
        setModal({ open: true, item, stock: max });
      }
      // Rafraîchir les réservations maintenant que l'user est connecté
      fetchReservations();
    }, 300);
  };

  /* ── RÉSERVATIONS ── */
  const fetchReservations = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) { setLoading(false); return; }
    try {
      const res = await axios.get("http://localhost:5000/api/location/get_my_locations", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setReservations(res.data);
      const stocks = {};
      await Promise.all(res.data.map(async (r) => {
        if (!r.resource?._id) return;
        try {
          const sr = await axios.get(`http://localhost:5000/api/ressources/get_by_id/${r.resource._id}`);
          stocks[r.resource._id] = sr.data.stock ?? 999;
        } catch { stocks[r.resource._id] = 999; }
      }));
      setStockLimits(s => ({ ...s, ...stocks }));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ── ENVOI DE DEMANDE ── */
  const sendRequest = async (cartItem, _info, fd) => {
    const currentToken = localStorage.getItem("token");
    const currentUser  = JSON.parse(localStorage.getItem("user") || "null");
    const currentUserId = currentUser?._id || currentUser?.id;

    const qty       = parseInt(fd.get("quantity")) || 1;
    const eventName = fd.get("eventName");
    const eventType = fd.get("eventType");
    const adresse   = fd.get("adresse") || "À définir";
    const nom       = fd.get("nom");
    const itemDate  = cartItem.selectedDate || new Date().toISOString();
    const dateKey   = new Date(itemDate).toDateString();

    setSending(cartItem.resourceId);
    try {
      const evRes = await axios.get(
        `http://localhost:5000/api/event/user_event/${currentUserId}`,
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );

      let eventId;
      const existingEvent = evRes.data?.find(ev => {
        const evDate = new Date(ev.dateDebut).toDateString();
        return evDate === dateKey && ev.title === eventName;
      });

      if (existingEvent) {
        eventId = existingEvent._id;
      } else {
        const eventPayload = {
          title:              eventName,
          description:        `Événement organisé par ${nom}`,
          lieu:               adresse,
          category:           eventType,
          type:               "privé",
          dateDebut:          itemDate,
          dateFin:            itemDate,
          nombreParticipants: 0,
        };
        const newEvent = await axios.post(
          "http://localhost:5000/api/event/addEvent",
          eventPayload,
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
        eventId = newEvent.data._id;
      }

      const slots = cartItem.selectedTimes?.length > 0
        ? cartItem.selectedTimes
        : [{ start: itemDate, end: itemDate }];

      for (const slot of slots) {
        await axios.post(
          "http://localhost:5000/api/location/create",
          {
            event:    eventId,
            resource: cartItem.resourceId,
            dateDebut: slot.start || itemDate,
            dateFin:   slot.end   || itemDate,
          },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
      }

      removeItem(cartItem.resourceId);
      notify(`Demande envoyée pour "${cartItem.resourceName}" !`, "success");
      fetchReservations();

    } catch (e) {
      console.error("Erreur sendRequest:", e);
      notify(e.response?.data?.message || "Erreur lors de l'envoi.", "error");
    } finally {
      setSending(null);
    }
  };

  /* ── Données dérivées ── */
  const currentToken  = localStorage.getItem("token");
  const totalCart     = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);
  const totalSent     = reservations.length;
  const totalAccepted = reservations.filter(r => r.status === "acceptée").length;
  const isEmpty       = !cartItems.length && !reservations.length;

  if (loading) return (
    <>
      <NavbarProfileOrg />
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 tracking-wide">Chargement...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <NavbarProfileOrg />

      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateY(-14px) scale(.94); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(.92) translateY(18px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ═══ AUTH MODAL INLINE (remplace le redirect vers /login) ═══ */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ open: false, item: null })}
        pendingItem={authModal.item}
        onAuthSuccess={handleAuthSuccess}
      />

      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "#F7F8FF" }}>
        <div className="max-w-4xl mx-auto">

          {/* header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
              <Ic.bag width={20} height={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Mes réservations</h1>
              <p className="text-xs text-gray-400">Gérez votre panier et vos demandes</p>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Dans le panier"    value={totalCart}     accent="#4338CA" />
            <StatCard label="Demandes envoyées" value={totalSent}     accent="#7C3AED" />
            <StatCard label="Acceptées"         value={totalAccepted} accent="#059669" />
          </div>

          {/* Banner si non connecté */}
          {!currentToken && cartItems.length > 0 && (
            <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl border"
              style={{ background: "#EEF2FF", borderColor: "#C7D2FE" }}>
              <Ic.lock width={18} height={18} className="text-indigo-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-indigo-800">Connexion requise pour envoyer</p>
                <p className="text-xs text-indigo-500">Vous pouvez continuer à parcourir et ajouter au panier. La connexion sera demandée au moment d'envoyer la demande.</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center text-gray-200"
                style={{ background: "#F3F4F6" }}>
                <Ic.bag width={28} height={28} />
              </div>
              <h3 className="font-black text-gray-700 mb-1">Aucune réservation</h3>
              <p className="text-sm text-gray-400 mb-6">Vous n'avez encore rien dans votre panier.</p>
              <button onClick={() => navigate("/les_ressources")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
                <Ic.search width={14} height={14} /> Découvrir les ressources
              </button>
            </div>
          )}

          {/* Panier */}
          {cartItems.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-gray-800">Produits & services dans le panier</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background: "#DCFCE7", color: "#166634" }}>
                  {totalCart} article{totalCart > 1 ? "s" : ""}
                </span>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <CartRow
                    key={item.resourceId}
                    item={item}
                    stockMax={item.type === "service" ? 1 : (stockLimits[item.resourceId] ?? 999)}
                    onQty={updateQty}
                    onRemove={removeItem}
                    onSend={openSendModal}
                    isSending={sending === item.resourceId}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Demandes envoyées — seulement si connecté */}
          {currentToken && reservations.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-gray-800">Mes demandes envoyées</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background: "#EDE9FE", color: "#5B21B6" }}>
                  {totalSent} demande{totalSent > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {reservations.map((res) => (
                  <ReservationCard
                    key={res._id}
                    res={res}
                    onPay={(r) => notify(`Paiement pour ${r.resource?.name} — ${r.resource?.price}€`, "info")}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Modal infos personnelles */}
      <InfoModal
        isOpen={modal.open}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        onConfirm={sendRequest}
        item={modal.item}
        stockMax={modal.stock}
      />
    </>
  );
}
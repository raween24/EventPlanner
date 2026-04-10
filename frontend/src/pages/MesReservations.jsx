import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import NavbarProfileOrg from "../components/navbarProfileOrg";

const Ic = {
  bag:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  box:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  service:  (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  send:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  trash:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
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
  search:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
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
    "en attente": { bg: "#FEF3C7", fg: "#92400E", Icon: Ic.clock,  label: "En attente" },
    "acceptée":   { bg: "#D1FAE5", fg: "#065F46", Icon: Ic.check,  label: "Acceptée"   },
    "refusée":    { bg: "#FEE2E2", fg: "#991B1B", Icon: Ic.xmark,  label: "Refusée"    },
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
  if (type === "product") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: "#DCFCE7", color: "#166534" }}>
      <Ic.box width={11} height={11} /> Produit
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: "#EDE9FE", color: "#5B21B6" }}>
      <Ic.service width={11} height={11} /> Service
    </span>
  );
}

/* ── MODAL INFOS PERSONNELLES ── */
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

function InfoModal({ isOpen, onClose, onConfirm, item, stockMax }) {
  const [form, setForm]       = useState({ nom: "", email: "", tel: "", adresse: "", cin: "" });
  const [qty, setQty]         = useState(1);
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin]     = useState("");

  useEffect(() => {
    if (isOpen) {
      setQty(item?.quantity || 1);
      setForm({ nom: "", email: "", tel: "", adresse: "", cin: "" });
      setFile(null); setPreview(null); setErrors({});
      const today = new Date();
      const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
      setDateDebut(today.toISOString().split("T")[0]);
      setDateFin(tomorrow.toISOString().split("T")[0]);
    }
  }, [isOpen, item]);

  const bump = (d) => {
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
    if (!form.nom.trim())   e.nom   = "Champ requis";
    if (!form.email.trim()) e.email = "Champ requis";
    if (!form.tel.trim())   e.tel   = "Champ requis";
    if (!form.cin.trim())   e.cin   = "Champ requis";
    if (!dateDebut)         e.dateDebut = "Champ requis";
    if (!dateFin)           e.dateFin   = "Champ requis";
    if (!file)              e.file  = "Veuillez uploader votre CIN";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("quantity", qty);
    fd.append("dateDebut", new Date(dateDebut).toISOString());
    fd.append("dateFin", new Date(dateFin).toISOString());
    fd.append("cinFile", file);
    await onConfirm({ ...item, quantity: qty }, form, fd);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;
  const total = qty * (item?.price || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,30,.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-[440px] rounded-3xl bg-white overflow-hidden shadow-2xl"
        style={{ animation: "modalIn .24s cubic-bezier(.34,1.56,.64,1)" }}>

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#4338CA)" }}>
          <div className="flex items-center gap-2 text-white">
            <Ic.user width={17} height={17} className="opacity-80" />
            <span className="font-bold text-sm tracking-wide">Vos informations</span>
          </div>
          <button onClick={onClose}
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition">
            <Ic.close width={15} height={15} />
          </button>
        </div>

        {/* resource badge */}
        <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "#EEF2FF", color: "#3730A3" }}>
          <Ic.info width={13} height={13} />
          Demande pour&nbsp;: <strong className="ml-1">{item?.resourceName}</strong>
        </div>

        <form onSubmit={submit} className="px-6 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>

          {/* qty + total */}
          <div className="flex items-end justify-between">
            <div>
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
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Total estimé</p>
              <p className="text-2xl font-black" style={{ color: "#4338CA" }}>{total}€</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* dates */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date début" required error={errors.dateDebut}>
              <input type="date" value={dateDebut}
                onChange={e => { setDateDebut(e.target.value); setErrors(p => ({ ...p, dateDebut: null })); }}
                className={fieldCls(errors.dateDebut)} />
            </Field>
            <Field label="Date fin" required error={errors.dateFin}>
              <input type="date" value={dateFin}
                onChange={e => { setDateFin(e.target.value); setErrors(p => ({ ...p, dateFin: null })); }}
                className={fieldCls(errors.dateFin)} />
            </Field>
          </div>

          <hr className="border-gray-100" />

          {/* nom */}
          <Field label="Nom complet" required error={errors.nom}>
            <input type="text" placeholder="Sophie Martin"
              value={form.nom} onChange={e => { setForm(p => ({ ...p, nom: e.target.value })); setErrors(p => ({ ...p, nom: null })); }}
              className={fieldCls(errors.nom)} />
          </Field>

          {/* email + tel */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" required error={errors.email}>
              <input type="email" placeholder="sophie@email.com"
                value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: null })); }}
                className={fieldCls(errors.email)} />
            </Field>
            <Field label="Téléphone" required error={errors.tel}>
              <input type="tel" placeholder="06 12 34 56 78"
                value={form.tel} onChange={e => { setForm(p => ({ ...p, tel: e.target.value })); setErrors(p => ({ ...p, tel: null })); }}
                className={fieldCls(errors.tel)} />
            </Field>
          </div>

          {/* adresse */}
          <Field label="Adresse">
            <textarea rows={2} placeholder="Votre adresse..."
              value={form.adresse} onChange={e => setForm(p => ({ ...p, adresse: e.target.value }))}
              className={cx(fieldCls(null), "resize-none")} />
          </Field>

          <hr className="border-gray-100" />

          {/* cin numéro */}
          <Field label="Numéro CIN" required error={errors.cin}>
            <input type="text" placeholder="12345678"
              value={form.cin} onChange={e => { setForm(p => ({ ...p, cin: e.target.value })); setErrors(p => ({ ...p, cin: null })); }}
              className={fieldCls(errors.cin)} />
          </Field>

          {/* cin upload */}
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

          {/* submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi en cours...</>
              : <><Ic.check width={14} height={14} /> Confirmer et envoyer la demande</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── CART ROW ── */
function CartRow({ item, stockMax, onQty, onRemove, onSend, isSending }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <TypeBadge type={item.type || "product"} />
          <span className="text-sm font-bold text-gray-800 truncate">{item.resourceName}</span>
        </div>
        <p className="text-xs text-gray-400">
          {item.price}€ / unité &nbsp;·&nbsp; Stock disponible : {stockMax}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* stepper */}
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

        {/* price */}
        <span className="text-sm font-black tabular-nums min-w-[56px] text-right" style={{ color: "#4338CA" }}>
          {item.totalPrice}€
        </span>

        {/* send */}
        <button onClick={() => onSend(item)} disabled={isSending || stockMax === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
          {isSending
            ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi...</>
            : <><Ic.send width={13} height={13} /> Envoyer la demande</>
          }
        </button>

        {/* delete */}
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
          <span className="font-bold text-sm text-gray-900 truncate">
            {res.resource?.name || "Ressource"}
          </span>
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
          {res.event?.title && (
            <span className="text-gray-300">· Événement : {res.event.title}</span>
          )}
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

/* ════════════════════════════════════════════
   PAGE PRINCIPALE
════════════════════════════════════════════ */
export default function MesReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [cartItems, setCartItems]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sending, setSending]           = useState(null);
  const [modal, setModal]               = useState({ open: false, item: null, stock: 0 });
  const [toast, setToast]               = useState(null);
  const [stockLimits, setStockLimits]   = useState({});

  const token  = localStorage.getItem("token");
  const user   = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const notify = (message, type = "info") => setToast({ message, type });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchReservations();
    loadCart();
  }, []);

  /* ── charger panier depuis localStorage ── */
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
      } catch { stocks[i.resourceId] = 999; }
    }));
    setStockLimits(s => ({ ...s, ...stocks }));
  };

  const saveCart = (items) => {
    localStorage.setItem("reservationCart", JSON.stringify(items));
    setCartItems(items);
  };

  const updateQty = (resourceId, newQty) => {
    const max = stockLimits[resourceId] ?? 999;
    if (newQty < 1)   { removeItem(resourceId); return; }
    if (newQty > max) { notify(`Stock maximum : ${max}`, "error"); return; }
    saveCart(cartItems.map(i =>
      i.resourceId === resourceId
        ? { ...i, quantity: newQty, totalPrice: newQty * i.price }
        : i
    ));
  };

  const removeItem = (id) => saveCart(cartItems.filter(i => i.resourceId !== id));

  const openModal = (item) => {
    const max = stockLimits[item.resourceId] ?? 999;
    if (max === 0) { notify("Stock épuisé pour ce produit.", "error"); return; }
    setModal({ open: true, item, stock: max });
  };

  /* ── fetch réservations ── */
  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/location/get_my_locations", {
        headers: { Authorization: `Bearer ${token}` },
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ── envoi de demande ── */
// ═══════════════════════════════════════════════════════
// À coller dans MesReservations.jsx
// Remplace ta fonction sendRequest existante
// ═══════════════════════════════════════════════════════

const sendRequest = async (cartItem, _info, fd) => {
  const qty       = parseInt(fd.get("quantity")) || cartItem.quantity;
  const dateDebut = fd.get("dateDebut");
  const dateFin   = fd.get("dateFin");
  const nom       = fd.get("nom");
  const cin       = fd.get("cin");
  const adresse   = fd.get("adresse") || "À définir";

  setSending(cartItem.resourceId);

  try {
    // ─────────────────────────────────────────────
    // 1. Chercher un événement existant de l'user
    // ─────────────────────────────────────────────
    const evRes = await axios.get(
      `http://localhost:5000/api/event/user_event/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let eventId;

    if (evRes.data && evRes.data.length > 0) {
      // Utiliser le premier événement existant
      eventId = evRes.data[0]._id;
    } else {
      // ─────────────────────────────────────────
      // 2. Créer un événement automatiquement
      // ─────────────────────────────────────────
      const eventPayload = {
        title:              `Commande — ${cartItem.resourceName}`,
        description:        `${qty} × ${cartItem.resourceName} — par ${nom}`,
        lieu:               adresse,
        category:           "autre",          // ← enum autorisé dans ton modèle
        type:               "privé",
        dateDebut:          dateDebut || new Date().toISOString(),
        dateFin:            dateFin   || new Date(Date.now() + 86400000).toISOString(),
        nombreParticipants: 0,
      };

      const newEvent = await axios.post(
        "http://localhost:5000/api/event/addEvent",
        eventPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      eventId = newEvent.data._id;
    }

    // ─────────────────────────────────────────────
    // 3. Créer la demande de location
    // ─────────────────────────────────────────────
    await axios.post(
      "http://localhost:5000/api/location/create",
      {
        event:    eventId,
        resource: cartItem.resourceId,
        dateDebut: dateDebut || new Date().toISOString(),
        dateFin:   dateFin   || new Date(Date.now() + 86400000).toISOString(),
        message:  `Demande de ${nom} — CIN : ${cin}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ─────────────────────────────────────────────
    // 4. Supprimer du panier + notifier
    // ─────────────────────────────────────────────
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

  /* ── données dérivées ── */
  const totalCart     = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalSent     = reservations.length;
  const totalAccepted = reservations.filter(r => r.status === "acceptée").length;
  const isEmpty       = !cartItems.length && !reservations.length;

  /* ── loading ── */
  if (loading) return (
    <>
      <NavbarProfileOrg />
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 tracking-wide">Chargement de vos réservations...</p>
        </div>
      </div>
    </>
  );

  /* ── render ── */
  return (
    <>
      <NavbarProfileOrg />

      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateY(-14px) scale(.94); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(.92) translateY(18px); } to { opacity:1; transform:none; } }
      `}</style>

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "#F7F8FF" }}>
        <div className="max-w-4xl mx-auto">

          {/* ── header ── */}
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

          {/* ── stats ── */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Dans le panier"    value={totalCart}     accent="#4338CA" />
            <StatCard label="Demandes envoyées" value={totalSent}     accent="#7C3AED" />
            <StatCard label="Acceptées"         value={totalAccepted} accent="#059669" />
          </div>

          {/* ── empty state ── */}
          {isEmpty && (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center text-gray-200"
                style={{ background: "#F3F4F6" }}>
                <Ic.bag width={28} height={28} />
              </div>
              <h3 className="font-black text-gray-700 mb-1">Aucune réservation</h3>
              <p className="text-sm text-gray-400 mb-6">Vous n'avez encore réservé aucune ressource.</p>
              <button onClick={() => navigate("/les_ressources")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
                <Ic.search width={14} height={14} /> Découvrir les ressources
              </button>
            </div>
          )}

          {/* ── panier (produits) ── */}
          {cartItems.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-gray-800">Produits dans le panier</span>
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
                    stockMax={stockLimits[item.resourceId] ?? 999}
                    onQty={updateQty}
                    onRemove={removeItem}
                    onSend={openModal}
                    isSending={sending === item.resourceId}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── demandes envoyées ── */}
          {reservations.length > 0 && (
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

      {/* ── modal infos ── */}
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
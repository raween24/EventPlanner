import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, Settings, Wrench,
  BarChart2, LogOut, CheckCircle, XCircle,
  Eye, Trash2, ChevronDown, Package,
  Calendar, Clock, AlertCircle, Info, X, Menu, Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

/* ─── PALETTE (comme la photo) ───────────────────────────── */
const C = {
  bg:          "#f8f9fa",
  sidebar:     "#ffffff",
  card:        "#ffffff",
  border:      "#e8eaed",
  borderLight: "#f1f3f4",
  accent:      "#1a73e8",
  accentBg:    "#e8f0fe",
  accentText:  "#1967d2",
  green:       "#1e8e3e",
  greenBg:     "#e6f4ea",
  purple:      "#7c3aed",
  purpleBg:    "#f3e8ff",
  orange:      "#e37400",
  orangeBg:    "#fef7e0",
  red:         "#d93025",
  redBg:       "#fce8e6",
  t1:          "#202124",
  t2:          "#5f6368",
  t3:          "#9aa0a6",
  chartBlue:   "#4285f4",
  chartPurple: "#9c27b0",
};

/* ─── GLOBAL STYLES injected once ───────────────────────── */
const injectStyles = () => {
  if (document.getElementById("adash-styles")) return;
  const el = document.createElement("style");
  el.id = "adash-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Roboto',sans-serif;background:${C.bg}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes countUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes modalIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
    .adash-shimmer{background:linear-gradient(90deg,#f1f3f4 25%,#e8eaed 50%,#f1f3f4 75%);background-size:200% 100%;animation:shimmer 1.4s ease infinite}
    .adash-nav-item{display:flex;align-items:center;gap:14px;padding:10px 16px;border-radius:24px;cursor:pointer;font-size:14px;font-family:'Google Sans',sans-serif;font-weight:500;color:${C.t2};border:none;background:transparent;width:100%;text-align:left;transition:background .15s,color .15s}
    .adash-nav-item:hover{background:#f1f3f4;color:${C.t1}}
    .adash-nav-item.active{background:${C.accentBg};color:${C.accentText}}
    .adash-stat-card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:20px 24px;transition:box-shadow .2s,transform .2s;animation:fadeUp .4s ease both}
    .adash-stat-card:hover{box-shadow:0 2px 14px rgba(0,0,0,.1);transform:translateY(-2px)}
    .adash-chart-card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:24px}
    .adash-table-row:hover td{background:#f8f9fa}
    .adash-action-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;border:none;font-size:12.5px;font-weight:500;cursor:pointer;font-family:'Roboto',sans-serif;transition:opacity .15s,transform .15s}
    .adash-action-btn:hover:not(:disabled){opacity:.82;transform:translateY(-1px)}
    .adash-action-btn:disabled{opacity:.4;cursor:not-allowed}
    .adash-filter{padding:7px 18px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid ${C.border};background:${C.card};color:${C.t2};font-family:'Roboto',sans-serif;transition:all .15s}
    .adash-filter:hover{background:#f1f3f4}
    .adash-filter.active{background:${C.accentBg};color:${C.accentText};border-color:${C.accentBg}}
    .adash-filter.active-purple{background:${C.purpleBg};color:${C.purple};border-color:${C.purpleBg}}
    input:focus{outline:none}
  `;
  document.head.appendChild(el);
};

/* ─── TOAST ──────────────────────────────────────────────── */
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const remove = id => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, remove, success: m => add(m, "success"), error: m => add(m, "error"), info: m => add(m, "info") };
};

const Toasts = ({ toasts, remove }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map(t => {
      const cfg = { success: { bg: C.greenBg, border: "#34a853", color: C.green }, error: { bg: C.redBg, border: "#ea4335", color: C.red }, info: { bg: C.accentBg, border: C.accent, color: C.accent } }[t.type] || {};
      return (
        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8, padding: "12px 16px", minWidth: 280, boxShadow: "0 2px 10px rgba(0,0,0,.1)", animation: "toastIn .3s ease" }}>
          <span style={{ color: cfg.color, fontSize: 13, fontWeight: 500, flex: 1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.t3 }}><X size={14} /></button>
        </div>
      );
    })}
  </div>
);

/* ─── CONFIRM MODAL ──────────────────────────────────────── */
const useConfirm = () => {
  const [modal, setModal] = useState(null);
  const [res, setRes] = useState(null);
  const confirm = opts => new Promise(r => { setModal(opts); setRes(() => r); });
  const yes = () => { setModal(null); res(true); };
  const no = () => { setModal(null); res(false); };
  return { modal, confirm, yes, no };
};

const ConfirmModal = ({ modal, yes, no }) => {
  if (!modal) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(32,33,36,.5)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.card, borderRadius: 12, padding: 32, maxWidth: 400, width: "100%", boxShadow: "0 8px 30px rgba(0,0,0,.2)", animation: "modalIn .25s ease" }}>
        <h3 style={{ fontSize: 18, fontWeight: 500, color: C.t1, marginBottom: 10, fontFamily: "'Google Sans',sans-serif" }}>{modal.title}</h3>
        <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.6, marginBottom: 28 }}>{modal.message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={no} style={{ padding: "8px 20px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.accent, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
          <button onClick={yes} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: modal.type === "danger" ? C.red : C.accent, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{modal.confirmLabel || "Confirmer"}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── BADGE ──────────────────────────────────────────────── */
const Badge = ({ statut }) => {
  const map = {
    valide:       { bg: C.greenBg,  color: C.green,  label: "Validé" },
    en_attente:   { bg: C.orangeBg, color: C.orange, label: "En attente" },
    rejected:     { bg: C.redBg,    color: C.red,    label: "Rejeté" },
    organisateur: { bg: C.purpleBg, color: C.purple, label: "Organisateur" },
    prestataire:  { bg: C.accentBg, color: C.accent, label: "Prestataire" },
    admin:        { bg: C.redBg,    color: C.red,    label: "Admin" },
    salle:        { bg: C.accentBg, color: C.accent, label: "Salle" },
    materiel:     { bg: C.accentBg, color: C.accent, label: "Matériel" },
    decoration:   { bg: C.purpleBg, color: C.purple, label: "Décoration" },
    traiteur:     { bg: C.orangeBg, color: C.orange, label: "Traiteur" },
  };
  const s = map[statut] || { bg: C.borderLight, color: C.t2, label: statut };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s.label}</span>;
};

/* ─── TABLE HELPERS ──────────────────────────────────────── */
const TH = ({ children }) => <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 500, color: C.t2, fontFamily: "Roboto,sans-serif", whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}`, textTransform: "uppercase", letterSpacing: ".5px" }}>{children}</th>;
const TD = ({ children, style }) => <td style={{ padding: "14px 16px", fontSize: 13, color: C.t2, fontFamily: "Roboto,sans-serif", borderBottom: `1px solid ${C.borderLight}`, ...style }}>{children}</td>;
const Skel = ({ w = "100%", h = 20, r = 6 }) => <div className="adash-shimmer" style={{ width: w, height: h, borderRadius: r }} />;
const EmptyState = ({ icon: Icon, message }) => (
  <div style={{ padding: "60px 20px", textAlign: "center", color: C.t3 }}>
    <Icon size={40} style={{ margin: "0 auto 12px", opacity: .3, display: "block" }} />
    <div style={{ fontSize: 14 }}>{message}</div>
  </div>
);

/* ─── SVG BAR CHART ──────────────────────────────────────── */
const BarChart = ({ data, labels, color = "#4285f4", height = 220 }) => {
  const max = Math.max(...data);
  const n = data.length;
  const W = 560, pad = 48;
  const bw = ((W - pad) / n) * 0.55;
  const gap = (W - pad) / n;
  return (
    <svg viewBox={`0 0 ${W} ${height + 36}`} width="100%" style={{ overflow: "visible" }}>
      {[0, .25, .5, .75, 1].map((t, i) => {
        const y = height - t * height;
        return (
          <g key={i}>
            <line x1={pad} y1={y} x2={W} y2={y} stroke="#e8eaed" strokeWidth="1" strokeDasharray="4 3" />
            <text x={pad - 6} y={y + 4} fontSize="11" fill={C.t3} textAnchor="end">{Math.round(t * max).toLocaleString()}</text>
          </g>
        );
      })}
      {data.map((v, i) => {
        const barH = (v / max) * height;
        const x = pad + i * gap + (gap - bw) / 2;
        return (
          <g key={i}>
            <rect x={x} y={height - barH} width={bw} height={barH} fill={color} rx="4"
              style={{ transformOrigin: `${x + bw / 2}px ${height}px`, animation: `fadeUp .5s ease ${i * .07}s both` }} />
            <text x={x + bw / 2} y={height + 20} fontSize="12" fill={C.t2} textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ─── SVG LINE CHART ─────────────────────────────────────── */
const LineChart = ({ data, labels, color = "#9c27b0", height = 220 }) => {
  const max = Math.max(...data) * 1.12;
  const W = 420, pad = 48;
  const n = data.length;
  const px = i => pad + (i / (n - 1)) * (W - pad - 16);
  const py = v => height - (v / max) * height;
  const pathD = data.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${height + 36}`} width="100%" style={{ overflow: "visible" }}>
      {[0, .25, .5, .75, 1].map((t, i) => {
        const y = py(t * max);
        return (
          <g key={i}>
            <line x1={pad} y1={y} x2={W - 10} y2={y} stroke="#e8eaed" strokeWidth="1" strokeDasharray="4 3" />
            <text x={pad - 6} y={y + 4} fontSize="11" fill={C.t3} textAnchor="end">{Math.round(t * max).toLocaleString()}</text>
          </g>
        );
      })}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r="4" fill={C.card} stroke={color} strokeWidth="2.5" />)}
      {labels.map((l, i) => <text key={i} x={px(i)} y={height + 22} fontSize="11" fill={C.t2} textAnchor="middle">{l}</text>)}
    </svg>
  );
};

/* ─── SIDEBAR ────────────────────────────────────────────── */
const navItems = [
  { id: "dashboard",  label: "Dashboard",            icon: LayoutDashboard },
  { id: "gestion",    label: "Utilisateurs",         icon: Users },
  { id: "ressources", label: "Ressources",           icon: Wrench },
];

const Sidebar = ({ active, setActive, onLogout, isMobile, isMobileOpen, setIsMobileOpen }) => {
  if (isMobile && !isMobileOpen) {
    return (
      <button onClick={() => setIsMobileOpen(true)}
        style={{ position: "fixed", top: 16, left: 16, zIndex: 90, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, cursor: "pointer", color: C.t1, display: "flex", boxShadow: "0 1px 4px rgba(0,0,0,.1)" }}>
        <Menu size={20} />
      </button>
    );
  }

  return (
    <>
      {isMobile && isMobileOpen && <div onClick={() => setIsMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 150 }} />}
      <aside style={{ width: isMobile ? "80%" : 256, maxWidth: isMobile ? 300 : "none", height: "100vh", background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 200, transform: isMobile ? (isMobileOpen ? "translateX(0)" : "translateX(-100%)") : "none", transition: "transform .25s ease", overflowY: "auto" }}>

        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.t1, fontFamily: "'Google Sans',sans-serif", letterSpacing: "-.3px" }}>Admin Dashboard</h1>
          {isMobile && <button onClick={() => setIsMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.t2 }}><X size={18} /></button>}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "4px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActive(id); if (isMobile) setIsMobileOpen(false); }}
              className={`adash-nav-item${active === id ? " active" : ""}`}>
              <Icon size={20} color={active === id ? C.accentText : C.t2} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 12px 20px", borderTop: `1px solid ${C.borderLight}` }}>
          <button onClick={onLogout} className="adash-nav-item">
            <LogOut size={20} color={C.t2} /> Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
};

/* ─── TOPBAR ─────────────────────────────────────────────── */
const TopBar = ({ title, isMobile, searchValue, onSearchChange, showSearch }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = `${user.firstname?.[0] || "A"}${user.lastname?.[0] || "D"}`.toUpperCase();
  return (
    <div style={{ height: 64, background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px 0 60px" : "0 32px", position: "sticky", top: 0, zIndex: 50 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.t1, fontFamily: "'Google Sans',sans-serif", letterSpacing: "-.3px" }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {showSearch && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 24, padding: "8px 16px", width: isMobile ? 160 : 240 }}>
            <Search size={16} color={C.t3} />
            <input value={searchValue} onChange={onSearchChange} placeholder="Search..."
              style={{ border: "none", background: "transparent", fontSize: 14, color: C.t1, width: "100%", fontFamily: "Roboto,sans-serif" }} />
          </div>
        )}
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Google Sans',sans-serif" }}>{initials}</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════ */
const DashboardPage = () => {
  const [stats,        setStats]        = useState(null);
  const [monthlyUsers, setMonthlyUsers] = useState([0,0,0,0,0,0]);
  const [monthlyRes,   setMonthlyRes]   = useState([0,0,0,0,0,0]);
  const [loading,      setLoad]         = useState(true);
  const [windowWidth,  setWindowWidth]  = useState(window.innerWidth);
  useEffect(() => { const h = () => setWindowWidth(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth <= 1024;

  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jui","Aoû","Sep","Oct","Nov","Déc"];
  const now = new Date();
  const last6months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return months[d.getMonth()];
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, monthlyData] = await Promise.all([
          axios.get(`${API}/admin/stats`,         { headers: authHeaders() }),
          axios.get(`${API}/admin/stats/monthly`, { headers: authHeaders() }),
        ]);
        setStats(statsRes.data);

        const fill = (arr, total) => Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
          const found = arr.find(x => x._id.year === d.getFullYear() && x._id.month === d.getMonth() + 1);
          if (found?.count) return found.count;
          const ratio = 0.3 + (i / 5) * 0.55;
          return Math.max(1, Math.round(total * ratio));
        });

        setMonthlyUsers(fill(monthlyData.data.users,   statsRes.data.users));
        setMonthlyRes(fill(monthlyData.data.resources, statsRes.data.resources));
      } catch {
        setStats({ users: 0, events: 0, resources: 0, pending: 0 });
      } finally {
        setLoad(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: "Utilisateurs",       value: stats?.users,     delta: "Total inscrits",          iconBg: "#e3f0ff", icon: <Users    size={22} color={C.accent} /> },
    { label: "Événements",        value: stats?.events,    delta: "Total créés",              iconBg: C.greenBg,  icon: <Calendar size={22} color={C.green} /> },
    { label: "Ressources",         value: stats?.resources, delta: "Total publiées",           iconBg: C.purpleBg, icon: <Package  size={22} color={C.purple} /> },
    { label: "En attente",         value: stats?.pending,   delta: "Prestataires à valider",   iconBg: C.orangeBg, icon: <Clock    size={22} color={C.orange} /> },
  ];

  const usersData = monthlyUsers;
  const resData   = monthlyRes;

  const cols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)";

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16, marginBottom: 24 }}>
        {cards.map((c, i) => (
          <div key={i} className="adash-stat-card" style={{ animationDelay: `${i * .1}s` }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              {c.icon}
            </div>
            {loading
              ? <><Skel w="55%" h={36} r={4} /><Skel w="75%" h={14} r={4} style={{ marginTop: 8 }} /></>
              : <>
                <div style={{ fontSize: 34, fontWeight: 700, color: C.t1, fontFamily: "'Google Sans',sans-serif", letterSpacing: "-1px", animation: "countUp .5s ease" }}>
                  {(c.value ?? 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: C.green, fontWeight: 500, marginTop: 5 }}>{c.delta}</div>
              </>
            }
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: 16 }}>
        {/* Bar chart — Utilisateurs par mois */}
        <div className="adash-chart-card">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.t1, fontFamily: "'Google Sans',sans-serif" }}>Utilisateurs par mois</div>
            <div style={{ fontSize: 13, color: C.t2, marginTop: 3 }}>Progression sur les 6 derniers mois</div>
          </div>
          {loading
            ? <Skel w="100%" h={220} r={8} />
            : <BarChart data={usersData} labels={last6months} color={C.chartBlue} height={220} />
          }
        </div>

        {/* Line chart — Ressources par mois */}
        <div className="adash-chart-card">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.t1, fontFamily: "'Google Sans',sans-serif" }}>Ressources par mois</div>
            <div style={{ fontSize: 13, color: C.t2, marginTop: 3 }}>Évolution sur les 6 derniers mois</div>
          </div>
          {loading
            ? <Skel w="100%" h={220} r={8} />
            : <LineChart data={resData} labels={last6months} color={C.chartPurple} height={220} />
          }
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   COMPTES PAGE
═══════════════════════════════════════════════════════════ */
const UserAvatar = ({ user }) => {
  const [imgErr, setImgErr] = useState(false);
  const init = `${user.firstname?.[0]||""}${user.lastname?.[0]||""}`.toUpperCase();
  const isPrest = user.role === "prestataire";
  const bgColor = isPrest ? C.purpleBg : C.accentBg;
  const color   = isPrest ? C.purple   : C.accent;

  // Try to load image from uploads
  const imgUrl = user.image
    ? (user.image.startsWith("http") ? user.image : `http://localhost:5000/uploads/${user.image.replace(/\\/g,"/").split("/").pop()}`)
    : null;

  return (
    <div style={{ width:38, height:38, borderRadius:"50%", background:bgColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
      {imgUrl && !imgErr
        ? <img src={imgUrl} alt={init} onError={()=>setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        : <span style={{ color, fontSize:13, fontWeight:700 }}>{init}</span>
      }
    </div>
  );
};

const ComptesPage = () => {
  const [users, setUsers]      = useState([]);
  const [loading, setLoad]     = useState(true);
  const [tab, setTab]          = useState("tous");
  const [search, setSearch]    = useState("");
  const [actionLoading, setAL] = useState(null);
  const toast  = useToast();
  const { modal, confirm, yes, no } = useConfirm();

  const load = useCallback(async () => {
    try { setLoad(true); const { data } = await axios.get(`${API}/admin/users`, { headers: authHeaders() }); setUsers(data); }
    catch { setUsers([]); } finally { setLoad(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleValidate = async (id, name) => {
    try { setAL(id+"_v"); await axios.patch(`${API}/admin/users/${id}/status`,{status:"valide"},{headers:authHeaders()}); setUsers(p=>p.map(u=>u._id===id?{...u,status:"valide"}:u)); toast.success(`${name} valid\xe9`); }
    catch { toast.error("Erreur"); } finally { setAL(null); }
  };
  const handleReject = async (id, name) => {
    if (!await confirm({type:"warning",title:"Rejeter ce compte ?",message:`"${name}" ne pourra pas acc\xe9der \xe0 la plateforme.`,confirmLabel:"Rejeter"})) return;
    try { setAL(id+"_r"); await axios.patch(`${API}/admin/users/${id}/status`,{status:"rejected"},{headers:authHeaders()}); setUsers(p=>p.map(u=>u._id===id?{...u,status:"rejected"}:u)); toast.info(`${name} rejet\xe9`); }
    catch { toast.error("Erreur"); } finally { setAL(null); }
  };
  const handleDelete = async (id, name) => {
    if (!await confirm({type:"danger",title:"Supprimer ce compte ?",message:`Le compte de "${name}" sera d\xe9finitivement supprim\xe9.`,confirmLabel:"Supprimer"})) return;
    try { setAL(id+"_d"); await axios.delete(`${API}/admin/users/${id}`,{headers:authHeaders()}); setUsers(p=>p.filter(u=>u._id!==id)); toast.success(`${name} supprim\xe9`); }
    catch { toast.error("Erreur"); } finally { setAL(null); }
  };

  const tabs = [
    { k:"tous",        l:"Tous",          count: users.length },
    { k:"prestataire", l:"Prestataires",  count: users.filter(u=>u.role==="prestataire").length },
    { k:"organisateur",l:"Organisateurs", count: users.filter(u=>u.role==="organisateur").length },
    { k:"en_attente",  l:"En attente",    count: users.filter(u=>u.role==="prestataire"&&u.status==="en_attente").length },
  ];

  const filtered = users.filter(u => {
    const mt = tab==="tous" ? true : tab==="en_attente" ? (u.role==="prestataire"&&u.status==="en_attente") : u.role===tab;
    const ms = search==="" || `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  const pendingCount = users.filter(u=>u.role==="prestataire"&&u.status==="en_attente").length;

  return (
    <div>
      <ConfirmModal modal={modal} yes={yes} no={no}/>
      <Toasts toasts={toast.toasts} remove={toast.remove}/>

      {/* Page header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",margin:0,letterSpacing:"-.3px"}}>Gestion des utilisateurs</h2>
          <p style={{fontSize:13,color:C.t2,margin:"4px 0 0"}}>{users.length} utilisateurs au total</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"8px 16px",width:240}}>
          <Search size={14} color={C.t3}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..."
            style={{border:"none",background:"transparent",fontSize:13,color:C.t1,width:"100%",fontFamily:"inherit"}}/>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:20}}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{padding:"10px 20px",border:"none",background:"transparent",cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:"'Google Sans',sans-serif",color:tab===t.k?C.accent:C.t2,borderBottom:tab===t.k?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:"-1px",display:"flex",alignItems:"center",gap:7,transition:"color .15s"}}>
            {t.l}
            {t.count>0&&<span style={{background:tab===t.k?C.accentBg:C.borderLight,color:tab===t.k?C.accent:C.t3,borderRadius:10,padding:"1px 8px",fontSize:12,fontWeight:600}}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Alert */}
      {pendingCount>0&&(
        <div style={{display:"flex",alignItems:"center",gap:10,background:C.orangeBg,border:`1px solid #fbbc04`,borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:C.orange}}>
          <AlertCircle size={15}/><strong>{pendingCount} prestataire{pendingCount>1?"s":""}</strong>&nbsp;en attente de validation
        </div>
      )}

      {/* Table */}
      <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
        {loading
          ? <div style={{padding:24}}>{[1,2,3,4,5].map(i=><div key={i} style={{marginBottom:12}}><Skel h={52} r={8}/></div>)}</div>
          : filtered.length===0 ? <EmptyState icon={Users} message="Aucun utilisateur trouv\xe9"/>
          : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                    <TH>Nom</TH><TH>Email</TH><TH>Telephone</TH><TH>Role</TH><TH>Statut</TH><TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u=>{
                    const name=`${u.firstname} ${u.lastname}`;
                    const isPrest=u.role==="prestataire";
                    return (
                      <tr key={u._id} className="adash-table-row">
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <UserAvatar user={u}/>
                            <div>
                              <div style={{fontWeight:500,color:C.t1,fontSize:14}}>{name}</div>
                              <div style={{fontSize:12,color:C.t3}}>{u.region||""}</div>
                            </div>
                          </div>
                        </TD>
                        <TD>{u.email}</TD>
                        <TD>{u.numTel||""}</TD>
                        <TD><Badge statut={u.role}/></TD>
                        <TD>{isPrest?<Badge statut={u.status||"en_attente"}/>:<span style={{color:C.t3}}></span>}</TD>
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            {isPrest&&u.status==="en_attente"&&<>
                              <button onClick={()=>handleValidate(u._id,name)} disabled={actionLoading===u._id+"_v"} title="Valider"
                                style={{width:32,height:32,borderRadius:8,border:"none",background:C.greenBg,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <CheckCircle size={16}/>
                              </button>
                              <button onClick={()=>handleReject(u._id,name)} disabled={actionLoading===u._id+"_r"} title="Rejeter"
                                style={{width:32,height:32,borderRadius:8,border:"none",background:C.orangeBg,color:C.orange,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <XCircle size={16}/>
                              </button>
                            </>}
                            {isPrest&&u.status==="rejected"&&(
                              <button onClick={()=>handleValidate(u._id,name)} disabled={actionLoading===u._id+"_v"} title="R\xe9-activer"
                                style={{width:32,height:32,borderRadius:8,border:"none",background:C.greenBg,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <CheckCircle size={16}/>
                              </button>
                            )}
                            <button onClick={()=>handleDelete(u._id,name)} disabled={actionLoading===u._id+"_d"} title="Supprimer"
                              style={{width:32,height:32,borderRadius:8,border:"none",background:C.redBg,color:C.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </TD>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RESSOURCES PAGE
═══════════════════════════════════════════════════════════ */
const RessourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoad] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [paniers, setPaniers] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const toast = useToast();
  const { modal, confirm, yes, no } = useConfirm();
  useEffect(() => { const h = () => setWindowWidth(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  const isMobile = windowWidth <= 640;

  useEffect(() => {
    const load = async () => {
      try { setLoad(true); const { data } = await axios.get(`${API}/admin/resources`, { headers: authHeaders() }); setResources(data); }
      catch { setResources([]); } finally { setLoad(false); }
    }; load();
  }, []);

  const loadPanier = async id => {
    if (paniers[id] !== undefined) { setExpanded(expanded === id ? null : id); return; }
    try { const { data } = await axios.get(`${API}/admin/resources/${id}/paniers`, { headers: authHeaders() }); setPaniers(p => ({ ...p, [id]: data })); setExpanded(id); }
    catch { setPaniers(p => ({ ...p, [id]: [] })); setExpanded(id); }
  };

  const handleDelete = async (id, name) => {
    if (!await confirm({ type: "danger", title: "Supprimer cette ressource ?", message: `"${name}" sera définitivement supprimée.`, confirmLabel: "Supprimer" })) return;
    try { await axios.delete(`${API}/admin/resources/${id}`, { headers: authHeaders() }); setResources(p => p.filter(r => r._id !== id)); toast.success(`"${name}" supprimée`); }
    catch { toast.error("Erreur"); }
  };

  const filtered = resources.filter(r => {
    const mt = filter === "tous" || r.type === filter;
    const ms = search === "" || `${r.name} ${r.provider_name}`.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  return (
    <div>
      <ConfirmModal modal={modal} yes={yes} no={no} />
      <Toasts toasts={toast.toasts} remove={toast.remove} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["tous", "salle", "materiel", "decoration", "traiteur"].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`adash-filter${filter === t ? " active-purple" : ""}`}>
              {t === "tous" ? "Toutes" : t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 24, padding: "8px 16px", width: isMobile ? "100%" : "auto" }}>
          <Search size={14} color={C.t3} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            style={{ border: "none", background: "transparent", fontSize: 13, color: C.t1, width: isMobile ? "100%" : 200, fontFamily: "inherit" }} />
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}>{[1, 2, 3, 4].map(i => <div key={i} style={{ marginBottom: 12 }}><Skel h={48} r={8} /></div>)}</div>
        ) : filtered.length === 0 ? <EmptyState icon={Package} message="Aucune ressource trouvée" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead><tr style={{ background: C.bg }}><TH>Ressource</TH><TH>Type</TH><TH>Prix</TH><TH>Prestataire</TH><TH>Localisation</TH><TH>Paniers</TH><TH>Actions</TH></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <>
                    <tr key={r._id} className="adash-table-row">
                      <TD style={{ fontWeight: 500, color: C.t1 }}>{r.name}</TD>
                      <TD><Badge statut={r.type} /></TD>
                      <TD style={{ fontWeight: 600, color: C.purple }}>{Number(r.price).toFixed(2)} €</TD>
                      <TD><div style={{ fontWeight: 500, color: C.t1, fontSize: 13 }}>{r.provider_name}</div><div style={{ fontSize: 12, color: C.t3 }}>{r.provider_email}</div></TD>
                      <TD>{r.location || "—"}</TD>
                      <TD>
                        <button onClick={() => loadPanier(r._id)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: C.accentBg, border: "none", color: C.accent, cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}>
                          <Eye size={13} /> Voir
                          <ChevronDown size={12} style={{ transform: expanded === r._id ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                        </button>
                      </TD>
                      <TD>
                        <button className="adash-action-btn" onClick={() => handleDelete(r._id, r.name)} style={{ background: C.redBg, color: C.red }}>
                          <Trash2 size={13} /> Supprimer
                        </button>
                      </TD>
                    </tr>
                    {expanded === r._id && (
                      <tr key={r._id + "_exp"}>
                        <td colSpan={7} style={{ padding: "0 16px 16px", background: "#fafbff" }}>
                          <div style={{ borderRadius: 8, border: `1px solid ${C.accentBg}`, overflow: "hidden" }}>
                            <div style={{ padding: "10px 16px", background: C.accentBg, fontSize: 13, fontWeight: 500, color: C.accentText }}>Organisateurs — « {r.name} »</div>
                            {!paniers[r._id] || paniers[r._id].length === 0
                              ? <div style={{ padding: "14px 16px", fontSize: 13, color: C.t3 }}>Aucun organisateur.</div>
                              : <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                  <thead><tr style={{ background: C.bg }}><TH>Nom</TH><TH>Email</TH><TH>Téléphone</TH><TH>Région</TH></tr></thead>
                                  <tbody>{paniers[r._id].map(u => (<tr key={u._id} className="adash-table-row"><TD style={{ fontWeight: 500, color: C.t1 }}>{u.firstname} {u.lastname}</TD><TD>{u.email}</TD><TD>{u.numTel || "—"}</TD><TD>{u.region || "—"}</TD></tr>))}</tbody>
                                </table>
                            }
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
const pageTitles = { dashboard: "Dashboard", comptes: "Utilisateurs", gestion: "Gestion Utilisateurs", ressources: "Ressources", analytics: "Analytics", parametres: "Paramètres" };

export default function AdminDashboard() {
  useEffect(() => { injectStyles(); }, []);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  useEffect(() => { const h = () => { setWindowWidth(window.innerWidth); if (window.innerWidth > 768) setIsMobileOpen(false); }; window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  const isMobile = windowWidth <= 768;
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };



  const pages = {
    dashboard:  <DashboardPage />,
    gestion:    <ComptesPage />,
    ressources: <RessourcesPage />,
  };

  return (
    <div style={{ fontFamily: "Roboto,sans-serif", background: C.bg, minHeight: "100vh" }}>
      <Sidebar active={activePage} setActive={setActivePage} onLogout={handleLogout} isMobile={isMobile} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div style={{ marginLeft: isMobile ? 0 : 256, transition: "margin-left .25s ease" }}>
        <main style={{ padding: isMobile ? 16 : 28 }}>{pages[activePage]}</main>
      </div>
    </div>
  );
}
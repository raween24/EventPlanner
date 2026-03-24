import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, Wrench, Bell, Search,
  Shield, Star, LogOut, CheckCircle, XCircle,
  Eye, Trash2, ChevronDown, Package,
  Calendar, Clock, AlertCircle, AlertTriangle, Info, X, Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const getImgUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `http://localhost:5000/uploads/${image.replace(/\\/g, "/").split("/").pop()}`;
};

// ═══════════════════════════════════════════════════════════════
// MODAL SYSTEM
// ═══════════════════════════════════════════════════════════════
const Toast = ({ toasts, removeToast }) => (
  <div style={{
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: "calc(100% - 40px)",
  }}>
    {toasts.map(t => {
      const cfg = {
        success: { bg: "#f0fdf4", border: "#86efac", color: "#16a34a", icon: <CheckCircle size={16} /> },
        error:   { bg: "#fef2f2", border: "#fca5a5", color: "#dc2626", icon: <XCircle size={16} /> },
        info:    { bg: "#eff6ff", border: "#93c5fd", color: "#2563eb", icon: <Info size={16} /> },
      }[t.type] || {};
      return (
        <div
          key={t.id}
          className="toast-slide-in"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 12,
            padding: "12px 16px",
            minWidth: 280,
            boxShadow: "0 4px 20px rgba(0,0,0,.1)",
          }}
        >
          <span style={{ color: cfg.color, flexShrink: 0 }}>{cfg.icon}</span>
          <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, flex: 1 }}>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      );
    })}
  </div>
);

const ConfirmModal = ({ modal, onConfirm, onCancel }) => {
  if (!modal) return null;
  const cfg = {
    danger:  { icon: <Trash2 size={24} />,        iconBg: "#fef2f2", iconColor: "#ef4444", btnBg: "linear-gradient(135deg,#ef4444,#dc2626)" },
    warning: { icon: <AlertTriangle size={24} />,  iconBg: "#fffbeb", iconColor: "#f59e0b", btnBg: "linear-gradient(135deg,#f59e0b,#d97706)" },
    info:    { icon: <Info size={24} />,           iconBg: "#eff6ff", iconColor: "#3b82f6", btnBg: "linear-gradient(135deg,#3b82f6,#2563eb)" },
  }[modal.type] || {};
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,.5)",
      backdropFilter: "blur(4px)",
      zIndex: 9000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      animation: "fadeIn 0.2s ease",
    }}>
      <div
        className="modal-pop-in"
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          maxWidth: 420,
          width: "100%",
          margin: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
        }}
      >
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: cfg.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: cfg.iconColor,
          margin: "0 auto 20px",
          animation: "iconPulse 2s infinite",
        }}>
          {cfg.icon}
        </div>
        <h3 style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>
          {modal.title}
        </h3>
        <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", margin: "0 0 28px", lineHeight: 1.6 }}>
          {modal.message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            className="btn-hover"
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="btn-hover"
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              border: "none",
              background: cfg.btnBg,
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
              transition: "all 0.2s ease",
            }}
          >
            {modal.confirmLabel || "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, removeToast, success: m => addToast(m, "success"), error: m => addToast(m, "error"), info: m => addToast(m, "info") };
};

const useConfirm = () => {
  const [modal, setModal] = useState(null);
  const [resolve, setResolve] = useState(null);
  const confirm = (opts) => new Promise(res => { setModal(opts); setResolve(() => res); });
  const handleConfirm = () => { setModal(null); resolve(true); };
  const handleCancel  = () => { setModal(null); resolve(false); };
  return { modal, confirm, handleConfirm, handleCancel };
};

// ─── Shared UI ────────────────────────────────────────────────────────────────
const StatusBadge = ({ statut }) => {
  const map = {
    valide:        { bg: "#dcfce7", color: "#16a34a", label: "Validé" },
    en_attente:    { bg: "#fef9c3", color: "#ca8a04", label: "En attente" },
    rejected:      { bg: "#fee2e2", color: "#dc2626", label: "Rejeté" },
    organisateur:  { bg: "#eff6ff", color: "#3b82f6", label: "Organisateur" },
    prestataire:   { bg: "#f5f3ff", color: "#8b5cf6", label: "Prestataire" },
    admin:         { bg: "#fef2f2", color: "#ef4444", label: "Admin" },
    salle:         { bg: "#ecfdf5", color: "#10b981", label: "Salle" },
    materiel:      { bg: "#eff6ff", color: "#3b82f6", label: "Matériel" },
    decoration:    { bg: "#fdf4ff", color: "#a855f7", label: "Décoration" },
    traiteur:      { bg: "#fff7ed", color: "#f97316", label: "Traiteur" },
  };
  const s = map[statut] || { bg: "#f1f5f9", color: "#64748b", label: statut };
  return (
    <span
      className="status-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        transition: "all 0.2s ease",
      }}
    >
      <span style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: s.color,
        display: "inline-block",
        animation: "pulse 2s infinite",
      }} />
      {s.label}
    </span>
  );
};

const TH = ({ children }) => (
  <th style={{
    padding: "12px 20px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  }}>
    {children}
  </th>
);

const TD = ({ children, style }) => (
  <td style={{
    padding: "14px 20px",
    fontSize: 13,
    color: "#475569",
    fontFamily: "inherit",
    ...style,
  }}>
    {children}
  </td>
);

const Skeleton = ({ w = "100%", h = 32, radius = 8 }) => (
  <div
    className="skeleton-shimmer"
    style={{ width: w, height: h, borderRadius: radius }}
  />
);

const EmptyState = ({ icon: Icon, message }) => (
  <div
    className="empty-state-fade"
    style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}
  >
    <Icon size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
    <div style={{ fontSize: 14 }}>{message}</div>
  </div>
);

const ActionBtn = ({ icon: Icon, label, color, bg, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="action-btn"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 8,
      border: "none",
      background: disabled ? "#f1f5f9" : bg,
      color: disabled ? "#cbd5e1" : color,
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      transform: "scale(1)",
    }}
  >
    <Icon size={13} />
    {label}
  </button>
);

// ─── UserImage ────────────────────────────────────────────────────────────────
const UserImage = ({ image, firstname, lastname, isPrest }) => {
  const [err, setErr] = useState(false);
  const url  = getImgUrl(image);
  const grad = isPrest
    ? "linear-gradient(135deg,#8b5cf6,#a855f7)"
    : "linear-gradient(135deg,#3b82f6,#60a5fa)";
  return (
    <div
      className="user-image"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: grad,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        transition: "transform 0.2s ease",
      }}
    >
      {url && !err
        ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setErr(true)} />
        : <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{firstname?.[0]}{lastname?.[0]}</span>
      }
    </div>
  );
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard",  label: "Dashboard",              icon: LayoutDashboard },
  { id: "comptes",    label: "Gestion des comptes",    icon: Users },
  { id: "ressources", label: "Gestion des ressources", icon: Wrench },
];

const Sidebar = ({ active, setActive, onLogout, isMobile, isMobileOpen, setIsMobileOpen }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (isMobile && !isMobileOpen) {
    return (
      <button
        onClick={() => setIsMobileOpen(true)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 90,
          background: "#0f172a",
          border: "none",
          borderRadius: 10,
          padding: 10,
          cursor: "pointer",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.2s ease",
        }}
      >
        <Menu size={20} />
      </button>
    );
  }

  return (
    <aside
      style={{
        width: isMobile ? "80%" : 260,
        maxWidth: isMobile ? 300 : "none",
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 200,
        boxShadow: "2px 0 20px rgba(0,0,0,.3)",
        transform: isMobile ? (isMobileOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowY: "auto",
      }}
    >
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            color: "#94a3b8",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <X size={18} />
        </button>
      )}

      <div style={{ padding: "24px 20px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="logo-animation"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={18} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Smart Event</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 8px", color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
        NAVIGATION
      </div>

      <nav style={{ flex: 1, padding: "0 12px" }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => { setActive(id); if (isMobile) setIsMobileOpen(false); }}
              className={`nav-item ${on ? "active" : ""}`}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 2,
                background: on ? "linear-gradient(135deg,rgba(59,130,246,.2),rgba(139,92,246,.2))" : "transparent",
                border: on ? "1px solid rgba(99,102,241,.3)" : "1px solid transparent",
                color: on ? "#93c5fd" : "#94a3b8",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: on ? 600 : 400,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={18} />
              {label}
              {on && (
                <span
                  className="active-dot"
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #1e293b" }}>
        <div
          className="user-profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 10,
            background: "#1e293b",
            marginBottom: 8,
            transition: "transform 0.2s ease",
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#ef4444,#f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Shield size={16} color="white" />
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.firstname || "Admin"} {user.lastname || ""}
            </div>
            <div style={{ color: "#64748b", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.email || "admin@event.com"}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="logout-btn"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 10,
            background: "rgba(239,68,68,.1)",
            border: "1px solid rgba(239,68,68,.2)",
            color: "#f87171",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
};

// ─── TopBar ───────────────────────────────────────────────────────────────────
const TopBar = ({ title, showSearch = true, searchValue, onSearchChange, isMobile }) => {
  const [searchVisible, setSearchVisible] = useState(!isMobile);

  return (
    <div
      className="top-bar"
      style={{
        height: 64,
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 16px 0 60px" : "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.2s ease",
      }}
    >
      <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>
        {title}
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {showSearch && (
          <>
            {isMobile && (
              <button
                onClick={() => setSearchVisible(!searchVisible)}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 8,
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <Search size={16} />
              </button>
            )}
            {(searchVisible || !isMobile) && (
              <div
                className="search-bar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "8px 14px",
                  transition: "all 0.3s ease",
                }}
              >
                <Search size={15} color="#94a3b8" />
                <input
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder="Rechercher..."
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: 13,
                    color: "#475569",
                    width: isMobile ? "100%" : 180,
                    fontFamily: "inherit",
                  }}
                />
              </div>
            )}
          </>
        )}
        <div
          className="admin-avatar"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#ef4444,#f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 3s infinite",
            transition: "transform 0.2s ease",
          }}
        >
          <Shield size={16} color="white" />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE 1 — DASHBOARD
// ═══════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile  = windowWidth <= 640;
  const isTablet  = windowWidth <= 1024;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/stats`, { headers: authHeaders() });
        setStats(data);
        const usersRes = await axios.get(`${API}/admin/users`, { headers: authHeaders() });
        const users = usersRes.data;
        const orga  = users.filter(u => u.role === "organisateur").length;
        const prest = users.filter(u => u.role === "prestataire").length;
        const pend  = users.filter(u => u.role === "prestataire" && u.status === "en_attente").length;
        const total = users.length || 1;
        setRoleData([
          { label: "Organisateurs",            count: orga,  color: "#3b82f6", pct: Math.round(orga  / total * 100) },
          { label: "Prestataires",             count: prest, color: "#8b5cf6", pct: Math.round(prest / total * 100) },
          { label: "En attente validation",    count: pend,  color: "#f59e0b", pct: Math.round(pend  / total * 100) },
        ]);
      } catch {
        setStats({ users: 0, events: 0, resources: 0, pending: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: "Utilisateurs total",       value: stats?.users,     icon: Users,    color: "#3b82f6", bg: "#eff6ff" },
    { label: "Ressources publiées",      value: stats?.resources, icon: Package,  color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Événements",              value: stats?.events,    icon: Calendar, color: "#10b981", bg: "#ecfdf5" },
    { label: "Prestataires en attente", value: stats?.pending,   icon: Clock,    color: "#f59e0b", bg: "#fffbeb" },
  ];

  const getGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2,1fr)";
    return "repeat(4,1fr)";
  };

  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: getGridColumns(),
        gap: isMobile ? 12 : 20,
        marginBottom: isMobile ? 16 : 28,
      }}>
        {cards.map((c, i) => (
          <div
            key={i}
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 16,
              padding: isMobile ? 16 : 20,
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#94a3b8", fontSize: isMobile ? 11 : 12, fontWeight: 500, marginBottom: 8 }}>
                  {c.label}
                </div>
                {loading ? (
                  <Skeleton w="70px" h={isMobile ? 28 : 34} radius={6} />
                ) : (
                  <div style={{
                    fontSize: isMobile ? 24 : 30,
                    fontWeight: 800,
                    color: "#0f172a",
                    animation: "countUp 0.5s ease",
                  }}>
                    {c.value ?? 0}
                  </div>
                )}
              </div>
              <div style={{
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                borderRadius: 12,
                background: c.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <c.icon size={isMobile ? 16 : 20} color={c.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 12 : 20,
      }}>
        {/* User distribution */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", padding: isMobile ? 16 : 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#0f172a" }}>
            Répartition des utilisateurs
          </h3>
          {loading
            ? [1, 2, 3].map(i => <div key={i} style={{ marginBottom: 16 }}><Skeleton h={10} radius={6} /></div>)
            : roleData.map(r => (
              <div key={r.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    {r.count} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({r.pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                  <div
                    className="progress-bar"
                    style={{
                      height: "100%",
                      width: `${r.pct}%`,
                      background: r.color,
                      borderRadius: 6,
                      transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </div>
              </div>
            ))
          }
        </div>

        {/* Resource types */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", padding: isMobile ? 16 : 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#0f172a" }}>
            Types de ressources
          </h3>
          {loading
            ? [1, 2, 3, 4].map(i => <div key={i} style={{ marginBottom: 16 }}><Skeleton h={10} radius={6} /></div>)
            : [
              { label: "Salle",       color: "#10b981", key: "salle" },
              { label: "Matériel",   color: "#3b82f6", key: "materiel" },
              { label: "Décoration", color: "#a855f7", key: "decoration" },
              { label: "Traiteur",   color: "#f97316", key: "traiteur" },
            ].map(t => {
              const count = stats?.resourcesByType?.[t.key] || 0;
              const pct   = Math.round(count / (stats?.resources || 1) * 100);
              return (
                <div key={t.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{t.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                      {count} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                    <div
                      className="progress-bar"
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: t.color,
                        borderRadius: 6,
                        transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE 2 — GESTION DES COMPTES
// ═══════════════════════════════════════════════════════════════
const ComptesPage = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("tous");
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch]         = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const toast = useToast();
  const { modal, confirm, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 640;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/admin/users`, { headers: authHeaders() });
      setUsers(data);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleValidate = async (userId, name) => {
    try {
      setActionLoading(userId + "_validate");
      await axios.patch(`${API}/admin/users/${userId}/status`, { status: "valide" }, { headers: authHeaders() });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: "valide" } : u));
      toast.success(`✅ Compte de ${name} validé avec succès`);
    } catch {
      toast.error("Erreur lors de la validation du compte");
    } finally { setActionLoading(null); }
  };

  const handleReject = async (userId, name) => {
    const ok = await confirm({
      type: "warning",
      title: "Rejeter ce compte ?",
      message: `Le prestataire "${name}" ne pourra pas accéder à la plateforme. Cette action peut être annulée plus tard.`,
      confirmLabel: "Oui, rejeter",
    });
    if (!ok) return;
    try {
      setActionLoading(userId + "_reject");
      await axios.patch(`${API}/admin/users/${userId}/status`, { status: "rejected" }, { headers: authHeaders() });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: "rejected" } : u));
      toast.info(`Compte de ${name} rejeté`);
    } catch {
      toast.error("Erreur lors du rejet du compte");
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (userId, name) => {
    const ok = await confirm({
      type: "danger",
      title: "Supprimer ce compte ?",
      message: `Le compte de "${name}" sera définitivement supprimé. Cette action est irréversible.`,
      confirmLabel: "Supprimer",
    });
    if (!ok) return;
    try {
      setActionLoading(userId + "_delete");
      await axios.delete(`${API}/admin/users/${userId}`, { headers: authHeaders() });
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success(`Compte de ${name} supprimé`);
    } catch {
      toast.error("Erreur lors de la suppression du compte");
    } finally { setActionLoading(null); }
  };

  const filters = [
    { key: "tous",         label: "Tous" },
    { key: "prestataire",  label: "Prestataires" },
    { key: "organisateur", label: "Organisateurs" },
    { key: "en_attente",   label: "En attente" },
  ];

  const filtered = users.filter(u => {
    const matchRole   = filter === "tous" ? true
      : filter === "en_attente" ? (u.role === "prestataire" && u.status === "en_attente")
      : u.role === filter;
    const matchSearch = search === "" || `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const pendingCount = users.filter(u => u.role === "prestataire" && u.status === "en_attente").length;

  return (
    <div>
      <ConfirmModal modal={modal} onConfirm={handleConfirm} onCancel={handleCancel} />
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

      {pendingCount > 0 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fffbeb",
          border: "1px solid #fcd34d",
          borderRadius: 12,
          padding: isMobile ? "10px 14px" : "12px 18px",
          marginBottom: 20,
          fontSize: 13,
          color: "#92400e",
          animation: "fadeInUp 0.5s ease",
        }}>
          <AlertCircle size={16} color="#f59e0b" />
          <strong>{pendingCount} prestataire{pendingCount > 1 ? "s" : ""}</strong>&nbsp;en attente de validation
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: isMobile ? 4 : 8, flexWrap: "wrap" }}>
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`filter-btn ${filter === f.key ? "active" : ""}`}
              style={{
                padding: isMobile ? "6px 12px" : "7px 16px",
                borderRadius: 20,
                fontSize: isMobile ? 12 : 13,
                fontWeight: 600,
                cursor: "pointer",
                background: filter === f.key ? "#3b82f6" : "white",
                color: filter === f.key ? "white" : "#64748b",
                border: filter === f.key ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {f.label}
              {f.key === "en_attente" && pendingCount > 0 && (
                <span style={{
                  marginLeft: 6,
                  background: "#ef4444",
                  color: "white",
                  borderRadius: 10,
                  padding: "1px 6px",
                  fontSize: 11,
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: isMobile ? "6px 12px" : "8px 14px",
          width: isMobile ? "100%" : "auto",
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#475569",
              width: isMobile ? "100%" : 200,
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ marginBottom: 12 }}><Skeleton h={40} radius={8} /></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} message="Aucun utilisateur trouvé" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "auto" : 800 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <TH>Utilisateur</TH>
                  <TH>Email</TH>
                  <TH>Téléphone</TH>
                  <TH>Rôle</TH>
                  <TH>Statut</TH>
                  <TH>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, index) => {
                  const name   = `${u.firstname} ${u.lastname}`;
                  const isPrest = u.role === "prestataire";
                  return (
                    <tr
                      key={u._id}
                      className="table-row"
                      style={{
                        borderTop: "1px solid #f8fafc",
                        transition: "all 0.2s ease",
                        animationDelay: `${index * 0.05}s`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <TD data-label="Utilisateur">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <UserImage image={u.image} firstname={u.firstname} lastname={u.lastname} isPrest={isPrest} />
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{name}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{u.region || "—"}</div>
                          </div>
                        </div>
                      </TD>
                      <TD data-label="Email">{u.email}</TD>
                      <TD data-label="Téléphone">{u.numTel || "—"}</TD>
                      <TD data-label="Rôle"><StatusBadge statut={u.role} /></TD>
                      <TD data-label="Statut">
                        {isPrest
                          ? <StatusBadge statut={u.status || "en_attente"} />
                          : <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                        }
                      </TD>
                      <TD data-label="Actions">
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {isPrest && u.status === "en_attente" && (
                            <ActionBtn icon={CheckCircle} label="Valider"  color="#16a34a" bg="#dcfce7" onClick={() => handleValidate(u._id, name)} disabled={actionLoading === u._id + "_validate"} />
                          )}
                          {isPrest && u.status === "en_attente" && (
                            <ActionBtn icon={XCircle}    label="Rejeter"  color="#dc2626" bg="#fee2e2" onClick={() => handleReject(u._id, name)}   disabled={actionLoading === u._id + "_reject"} />
                          )}
                          {isPrest && u.status === "rejected" && (
                            <ActionBtn icon={CheckCircle} label="Ré-activer" color="#16a34a" bg="#dcfce7" onClick={() => handleValidate(u._id, name)} disabled={actionLoading === u._id + "_validate"} />
                          )}
                          <ActionBtn icon={Trash2} label="Supprimer" color="#64748b" bg="#f1f5f9" onClick={() => handleDelete(u._id, name)} disabled={actionLoading === u._id + "_delete"} />
                        </div>
                      </TD>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE 3 — GESTION DES RESSOURCES
// ═══════════════════════════════════════════════════════════════
const RessourcesPage = () => {
  const [resources, setResources]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("tous");
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState(null);
  const [paniers, setPaniers]       = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const toast = useToast();
  const { modal, confirm, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 640;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/admin/resources`, { headers: authHeaders() });
        setResources(data);
      } catch { setResources([]); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const loadPanier = async (resourceId) => {
    if (paniers[resourceId] !== undefined) {
      setExpanded(expanded === resourceId ? null : resourceId);
      return;
    }
    try {
      const { data } = await axios.get(`${API}/admin/resources/${resourceId}/paniers`, { headers: authHeaders() });
      setPaniers(prev => ({ ...prev, [resourceId]: data }));
      setExpanded(resourceId);
    } catch {
      setPaniers(prev => ({ ...prev, [resourceId]: [] }));
      setExpanded(resourceId);
    }
  };

  const handleDelete = async (id, name) => {
    const ok = await confirm({
      type: "danger",
      title: "Supprimer cette ressource ?",
      message: `La ressource "${name}" sera définitivement supprimée. Cette action est irréversible.`,
      confirmLabel: "Supprimer",
    });
    if (!ok) return;
    try {
      await axios.delete(`${API}/admin/resources/${id}`, { headers: authHeaders() });
      setResources(prev => prev.filter(r => r._id !== id));
      toast.success(`Ressource "${name}" supprimée`);
    } catch {
      toast.error("Erreur lors de la suppression de la ressource");
    }
  };

  const types    = ["tous", "salle", "materiel", "decoration", "traiteur"];
  const filtered = resources.filter(r => {
    const matchType   = filter === "tous" || r.type === filter;
    const matchSearch = search === "" || `${r.name} ${r.provider_name}`.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div>
      <ConfirmModal modal={modal} onConfirm={handleConfirm} onCancel={handleCancel} />
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: isMobile ? 4 : 8, flexWrap: "wrap" }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`filter-btn ${filter === t ? "active" : ""}`}
              style={{
                padding: isMobile ? "6px 12px" : "7px 16px",
                borderRadius: 20,
                fontSize: isMobile ? 12 : 13,
                fontWeight: 600,
                cursor: "pointer",
                background: filter === t ? "#8b5cf6" : "white",
                color: filter === t ? "white" : "#64748b",
                border: filter === t ? "1px solid #8b5cf6" : "1px solid #e2e8f0",
                fontFamily: "inherit",
                textTransform: "capitalize",
                transition: "all 0.2s ease",
              }}
            >
              {t === "tous" ? "Toutes" : t}
            </button>
          ))}
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: isMobile ? "6px 12px" : "8px 14px",
          width: isMobile ? "100%" : "auto",
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une ressource..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#475569",
              width: isMobile ? "100%" : 200,
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ marginBottom: 12 }}><Skeleton h={48} radius={8} /></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} message="Aucune ressource trouvée" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "auto" : 900 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <TH>Ressource</TH>
                  <TH>Type</TH>
                  <TH>Prix</TH>
                  <TH>Prestataire</TH>
                  <TH>Localisation</TH>
                  <TH>Paniers</TH>
                  <TH>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, index) => (
                  <>
                    <tr
                      key={r._id}
                      className="table-row"
                      style={{
                        borderTop: "1px solid #f8fafc",
                        transition: "all 0.2s ease",
                        animationDelay: `${index * 0.05}s`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <TD data-label="Ressource" style={{ fontWeight: 600, color: "#0f172a" }}>{r.name}</TD>
                      <TD data-label="Type"><StatusBadge statut={r.type} /></TD>
                      <TD data-label="Prix" style={{ fontWeight: 700, color: "#8b5cf6" }}>{Number(r.price).toFixed(2)} €</TD>
                      <TD data-label="Prestataire">
                        <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{r.provider_name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.provider_email}</div>
                      </TD>
                      <TD data-label="Localisation">{r.location || "—"}</TD>
                      <TD data-label="Paniers">
                        <button
                          onClick={() => loadPanier(r._id)}
                          className="view-paniers-btn"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: isMobile ? "4px 8px" : "5px 10px",
                            borderRadius: 8,
                            background: "#f5f3ff",
                            border: "1px solid #e9d5ff",
                            color: "#8b5cf6",
                            cursor: "pointer",
                            fontSize: isMobile ? 11 : 12,
                            fontWeight: 600,
                            fontFamily: "inherit",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Eye size={isMobile ? 10 : 12} />
                          {!isMobile && "Voir paniers"}
                          <ChevronDown
                            size={isMobile ? 10 : 12}
                            style={{
                              transform: expanded === r._id ? "rotate(180deg)" : "none",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </button>
                      </TD>
                      <TD data-label="Actions">
                        <ActionBtn
                          icon={Trash2}
                          label={isMobile ? "" : "Supprimer"}
                          color="#dc2626"
                          bg="#fee2e2"
                          onClick={() => handleDelete(r._id, r.name)}
                        />
                      </TD>
                    </tr>

                    {expanded === r._id && (
                      <tr key={r._id + "_exp"} style={{ animation: "fadeInUp 0.3s ease" }}>
                        <td colSpan={7} style={{ padding: isMobile ? "0 12px 12px" : "0 20px 16px", background: "#faf9ff" }}>
                          <div style={{ borderRadius: 10, border: "1px solid #e9d5ff", overflow: "hidden" }}>
                            <div style={{ padding: isMobile ? "8px 12px" : "10px 16px", background: "#f5f3ff", fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#7c3aed" }}>
                              👥 Organisateurs ayant ajouté "{r.name}" à leur panier
                            </div>
                            {!paniers[r._id] || paniers[r._id].length === 0 ? (
                              <div style={{ padding: isMobile ? "12px 12px" : "14px 16px", fontSize: 13, color: "#94a3b8" }}>
                                Aucun organisateur n'a ajouté cette ressource à son panier.
                              </div>
                            ) : (
                              <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 400 : "auto" }}>
                                  <thead>
                                    <tr style={{ background: "#f8fafc" }}>
                                      <TH>Nom</TH>
                                      <TH>Email</TH>
                                      <TH>Téléphone</TH>
                                      <TH>Région</TH>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {paniers[r._id].map(u => (
                                      <tr key={u._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                        <TD data-label="Nom" style={{ fontWeight: 500, color: "#0f172a" }}>{u.firstname} {u.lastname}</TD>
                                        <TD data-label="Email">{u.email}</TD>
                                        <TD data-label="Téléphone">{u.numTel || "—"}</TD>
                                        <TD data-label="Région">{u.region || "—"}</TD>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
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

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
const pageTitles = {
  dashboard:  "Dashboard",
  comptes:    "Gestion des comptes",
  ressources: "Gestion des ressources",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage]     = useState("dashboard");
  const [windowWidth, setWindowWidth]   = useState(window.innerWidth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 640) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 640;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pages = {
    dashboard:  <DashboardPage />,
    comptes:    <ComptesPage />,
    ressources: <RessourcesPage />,
  };

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        onLogout={handleLogout}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {isMobile && isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 150,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      <div style={{ marginLeft: isMobile ? 0 : 260, transition: "margin-left 0.3s ease" }}>
        <TopBar
          title={pageTitles[activePage]}
          showSearch={activePage !== "dashboard"}
          isMobile={isMobile}
          searchValue=""
          onSearchChange={() => {}}
        />
        <main style={{ padding: isMobile ? 16 : 28 }}>
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}
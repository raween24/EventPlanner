import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, Wrench, Bell, Search,
  Shield, Star, LogOut, CheckCircle, XCircle,
  Eye, Trash2, ChevronDown, RefreshCw, Package,
  Calendar, UserCheck, Clock, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// ─── Shared UI ────────────────────────────────────────────────────────────────
const StatusBadge = ({ statut }) => {
  const map = {
    valide:      { bg: "#dcfce7", color: "#16a34a", label: "Validé" },
    en_attente:  { bg: "#fef9c3", color: "#ca8a04", label: "En attente" },
    rejected:    { bg: "#fee2e2", color: "#dc2626", label: "Rejeté" },
    organisateur:{ bg: "#eff6ff", color: "#3b82f6", label: "Organisateur" },
    prestataire: { bg: "#f5f3ff", color: "#8b5cf6", label: "Prestataire" },
    admin:       { bg: "#fef2f2", color: "#ef4444", label: "Admin" },
    salle:       { bg: "#ecfdf5", color: "#10b981", label: "Salle" },
    materiel:    { bg: "#eff6ff", color: "#3b82f6", label: "Matériel" },
    decoration:  { bg: "#fdf4ff", color: "#a855f7", label: "Décoration" },
    traiteur:    { bg: "#fff7ed", color: "#f97316", label: "Traiteur" },
  };
  const s = map[statut] || { bg: "#f1f5f9", color: "#64748b", label: statut };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {s.label}
    </span>
  );
};

const TH = ({ children }) => (
  <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", fontFamily: "inherit", whiteSpace: "nowrap" }}>{children}</th>
);

const TD = ({ children, style }) => (
  <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569", fontFamily: "inherit", ...style }}>{children}</td>
);

const Skeleton = ({ w = "100%", h = 32, radius = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
);

const EmptyState = ({ icon: Icon, message }) => (
  <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>
    <Icon size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
    <div style={{ fontSize: 14 }}>{message}</div>
  </div>
);

const ActionBtn = ({ icon: Icon, label, color, bg, border, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: border || "none", background: disabled ? "#f1f5f9" : bg, color: disabled ? "#cbd5e1" : color, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "opacity .2s" }}>
    <Icon size={13} />{label}
  </button>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard",  label: "Dashboard",           icon: LayoutDashboard },
  { id: "comptes",    label: "Gestion des comptes",  icon: Users },
  { id: "ressources", label: "Gestion des ressources", icon: Wrench },
];

const Sidebar = ({ active, setActive, onLogout }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <aside style={{ width: 260, minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100, boxShadow: "2px 0 20px rgba(0,0,0,.3)" }}>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={18} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Smart Event</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 20px 8px", color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>NAVIGATION</div>
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => setActive(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, marginBottom: 2, background: on ? "linear-gradient(135deg,rgba(59,130,246,.2),rgba(139,92,246,.2))" : "transparent", border: on ? "1px solid rgba(99,102,241,.3)" : "1px solid transparent", color: on ? "#93c5fd" : "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: on ? 600 : 400, fontFamily: "inherit" }}>
              <Icon size={18} />{label}
              {on && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#1e293b", marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#ef4444,#f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={16} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{user.firstname} {user.lastname}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
};

const TopBar = ({ title }) => (
  <div style={{ height: 64, background: "white", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 50 }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h1>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px" }}>
        <Search size={15} color="#94a3b8" />
        <input placeholder="Rechercher..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: 180, fontFamily: "inherit" }} />
      </div>
      <div style={{ position: "relative", cursor: "pointer" }}>
        <Bell size={20} color="#64748b" />
      </div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#ef4444,#f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Shield size={16} color="white" />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// PAGE 1 — DASHBOARD
// ═══════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/stats`, { headers: authHeaders() });
        setStats(data);

        // Calcul répartition rôles depuis les users
        const usersRes = await axios.get(`${API}/admin/users`, { headers: authHeaders() });
        const users = usersRes.data;
        const orga = users.filter(u => u.role === "organisateur").length;
        const prest = users.filter(u => u.role === "prestataire").length;
        const total = users.length || 1;
        setRoleData([
          { label: "Organisateurs", count: orga, color: "#3b82f6", pct: Math.round(orga / total * 100) },
          { label: "Prestataires",  count: prest, color: "#8b5cf6", pct: Math.round(prest / total * 100) },
          { label: "En attente validation", count: users.filter(u => u.role === "prestataire" && u.status === "en_attente").length, color: "#f59e0b", pct: Math.round(users.filter(u => u.role === "prestataire" && u.status === "en_attente").length / total * 100) },
        ]);
      } catch {
        setStats({ users: 0, events: 0, resources: 0, documents: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const cards = [
    { label: "Utilisateurs total",       value: stats?.users,     icon: Users,       color: "#3b82f6", bg: "#eff6ff" },
    { label: "Ressources publiées",       value: stats?.resources, icon: Package,     color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Événements",               value: stats?.events,    icon: Calendar,    color: "#10b981", bg: "#ecfdf5" },
    { label: "Prestataires en attente",  value: stats?.pending,   icon: Clock,       color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>{c.label}</div>
                {loading ? <Skeleton w="70px" h={34} radius={6} /> :
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a" }}>{c.value ?? 0}</div>
                }
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <c.icon size={20} color={c.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Répartition rôles */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Répartition des utilisateurs</h3>
          {loading ? [1,2,3].map(i => <div key={i} style={{ marginBottom: 16 }}><Skeleton h={10} radius={6} /></div>) :
            roleData.map(r => (
              <div key={r.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{r.count} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({r.pct}%)</span></span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6 }}>
                  <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 6, transition: "width .6s ease" }} />
                </div>
              </div>
            ))
          }
        </div>

        {/* Répartition ressources */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Types de ressources</h3>
          {loading ? [1,2,3,4].map(i => <div key={i} style={{ marginBottom: 16 }}><Skeleton h={10} radius={6} /></div>) :
            [
              { label: "Salle",       color: "#10b981", key: "salle" },
              { label: "Matériel",    color: "#3b82f6", key: "materiel" },
              { label: "Décoration",  color: "#a855f7", key: "decoration" },
              { label: "Traiteur",    color: "#f97316", key: "traiteur" },
            ].map(t => {
              const count = stats?.resourcesByType?.[t.key] || 0;
              const total = stats?.resources || 1;
              const pct = Math.round(count / total * 100);
              return (
                <div key={t.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{t.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{count} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: t.color, borderRadius: 6, transition: "width .6s ease" }} />
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/admin/users`, { headers: authHeaders() });
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleValidate = async (userId) => {
    try {
      setActionLoading(userId + "_validate");
      await axios.patch(`${API}/admin/users/${userId}/status`, { status: "valide" }, { headers: authHeaders() });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: "valide" } : u));
    } catch (e) {
      alert("Erreur lors de la validation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Rejeter ce compte ?")) return;
    try {
      setActionLoading(userId + "_reject");
      await axios.patch(`${API}/admin/users/${userId}/status`, { status: "rejected" }, { headers: authHeaders() });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: "rejected" } : u));
    } catch {
      alert("Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Supprimer définitivement ce compte ?")) return;
    try {
      setActionLoading(userId + "_delete");
      await axios.delete(`${API}/admin/users/${userId}`, { headers: authHeaders() });
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const filters = [
    { key: "tous",        label: "Tous" },
    { key: "prestataire", label: "Prestataires" },
    { key: "organisateur",label: "Organisateurs" },
    { key: "en_attente",  label: "En attente" },
  ];

  const filtered = users.filter(u => {
    const matchRole = filter === "tous" ? true
      : filter === "en_attente" ? (u.role === "prestataire" && u.status === "en_attente")
      : u.role === filter;
    const matchSearch = search === "" || `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const pendingCount = users.filter(u => u.role === "prestataire" && u.status === "en_attente").length;

  return (
    <div>
      {/* Alert prestataires en attente */}
      {pendingCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: "#92400e" }}>
          <AlertCircle size={16} color="#f59e0b" />
          <strong>{pendingCount} prestataire{pendingCount > 1 ? "s" : ""}</strong>&nbsp;en attente de validation
        </div>
      )}

      {/* Filters + search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", background: filter === f.key ? "#3b82f6" : "white", color: filter === f.key ? "white" : "#64748b", border: filter === f.key ? "1px solid #3b82f6" : "1px solid #e2e8f0", fontFamily: "inherit" }}>
              {f.label}{f.key === "en_attente" && pendingCount > 0 && <span style={{ marginLeft: 6, background: "#ef4444", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>{pendingCount}</span>}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px" }}>
          <Search size={14} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur..." style={{ border: "none", outline: "none", fontSize: 13, color: "#475569", width: 200, fontFamily: "inherit" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}>{[1,2,3,4,5].map(i => <div key={i} style={{ marginBottom: 12 }}><Skeleton h={40} radius={8} /></div>)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} message="Aucun utilisateur trouvé" />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              {filtered.map(u => (
                <tr key={u._id} style={{ borderTop: "1px solid #f8fafc", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                  {/* Avatar + nom */}
                  <TD>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: u.role === "prestataire" ? "linear-gradient(135deg,#8b5cf6,#a855f7)" : "linear-gradient(135deg,#3b82f6,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {u.image ? <img src={`http://localhost:5000/uploads/${u.image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
                          <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{u.firstname?.[0]}{u.lastname?.[0]}</span>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{u.firstname} {u.lastname}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{u.region || "—"}</div>
                      </div>
                    </div>
                  </TD>

                  <TD>{u.email}</TD>
                  <TD>{u.numTel || "—"}</TD>
                  <TD><StatusBadge statut={u.role} /></TD>
                  <TD>
                    {u.role === "prestataire"
                      ? <StatusBadge statut={u.status || "en_attente"} />
                      : <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                    }
                  </TD>

                  {/* Actions */}
                  <TD>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {u.role === "prestataire" && u.status !== "valide" && (
                        <ActionBtn icon={CheckCircle} label="Valider" color="#16a34a" bg="#dcfce7" onClick={() => handleValidate(u._id)} disabled={actionLoading === u._id + "_validate"} />
                      )}
                      {u.role === "prestataire" && u.status !== "rejected" && (
                        <ActionBtn icon={XCircle} label="Rejeter" color="#dc2626" bg="#fee2e2" onClick={() => handleReject(u._id)} disabled={actionLoading === u._id + "_reject"} />
                      )}
                      <ActionBtn icon={Trash2} label="Supprimer" color="#64748b" bg="#f1f5f9" onClick={() => handleDelete(u._id)} disabled={actionLoading === u._id + "_delete"} />
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE 3 — GESTION DES RESSOURCES
// ═══════════════════════════════════════════════════════════════
const RessourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [paniers, setPaniers] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/admin/resources`, { headers: authHeaders() });
        setResources(data);
      } catch {
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Charger qui a mis en panier cette ressource
  const loadPanier = async (resourceId) => {
    if (paniers[resourceId]) {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    try {
      await axios.delete(`${API}/admin/resources/${id}`, { headers: authHeaders() });
      setResources(prev => prev.filter(r => r._id !== id));
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const types = ["tous", "salle", "materiel", "decoration", "traiteur"];
  const filtered = resources.filter(r => {
    const matchType = filter === "tous" || r.type === filter;
    const matchSearch = search === "" || `${r.name} ${r.provider_name}`.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div>
      {/* Filters + search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", background: filter === t ? "#8b5cf6" : "white", color: filter === t ? "white" : "#64748b", border: filter === t ? "1px solid #8b5cf6" : "1px solid #e2e8f0", fontFamily: "inherit", textTransform: "capitalize" }}>
              {t === "tous" ? "Toutes" : t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px" }}>
          <Search size={14} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une ressource..." style={{ border: "none", outline: "none", fontSize: 13, color: "#475569", width: 200, fontFamily: "inherit" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}>{[1,2,3,4].map(i => <div key={i} style={{ marginBottom: 12 }}><Skeleton h={48} radius={8} /></div>)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} message="Aucune ressource trouvée" />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              {filtered.map(r => (
                <>
                  <tr key={r._id} style={{ borderTop: "1px solid #f8fafc" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <TD style={{ fontWeight: 600, color: "#0f172a" }}>{r.name}</TD>
                    <TD><StatusBadge statut={r.type} /></TD>
                    <TD style={{ fontWeight: 700, color: "#8b5cf6" }}>{Number(r.price).toFixed(2)} €</TD>
                    <TD>
                      <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{r.provider_name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.provider_email}</div>
                    </TD>
                    <TD>{r.location || "—"}</TD>
                    <TD>
                      <button onClick={() => loadPanier(r._id)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "#f5f3ff", border: "1px solid #e9d5ff", color: "#8b5cf6", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                        <Eye size={12} /> Voir paniers
                        <ChevronDown size={12} style={{ transform: expanded === r._id ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                      </button>
                    </TD>
                    <TD>
                      <ActionBtn icon={Trash2} label="Supprimer" color="#dc2626" bg="#fee2e2" onClick={() => handleDelete(r._id)} />
                    </TD>
                  </tr>

                  {/* Expanded: users who added to panier */}
                  {expanded === r._id && (
                    <tr key={r._id + "_exp"}>
                      <td colSpan={7} style={{ padding: "0 20px 16px", background: "#faf9ff" }}>
                        <div style={{ borderRadius: 10, border: "1px solid #e9d5ff", overflow: "hidden" }}>
                          <div style={{ padding: "10px 16px", background: "#f5f3ff", fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>
                            👥 Organisateurs ayant ajouté "{r.name}" à leur panier
                          </div>
                          {!paniers[r._id] || paniers[r._id].length === 0 ? (
                            <div style={{ padding: "14px 16px", fontSize: 13, color: "#94a3b8" }}>Aucun organisateur n'a ajouté cette ressource à son panier.</div>
                          ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                  <TH>Nom</TH><TH>Email</TH><TH>Téléphone</TH><TH>Région</TH>
                                </tr>
                              </thead>
                              <tbody>
                                {paniers[r._id].map(u => (
                                  <tr key={u._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                    <TD style={{ fontWeight: 500, color: "#0f172a" }}>{u.firstname} {u.lastname}</TD>
                                    <TD>{u.email}</TD>
                                    <TD>{u.numTel || "—"}</TD>
                                    <TD>{u.region || "—"}</TD>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
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
  const [activePage, setActivePage] = useState("dashboard");

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
      <Sidebar active={activePage} setActive={setActivePage} onLogout={handleLogout} />
      <div style={{ marginLeft: 260 }}>
        <TopBar title={pageTitles[activePage]} />
        <main style={{ padding: 28 }}>{pages[activePage]}</main>
      </div>
    </div>
  );
}
import { useState } from "react";
import {
  LayoutDashboard, Calendar, Wrench, FileText, User,
  Bell, Search, Users, CheckCircle, Upload, Eye, Trash2,
  Plus, Download, Shield, Package, Star, LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockEvents = [
  { id: 1, name: "Conférence Tech 2026", date: "2026-04-15", lieu: "Paris – Palais des Congrès", participants: 350, statut: "Confirmé" },
  { id: 2, name: "Séminaire Marketing Digital", date: "2026-05-02", lieu: "Lyon – Centre des Congrès", participants: 120, statut: "Confirmé" },
  { id: 3, name: "Hackathon IA", date: "2026-05-20", lieu: "Bordeaux – Station F", participants: 80, statut: "En attente" },
  { id: 4, name: "Gala de charité", date: "2026-06-10", lieu: "Nice – Hôtel Negresco", participants: 200, statut: "Confirmé" },
  { id: 5, name: "Workshop UX Design", date: "2026-06-25", lieu: "Toulouse – Digital Campus", participants: 40, statut: "En attente" },
  { id: 6, name: "Forum de l'emploi", date: "2026-07-05", lieu: "Marseille – Parc Chanot", participants: 500, statut: "Annulé" },
  { id: 7, name: "Meetup React & TypeScript", date: "2026-07-18", lieu: "Paris – WeWork La Fayette", participants: 60, statut: "Confirmé" },
];

const mockResources = [
  { id: 1, nom: "Vidéoprojecteur HD", type: "Équipement", quantite: 5, statut: "Disponible", description: "Projecteur 4K avec connectique HDMI/USB-C" },
  { id: 2, nom: "Système de sonorisation", type: "Équipement", quantite: 3, statut: "Réservé", description: "Enceintes + micro sans fil" },
  { id: 3, nom: "Tables rondes (lot de 10)", type: "Équipement", quantite: 4, statut: "Disponible", description: "Tables pliantes 150cm de diamètre" },
  { id: 4, nom: "Chaises empilables (lot de 50)", type: "Équipement", quantite: 8, statut: "Disponible", description: "Chaises rembourrées noires" },
  { id: 5, nom: "Salle Alpha", type: "Salle", quantite: 1, statut: "Réservé", description: "Salle de réunion 20 places" },
  { id: 6, nom: "Salle Beta", type: "Salle", quantite: 1, statut: "Disponible", description: "Salle de formation 40 places" },
  { id: 7, nom: "Salle Gamma", type: "Salle", quantite: 1, statut: "En maintenance", description: "Salle de conférence 100 places" },
  { id: 8, nom: "Technicien son", type: "Personnel", quantite: 2, statut: "Disponible", description: "Ingénieur son professionnel" },
];

const mockDocuments = [
  { id: 1, nom: "Contrat_location_GrandSalon.pdf", type: "Contrat", uploadePar: "Sophie Martin", date: "2026-03-01", taille: "2.4 MB", statut: "Validé" },
  { id: 2, nom: "Devis_traiteur_gala.pdf", type: "Devis", uploadePar: "Jean Dupont", date: "2026-03-05", taille: "1.1 MB", statut: "En cours de vérification IA" },
  { id: 3, nom: "Plan_securite_forum.pdf", type: "Plan", uploadePar: "Marc Leroy", date: "2026-03-08", taille: "3.8 MB", statut: "Validé" },
  { id: 4, nom: "Assurance_evenement.pdf", type: "Assurance", uploadePar: "Claire Moreau", date: "2026-03-10", taille: "890 KB", statut: "Rejeté" },
  { id: 5, nom: "Liste_participants_hackathon.xlsx", type: "Liste", uploadePar: "Ahmed Benali", date: "2026-03-11", taille: "540 KB", statut: "En cours de vérification IA" },
  { id: 6, nom: "Budget_previsionnel_2026.pdf", type: "Budget", uploadePar: "Sophie Martin", date: "2026-03-12", taille: "1.7 MB", statut: "Validé" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
const StatusBadge = ({ statut }) => {
  const map = {
    "Confirmé":    { bg: "#dcfce7", color: "#16a34a" },
    "En attente":  { bg: "#fef9c3", color: "#ca8a04" },
    "Annulé":      { bg: "#fee2e2", color: "#dc2626" },
    "Disponible":  { bg: "#dcfce7", color: "#16a34a" },
    "Réservé":     { bg: "#fef9c3", color: "#ca8a04" },
    "En maintenance": { bg: "#fee2e2", color: "#dc2626" },
    "Validé":      { bg: "#dcfce7", color: "#16a34a" },
    "Rejeté":      { bg: "#fee2e2", color: "#dc2626" },
    "En cours de vérification IA": { bg: "#fef3c7", color: "#d97706" },
  };
  const s = map[statut] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {statut}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>{type}</span>
);

const Btn = ({ icon: Icon, color, bg, onClick }) => (
  <button onClick={onClick} style={{ background: bg, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color, display: "inline-flex", alignItems: "center" }}>
    <Icon size={14} />
  </button>
);

const TH = ({ children }) => (
  <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", fontFamily: "inherit" }}>{children}</th>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "evenements", label: "Événements", icon: Calendar },
  { id: "ressources", label: "Ressources", icon: Wrench },
  { id: "documents", label: "Documents", icon: FileText },
];

const Sidebar = ({ active, setActive, onLogout }) => (
  <aside style={{ width: 260, minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100, boxShadow: "2px 0 20px rgba(0,0,0,0.3)" }}>
    <div style={{ padding: "24px 20px", borderBottom: "1px solid #1e293b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Administrateur</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>admin@platform.com</div>
        </div>
      </div>
      <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>
        <LogOut size={16} /> Déconnexion
      </button>
    </div>
  </aside>
);

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
        <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "white", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>3</span>
      </div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#ef4444,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Shield size={16} color="white" />
      </div>
    </div>
  </div>
);

// ─── Pages ────────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const stats = [
    { label: "Événements totaux", value: "24", change: "+12%", icon: Calendar, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Ressources actives", value: "142", change: "+5%", icon: Package, color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Documents validés", value: "38", change: "+8%", icon: FileText, color: "#10b981", bg: "#ecfdf5" },
    { label: "Utilisateurs", value: "1 247", change: "+23%", icon: Users, color: "#f59e0b", bg: "#fffbeb" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#10b981", marginTop: 4, fontWeight: 600 }}>↑ {s.change} ce mois</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Événements récents</h3>
            <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600, cursor: "pointer" }}>Voir tout →</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f8fafc" }}><TH>Nom</TH><TH>Date</TH><TH>Participants</TH><TH>Statut</TH></tr></thead>
            <tbody>
              {mockEvents.slice(0, 5).map(e => (
                <tr key={e.id} style={{ borderTop: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{e.name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748b" }}>{e.date}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748b" }}>{e.participants}</td>
                  <td style={{ padding: "12px 20px" }}><StatusBadge statut={e.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", padding: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Répartition événements</h3>
            {[{ label: "Confirmé", count: 4, color: "#10b981", pct: 57 }, { label: "En attente", count: 2, color: "#f59e0b", pct: 29 }, { label: "Annulé", count: 1, color: "#ef4444", pct: 14 }].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#475569" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{s.count}</span>
                </div>
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 6 }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Actions rapides</h3>
            {[{ label: "Valider documents en attente", icon: CheckCircle, color: "#10b981" }, { label: "Vérifier ressources", icon: Package, color: "#3b82f6" }, { label: "Gérer utilisateurs", icon: Users, color: "#8b5cf6" }].map((a, i) => (
              <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 13, color: "#475569", fontFamily: "inherit", fontWeight: 500 }}>
                <a.icon size={16} color={a.color} />{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EvenementsPage = () => {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "Confirmé", "En attente", "Annulé"];
  const filtered = filter === "Tous" ? mockEvents : mockEvents.filter(e => e.statut === filter);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", background: filter === f ? "#3b82f6" : "white", color: filter === f ? "white" : "#64748b", border: filter === f ? "1px solid #3b82f6" : "1px solid #e2e8f0", fontFamily: "inherit" }}>{f}</button>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f8fafc" }}><TH>Nom</TH><TH>Date</TH><TH>Lieu</TH><TH>Participants</TH><TH>Statut</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderTop: "1px solid #f8fafc" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, color: "#0f172a", fontWeight: 500 }}>{e.name}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{e.date}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{e.lieu}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{e.participants}</td>
                <td style={{ padding: "14px 20px" }}><StatusBadge statut={e.statut} /></td>
                <td style={{ padding: "14px 20px" }}><div style={{ display: "flex", gap: 8 }}><Btn icon={Eye} color="#3b82f6" bg="#eff6ff" /><Btn icon={Trash2} color="#ef4444" bg="#fef2f2" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RessourcesPage = () => {
  const [filter, setFilter] = useState("Tous");
  const types = ["Tous", "Équipement", "Salle", "Personnel"];
  const filtered = filter === "Tous" ? mockResources : mockResources.filter(r => r.type === filter);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", background: filter === t ? "#3b82f6" : "white", color: filter === t ? "white" : "#64748b", border: filter === t ? "1px solid #3b82f6" : "1px solid #e2e8f0", fontFamily: "inherit" }}>{t}</button>
          ))}
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={16} /> Ajouter ressource
        </button>
      </div>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f8fafc" }}><TH>Nom</TH><TH>Type</TH><TH>Quantité</TH><TH>Statut</TH><TH>Description</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderTop: "1px solid #f8fafc" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, color: "#0f172a", fontWeight: 500 }}>{r.nom}</td>
                <td style={{ padding: "14px 20px" }}><TypeBadge type={r.type} /></td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: "#64748b" }}>{r.quantite}</td>
                <td style={{ padding: "14px 20px" }}><StatusBadge statut={r.statut} /></td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8", maxWidth: 200 }}>{r.description}</td>
                <td style={{ padding: "14px 20px" }}><div style={{ display: "flex", gap: 8 }}><Btn icon={Eye} color="#3b82f6" bg="#eff6ff" /><Btn icon={Trash2} color="#ef4444" bg="#fef2f2" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DocumentsPage = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#3b82f6" }}>
        <Shield size={16} />
        Les documents sont analysés automatiquement par notre <strong style={{ marginLeft: 3 }}>intelligence artificielle</strong>&nbsp;pour vérification.
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        <Upload size={16} /> Uploader un document
      </button>
    </div>
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#f8fafc" }}><TH>Nom du fichier</TH><TH>Type</TH><TH>Uploadé par</TH><TH>Date</TH><TH>Taille</TH><TH>Statut</TH><TH>Actions</TH></tr></thead>
        <tbody>
          {mockDocuments.map(d => (
            <tr key={d.id} style={{ borderTop: "1px solid #f8fafc" }}>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{d.nom}</td>
              <td style={{ padding: "14px 20px" }}><TypeBadge type={d.type} /></td>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{d.uploadePar}</td>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{d.date}</td>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8" }}>{d.taille}</td>
              <td style={{ padding: "14px 20px" }}><StatusBadge statut={d.statut} /></td>
              <td style={{ padding: "14px 20px" }}><div style={{ display: "flex", gap: 6 }}><Btn icon={Eye} color="#3b82f6" bg="#eff6ff" /><Btn icon={Download} color="#10b981" bg="#f0fdf4" /><Btn icon={Trash2} color="#ef4444" bg="#fef2f2" /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


// ─── Root ─────────────────────────────────────────────────────────────────────
const pageTitles = { dashboard: "Dashboard", evenements: "Événements", ressources: "Gestion des ressources", documents: "Documents" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pages = { dashboard: <DashboardPage />, evenements: <EvenementsPage />, ressources: <RessourcesPage />, documents: <DocumentsPage /> };

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
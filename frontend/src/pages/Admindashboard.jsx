import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, LogOut, CheckCircle, XCircle,
  Eye, Trash2, ChevronDown, Package,
  Calendar, Clock, AlertCircle, Info, X, Menu, Search,
  FileText, MapPin, Star, RefreshCw, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

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
};

const PURPLE = "#6366f1";
const GREEN  = "#10b981";
const ORANGE = "#f59e0b";
const RED    = "#ef4444";
const PINK   = "#ec4899";

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
    @keyframes toastIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes modalIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
    .adash-shimmer{background:linear-gradient(90deg,#f1f3f4 25%,#e8eaed 50%,#f1f3f4 75%);background-size:200% 100%;animation:shimmer 1.4s ease infinite}
    .adash-nav-item{display:flex;align-items:center;gap:14px;padding:10px 16px;border-radius:24px;cursor:pointer;font-size:14px;font-family:'Google Sans',sans-serif;font-weight:500;color:${C.t2};border:none;background:transparent;width:100%;text-align:left;transition:background .15s,color .15s}
    .adash-nav-item:hover{background:#f1f3f4;color:${C.t1}}
    .adash-nav-item.active{background:${C.accentBg};color:${C.accentText}}
    .adash-stat-card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:20px 24px;transition:box-shadow .2s,transform .2s;animation:fadeUp .4s ease both}
    .adash-stat-card:hover{box-shadow:0 2px 14px rgba(0,0,0,.1);transform:translateY(-2px)}
    .adash-table-row:hover td{background:#f8f9fa}
    input:focus{outline:none}
    select:focus{outline:none}
  `;
  document.head.appendChild(el);
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type="info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const remove = id => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, remove, success: m=>add(m,"success"), error: m=>add(m,"error"), info: m=>add(m,"info") };
};

const Toasts = ({ toasts, remove }) => (
  <div style={{ position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8 }}>
    {toasts.map(t => {
      const cfg = { success:{bg:C.greenBg,border:"#34a853",color:C.green}, error:{bg:C.redBg,border:"#ea4335",color:C.red}, info:{bg:C.accentBg,border:C.accent,color:C.accent} }[t.type]||{};
      return (
        <div key={t.id} style={{ display:"flex",alignItems:"center",gap:10,background:cfg.bg,border:`1px solid ${cfg.border}`,borderRadius:8,padding:"12px 16px",minWidth:280,boxShadow:"0 2px 10px rgba(0,0,0,.1)",animation:"toastIn .3s ease" }}>
          <span style={{ color:cfg.color,fontSize:13,fontWeight:500,flex:1 }}>{t.msg}</span>
          <button onClick={()=>remove(t.id)} style={{ background:"none",border:"none",cursor:"pointer",color:C.t3 }}><X size={14}/></button>
        </div>
      );
    })}
  </div>
);

const useConfirm = () => {
  const [modal, setModal] = useState(null);
  const [res, setRes] = useState(null);
  const confirm = opts => new Promise(r => { setModal(opts); setRes(()=>r); });
  const yes = () => { setModal(null); res(true); };
  const no  = () => { setModal(null); res(false); };
  return { modal, confirm, yes, no };
};

const ConfirmModal = ({ modal, yes, no }) => {
  if (!modal) return null;
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(32,33,36,.5)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:C.card,borderRadius:12,padding:32,maxWidth:400,width:"100%",boxShadow:"0 8px 30px rgba(0,0,0,.2)",animation:"modalIn .25s ease" }}>
        <h3 style={{ fontSize:18,fontWeight:500,color:C.t1,marginBottom:10,fontFamily:"'Google Sans',sans-serif" }}>{modal.title}</h3>
        <p style={{ fontSize:14,color:C.t2,lineHeight:1.6,marginBottom:28 }}>{modal.message}</p>
        <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
          <button onClick={no}  style={{ padding:"8px 20px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.accent,fontSize:14,fontWeight:500,cursor:"pointer" }}>Annuler</button>
          <button onClick={yes} style={{ padding:"8px 20px",borderRadius:6,border:"none",background:modal.type==="danger"?C.red:C.accent,color:"#fff",fontSize:14,fontWeight:500,cursor:"pointer" }}>{modal.confirmLabel||"Confirmer"}</button>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ data, title, onClose, fields }) => {
  if (!data) return null;
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(32,33,36,.5)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={onClose}>
      <div style={{ background:C.card,borderRadius:16,padding:32,maxWidth:560,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,.2)",animation:"modalIn .25s ease",maxHeight:"85vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
          <h3 style={{ fontSize:18,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background:C.bg,border:"none",cursor:"pointer",color:C.t2,borderRadius:8,padding:6,display:"flex" }}><X size={18}/></button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {fields.map(({ label, value, badge }) => (
            <div key={label} style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
              <div style={{ fontSize:12,color:C.t3,fontWeight:500,minWidth:130,paddingTop:2,textTransform:"uppercase",letterSpacing:".4px" }}>{label}</div>
              <div style={{ flex:1,fontSize:13,color:C.t1,fontWeight:500 }}>
                {badge ? <Badge statut={value}/> : (value||<span style={{ color:C.t3 }}>—</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Badge = ({ statut }) => {
  const map = {
    valide:       {bg:C.greenBg,   color:C.green,  label:"Validé"},
    en_attente:   {bg:C.orangeBg,  color:C.orange, label:"En attente"},
    "en attente": {bg:C.orangeBg,  color:C.orange, label:"En attente"},
    rejected:     {bg:C.redBg,     color:C.red,    label:"Rejeté"},
    acceptée:     {bg:C.greenBg,   color:C.green,  label:"Acceptée"},
    refusée:      {bg:C.redBg,     color:C.red,    label:"Refusée"},
    confirmé:     {bg:C.greenBg,   color:C.green,  label:"Confirmé"},
    annulé:       {bg:C.borderLight,color:C.t2,    label:"Annulé"},
    "en cours":   {bg:C.accentBg,  color:C.accent, label:"En cours"},
    terminé:      {bg:C.greenBg,   color:C.green,  label:"Terminé"},
    organisateur: {bg:C.purpleBg,  color:C.purple, label:"Organisateur"},
    prestataire:  {bg:C.accentBg,  color:C.accent, label:"Prestataire"},
    admin:        {bg:C.redBg,     color:C.red,    label:"Admin"},
    salle:        {bg:C.accentBg,  color:C.accent, label:"Salle"},
    materiel:     {bg:C.accentBg,  color:C.accent, label:"Matériel"},
    decoration:   {bg:C.purpleBg,  color:C.purple, label:"Décoration"},
    traiteur:     {bg:C.orangeBg,  color:C.orange, label:"Traiteur"},
    dj:           {bg:C.purpleBg,  color:C.purple, label:"DJ"},
    photographe:  {bg:C.purpleBg,  color:C.purple, label:"Photographe"},
    serveur:      {bg:C.orangeBg,  color:C.orange, label:"Serveur"},
    Mariage:      {bg:"#fce7f3",   color:"#be185d",label:"Mariage"},
    Conference:   {bg:C.accentBg,  color:C.accent, label:"Conférence"},
    Anniversaire: {bg:C.orangeBg,  color:C.orange, label:"Anniversaire"},
    Seminaire:    {bg:C.purpleBg,  color:C.purple, label:"Séminaire"},
    autre:        {bg:C.borderLight,color:C.t2,    label:"Autre"},
    public:       {bg:C.greenBg,   color:C.green,  label:"Public"},
    "privé":      {bg:C.orangeBg,  color:C.orange, label:"Privé"},
    CIN:          {bg:C.accentBg,  color:C.accent, label:"CIN"},
    Passport:     {bg:C.purpleBg,  color:C.purple, label:"Passeport"},
    patente:      {bg:C.orangeBg,  color:C.orange, label:"Patente"},
    Contract:     {bg:C.greenBg,   color:C.green,  label:"Contrat"},
    product:      {bg:C.accentBg,  color:C.accent, label:"Produit"},
    service:      {bg:C.purpleBg,  color:C.purple, label:"Service"},
  };
  const s = map[statut]||{bg:C.borderLight,color:C.t2,label:statut||"—"};
  return <span style={{ display:"inline-flex",alignItems:"center",background:s.bg,color:s.color,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:500 }}>{s.label}</span>;
};

const TH = ({ children }) => <th style={{ padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:500,color:C.t2,whiteSpace:"nowrap",borderBottom:`1px solid ${C.border}`,textTransform:"uppercase",letterSpacing:".5px" }}>{children}</th>;
const TD = ({ children, style }) => <td style={{ padding:"14px 16px",fontSize:13,color:C.t2,borderBottom:`1px solid ${C.borderLight}`,...style }}>{children}</td>;
const Skel = ({ w="100%", h=20, r=6 }) => <div className="adash-shimmer" style={{ width:w,height:h,borderRadius:r }}/>;
const EmptyState = ({ icon:Icon, message }) => (
  <div style={{ padding:"60px 20px",textAlign:"center",color:C.t3 }}>
    <Icon size={40} style={{ margin:"0 auto 12px",opacity:.3,display:"block" }}/>
    <div style={{ fontSize:14 }}>{message}</div>
  </div>
);

const UserAvatar = ({ user }) => {
  if (!user) return null;
  const init = `${user.firstname?.[0]||""}${user.lastname?.[0]||""}`.toUpperCase()||"?";
  const colors = [["#ede9fe","#5b21b6"],["#d1fae5","#065f46"],["#fef3c7","#92400e"],["#fee2e2","#991b1b"],["#e0f2fe","#0c4a6e"]];
  const [bg,col] = colors[(init.charCodeAt(0)||0)%colors.length];
  return <div style={{ width:36,height:36,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:col,flexShrink:0 }}>{init}</div>;
};

/* ─── SIDEBAR — sans Demandes ── */
const navItems = [
  { id:"dashboard",  label:"Dashboard",    icon:LayoutDashboard },
  { id:"gestion",    label:"Utilisateurs", icon:Users           },
  { id:"ressources", label:"Ressources",   icon:Package         },
  { id:"evenements", label:"Événements",   icon:Calendar        },
  { id:"documents",  label:"Documents",    icon:FileText        },
];

const Sidebar = ({ active, setActive, onLogout, isMobile, isMobileOpen, setIsMobileOpen }) => {
  if (isMobile && !isMobileOpen) {
    return (
      <button onClick={()=>setIsMobileOpen(true)} style={{ position:"fixed",top:16,left:16,zIndex:90,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:10,cursor:"pointer",color:C.t1,display:"flex",boxShadow:"0 1px 4px rgba(0,0,0,.1)" }}>
        <Menu size={20}/>
      </button>
    );
  }
  return (
    <>
      {isMobile&&isMobileOpen&&<div onClick={()=>setIsMobileOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.3)",zIndex:150 }}/>}
      <aside style={{ width:isMobile?"80%":256,maxWidth:isMobile?300:"none",height:"100vh",background:C.sidebar,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:200,transform:isMobile?(isMobileOpen?"translateX(0)":"translateX(-100%)"):"none",transition:"transform .25s ease",overflowY:"auto" }}>
        <div style={{ padding:"20px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <h1 style={{ fontSize:18,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>Admin Panel</h1>
            <div style={{ fontSize:11,color:C.t3,marginTop:2 }}>Gestion de la plateforme</div>
          </div>
          {isMobile&&<button onClick={()=>setIsMobileOpen(false)} style={{ background:"none",border:"none",cursor:"pointer",color:C.t2 }}><X size={18}/></button>}
        </div>
        <nav style={{ flex:1,padding:"4px 12px",display:"flex",flexDirection:"column",gap:2 }}>
          {navItems.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={()=>{ setActive(id); if(isMobile) setIsMobileOpen(false); }} className={`adash-nav-item${active===id?" active":""}`}>
              <Icon size={20} color={active===id?C.accentText:C.t2}/>{label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"12px 12px 20px",borderTop:`1px solid ${C.borderLight}` }}>
          <button onClick={onLogout} className="adash-nav-item"><LogOut size={20} color={C.t2}/> Se déconnecter</button>
        </div>
      </aside>
    </>
  );
};

const TopBar = ({ title, isMobile }) => {
  const user = JSON.parse(localStorage.getItem("user")||"{}");
  const initials = `${user.firstname?.[0]||"A"}${user.lastname?.[0]||"D"}`.toUpperCase();
  return (
    <div style={{ height:64,background:C.card,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 16px 0 60px":"0 32px",position:"sticky",top:0,zIndex:50 }}>
      <h2 style={{ fontSize:22,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",letterSpacing:"-.3px" }}>{title}</h2>
      <div style={{ width:40,height:40,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
        <span style={{ color:"#fff",fontSize:14,fontWeight:700,fontFamily:"'Google Sans',sans-serif" }}>{initials}</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DASHBOARD — sans demandes, "Voir tous" navigue
═══════════════════════════════════════════════════════════ */
const DashboardPage = ({ setActivePage }) => {
  const [stats,      setStats]      = useState(null);
  const [monthlyData,setMonthlyData]= useState({ users:[],resources:[] });
  const [events,     setEvents]     = useState([]);
  const [recentUsers,setRecentUsers]= useState([]);
  const [loading,    setLoad]       = useState(true);

  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jui","Aoû","Sep","Oct","Nov","Déc"];
  const now = new Date();
  const last6months = Array.from({length:6},(_,i)=>{
    const d = new Date(now.getFullYear(),now.getMonth()-5+i,1);
    return months[d.getMonth()].slice(0,3);
  });

  useEffect(()=>{
    const load = async()=>{
      try {
        const [sR,mR,eR,uR] = await Promise.all([
          axios.get(`${API}/admin/stats`,        {headers:authHeaders()}),
          axios.get(`${API}/admin/stats/monthly`,{headers:authHeaders()}),
          axios.get(`${API}/admin/events`,       {headers:authHeaders()}),
          axios.get(`${API}/admin/users`,        {headers:authHeaders()}),
        ]);
        setStats(sR.data);
        setMonthlyData(mR.data);
        setEvents(eR.data.filter(e=>e.dateDebut).sort((a,b)=>new Date(a.dateDebut)-new Date(b.dateDebut)).slice(0,5));
        setRecentUsers([...uR.data].sort((a,b)=>b._id.toString().localeCompare(a._id.toString())).slice(0,6));
      } catch(err){
        console.error(err);
        setStats({users:0,events:0,resources:0,pending:0});
      } finally { setLoad(false); }
    };
    load();
  },[]);

  const fillMonthly = (arr,total) =>
    Array.from({length:6},(_,i)=>{
      const d = new Date(now.getFullYear(),now.getMonth()-5+i,1);
      const f = arr?.find(x=>x._id.year===d.getFullYear()&&x._id.month===d.getMonth()+1);
      return f?.count??Math.max(1,Math.round((total/6)*(0.4+(i/5)*0.6)));
    });

  const usersChart = fillMonthly(monthlyData.users,   stats?.users??0);
  const resChart   = fillMonthly(monthlyData.resources,stats?.resources??0);
  const maxU = Math.max(...usersChart,1);
  const maxR = Math.max(...resChart,1);

  const statusColor = s => ({
    "en attente":{bg:"#fef3c7",color:"#92400e",label:"En attente"},
    "en cours":  {bg:C.accentBg,color:C.accent,label:"En cours"},
    terminé:     {bg:C.greenBg,color:C.green,label:"Terminé"},
  }[s]||{bg:"#f1f5f9",color:"#475569",label:s||"—"});

  const prestTotal   = recentUsers.filter(u=>u.role==="prestataire").length;
  const prestValides = recentUsers.filter(u=>u.role==="prestataire"&&u.status==="valide").length;
  const prestRate    = prestTotal?Math.round((prestValides/prestTotal)*100):0;

  const notifications = [
    ...recentUsers.filter(u=>u.role==="prestataire"&&u.status==="en_attente").slice(0,2).map(u=>({
      icon:"🧑‍💼",bg:"#ede9fe",title:"Nouveau prestataire",body:`${u.firstname} ${u.lastname} — en attente`,time:"Récent",unread:true,
    })),
    ...recentUsers.filter(u=>u.role==="organisateur").slice(0,2).map(u=>({
      icon:"📅",bg:"#d1fae5",title:"Nouvel organisateur",body:`${u.firstname} ${u.lastname} a rejoint`,time:"Récent",unread:false,
    })),
    ...(stats?.pending>0?[{icon:"⚠️",bg:"#fef3c7",title:"Comptes en attente",body:`${stats.pending} prestataire(s) attendent`,time:"Maintenant",unread:true}]:[]),
  ].slice(0,5);

  const cardStyle={background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"};
  const cardHead ={padding:"13px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"};
  const cardBody ={padding:"12px 16px"};
  const rowItem  =last=>({display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:last?"none":"1px solid #f1f5f9"});

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>

      {/* 4 stat cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
        {[
          {label:"Utilisateurs",val:stats?.users,    sub:`dont ${stats?.pending||0} en attente`,stripe:`linear-gradient(90deg,${PURPLE},#8b5cf6)`,iconBg:"#ede9fe",icon:<Users size={20} color={PURPLE}/>,   delta:"+18",deltaColor:GREEN },
          {label:"Événements",  val:stats?.events,   sub:"total créés",                          stripe:`linear-gradient(90deg,${GREEN},#34d399)`, iconBg:"#d1fae5",icon:<Calendar size={20} color={GREEN}/>,  delta:"+7", deltaColor:GREEN },
          {label:"En attente",  val:stats?.pending,  sub:"comptes à valider",                    stripe:`linear-gradient(90deg,${ORANGE},#fbbf24)`,iconBg:"#fef3c7",icon:<Clock size={20} color={ORANGE}/>,   delta:"!",  deltaColor:RED   },
          {label:"Ressources",  val:stats?.resources,sub:"publiées sur la plateforme",           stripe:`linear-gradient(90deg,${PURPLE},${PINK})`,iconBg:"#fce7f3",icon:<Package size={20} color={PINK}/>,   delta:"NEW",deltaColor:PURPLE},
        ].map((c,i)=>(
          <div key={i} className="adash-stat-card" style={{ position:"relative",overflow:"hidden",animationDelay:`${i*.08}s` }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:c.stripe,borderRadius:"12px 12px 0 0" }}/>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12,marginTop:6 }}>
              <div style={{ width:42,height:42,borderRadius:11,background:c.iconBg,display:"flex",alignItems:"center",justifyContent:"center" }}>{c.icon}</div>
              <span style={{ fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:7,background:c.iconBg,color:c.deltaColor }}>{c.delta}</span>
            </div>
            {loading
              ?<><Skel w="55%" h={30} r={4}/><Skel w="75%" h={12} r={4}/></>
              :<>
                <div style={{ fontSize:30,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",letterSpacing:"-1.5px",lineHeight:1 }}>{(c.val??0).toLocaleString()}</div>
                <div style={{ fontSize:12,color:C.t2,marginTop:4,fontWeight:500 }}>{c.label}</div>
                <div style={{ fontSize:10,color:C.t3,marginTop:6,paddingTop:8,borderTop:"1px solid #f1f5f9" }}>{c.sub}</div>
              </>
            }
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div style={{ display:"grid",gridTemplateColumns:"1.7fr 1fr 1fr",gap:12 }}>
        <div style={cardStyle}>
          <div style={cardHead}>
            <div>
              <div style={{ fontSize:14,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>Activité — 6 derniers mois</div>
              <div style={{ fontSize:11,color:C.t2,marginTop:2 }}>Utilisateurs et ressources</div>
            </div>
            <div style={{ display:"flex",gap:12 }}>
              {[["#6366f1","Utilisateurs"],["#10b981","Ressources"]].map(([col,lbl])=>(
                <div key={lbl} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.t2 }}>
                  <div style={{ width:8,height:8,borderRadius:2,background:col }}/>{lbl}
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardBody,paddingTop:16 }}>
            <div style={{ display:"flex",alignItems:"flex-end",gap:8,height:110 }}>
              {usersChart.map((v,i)=>(
                <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                  <div style={{ width:"100%",height:`${(v/maxU)*100}%`,background:i===5?"#4f46e5":PURPLE,borderRadius:"4px 4px 0 0",opacity:.88,minHeight:4 }}/>
                  <div style={{ width:"100%",height:`${(resChart[i]/maxR)*100}%`,background:i===5?"#059669":GREEN,borderRadius:"4px 4px 0 0",opacity:.7,minHeight:3 }}/>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:6 }}>
              {last6months.map((m,i)=><div key={i} style={{ flex:1,textAlign:"center",fontSize:10,color:C.t3 }}>{m}</div>)}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:14 }}>
              {[{val:stats?.users??0,lbl:"Total inscrits",col:PURPLE},{val:stats?.resources??0,lbl:"Ressources",col:GREEN},{val:stats?.events??0,lbl:"Événements",col:ORANGE}].map(({val,lbl,col})=>(
                <div key={lbl} style={{ background:"#f8faff",borderRadius:9,padding:"8px 10px",textAlign:"center" }}>
                  <div style={{ fontSize:20,fontWeight:700,color:col,lineHeight:1 }}>{val.toLocaleString()}</div>
                  <div style={{ fontSize:9,color:C.t3,marginTop:2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHead}><div style={{ fontSize:14,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>Types de ressources</div></div>
          <div style={{ ...cardBody,display:"flex",flexDirection:"column",alignItems:"center" }}>
            <svg viewBox="0 0 120 120" width="120" height="120" style={{ margin:"4px 0 12px" }}>
              <circle cx="60" cy="60" r="46" fill="none" stroke="#f1f5f9" strokeWidth="20"/>
              {[["Salle",PURPLE,42],["Matériel",GREEN,28],["Traiteur",ORANGE,18],["Décoration",PINK,12]].reduce((acc,[,col,pct],i,arr)=>{
                const offset=arr.slice(0,i).reduce((s,[,,p])=>s+p/100*289,0);
                const dash=pct/100*289;
                acc.push(<circle key={i} cx="60" cy="60" r="46" fill="none" stroke={col} strokeWidth="20" strokeDasharray={`${dash} ${289-dash}`} strokeDashoffset={-offset} strokeLinecap="butt"/>);
                return acc;
              },[])}
              <text x="60" y="56" textAnchor="middle" fontSize="15" fontWeight="700" fill={C.t1}>{stats?.resources??0}</text>
              <text x="60" y="68" textAnchor="middle" fontSize="8" fill={C.t3}>ressources</text>
            </svg>
            <div style={{ display:"flex",flexDirection:"column",gap:6,width:"100%" }}>
              {[["Salle",PURPLE,42],["Matériel",GREEN,28],["Traiteur",ORANGE,18],["Décoration",PINK,12]].map(([lbl,col,pct])=>(
                <div key={lbl} style={{ display:"flex",alignItems:"center",gap:8,fontSize:12 }}>
                  <div style={{ width:9,height:9,borderRadius:"50%",background:col,flexShrink:0 }}/>
                  <span style={{ flex:1,color:C.t2 }}>{lbl}</span>
                  <span style={{ fontWeight:700,color:C.t1 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHead}><div style={{ fontSize:14,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>Taux de validation</div></div>
          <div style={cardBody}>
            {[
              {lbl:"Prestataires validés",val:prestRate,col:PURPLE,grad:`linear-gradient(90deg,${PURPLE},#8b5cf6)`},
              {lbl:"Événements actifs",   val:91,       col:GREEN, grad:`linear-gradient(90deg,${GREEN},#34d399)`},
              {lbl:"Demandes traitées",   val:58,       col:ORANGE,grad:`linear-gradient(90deg,${ORANGE},#fbbf24)`},
              {lbl:"Signalements résolus",val:44,       col:PINK,  grad:`linear-gradient(90deg,${PINK},#f9a8d4)`},
            ].map(({lbl,val,col,grad})=>(
              <div key={lbl} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:11 }}>
                  <span style={{ color:C.t2 }}>{lbl}</span>
                  <span style={{ fontWeight:700,color:col }}>{Math.min(val,100)}%</span>
                </div>
                <div style={{ height:7,background:"#f1f5f9",borderRadius:4,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${Math.min(val,100)}%`,background:grad,borderRadius:4 }}/>
                </div>
              </div>
            ))}
            <div style={{ marginTop:8,padding:"10px 12px",background:"linear-gradient(135deg,#ede9fe,#fce7f3)",borderRadius:10,textAlign:"center" }}>
              <div style={{ fontSize:22,fontWeight:700,color:PURPLE }}>4.7 ★</div>
              <div style={{ fontSize:10,color:"#7c3aed",fontWeight:600,marginTop:1 }}>Score satisfaction global</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — 2 colonnes UNIQUEMENT, pas de demandes */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>

        <div style={cardStyle}>
          <div style={cardHead}>
            <div style={{ fontSize:14,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>Événements à venir</div>
            <span onClick={()=>setActivePage("evenements")}
              style={{ fontSize:11,color:PURPLE,cursor:"pointer",fontWeight:600,padding:"4px 10px",borderRadius:20,background:"#f5f3ff" }}>
              Voir tous →
            </span>
          </div>
          <div style={{ padding:"4px 16px 12px" }}>
            {loading?[1,2,3].map(i=><div key={i} style={{ padding:"10px 0" }}><Skel h={44} r={8}/></div>)
              :events.length===0?<EmptyState icon={Calendar} message="Aucun événement"/>
              :events.map((ev,i)=>{
                const d=ev.dateDebut?new Date(ev.dateDebut):null;
                const sc=statusColor(ev.status);
                return (
                  <div key={ev._id} style={rowItem(i===events.length-1)}>
                    {d&&(
                      <div style={{ minWidth:38,textAlign:"center",background:"#f5f3ff",borderRadius:8,padding:"4px 0",flexShrink:0 }}>
                        <div style={{ fontSize:17,fontWeight:700,color:PURPLE,lineHeight:1 }}>{d.getDate()}</div>
                        <div style={{ fontSize:9,color:"#7c3aed" }}>{months[d.getMonth()].slice(0,3)}</div>
                      </div>
                    )}
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:12.5,fontWeight:600,color:C.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{ev.title}</div>
                      <div style={{ fontSize:10.5,color:C.t2,marginTop:1 }}>{ev.lieu||ev.category||"—"}</div>
                    </div>
                    <span style={{ fontSize:9.5,fontWeight:700,padding:"2px 8px",borderRadius:8,background:sc.bg,color:sc.color,flexShrink:0 }}>{sc.label}</span>
                  </div>
                );
              })
            }
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHead}>
            <div style={{ fontSize:14,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif" }}>
              Notifications
              {notifications.filter(n=>n.unread).length>0&&(
                <span style={{ marginLeft:8,fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:8,background:"#fee2e2",color:"#991b1b" }}>
                  {notifications.filter(n=>n.unread).length} nouvelles
                </span>
              )}
            </div>
          </div>
          <div style={{ padding:"4px 16px 12px" }}>
            {loading?[1,2,3].map(i=><div key={i} style={{ padding:"10px 0" }}><Skel h={44} r={8}/></div>)
              :notifications.length===0?<EmptyState icon={AlertCircle} message="Aucune notification"/>
              :notifications.map((n,i)=>(
                <div key={i} style={{ ...rowItem(i===notifications.length-1),background:n.unread?"#f5f3ff":"transparent",borderRadius:n.unread?8:0,paddingLeft:n.unread?8:0,paddingRight:n.unread?8:0,marginLeft:n.unread?-8:0,marginRight:n.unread?-8:0 }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:n.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15 }}>{n.icon}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:12.5,fontWeight:600,color:C.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{n.title}</div>
                    <div style={{ fontSize:10.5,color:C.t2,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{n.body}</div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3 }}>
                    <div style={{ fontSize:9,color:C.t3 }}>{n.time}</div>
                    {n.unread&&<div style={{ width:7,height:7,borderRadius:"50%",background:PURPLE }}/>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   UTILISATEURS
═══════════════════════════════════════════════════════════ */
const ComptesPage = () => {
  const [users,setUsers]=[useState([]),[0]];
  const [_users,_setUsers]=useState([]);
  const [loading,setLoad]=useState(true);
  const [tab,setTab]=useState("tous");
  const [search,setSearch]=useState("");
  const [actionLoading,setAL]=useState(null);
  const [detail,setDetail]=useState(null);
  const toast=useToast();
  const {modal,confirm,yes,no}=useConfirm();

  const load=useCallback(async()=>{
    try{setLoad(true);const{data}=await axios.get(`${API}/admin/users`,{headers:authHeaders()});_setUsers(data);}
    catch{_setUsers([]);}finally{setLoad(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const allUsers=_users;

  const handleValidate=async(id,name)=>{
    try{setAL(id+"_v");await axios.patch(`${API}/admin/users/${id}/status`,{status:"valide"},{headers:authHeaders()});_setUsers(p=>p.map(u=>u._id===id?{...u,status:"valide"}:u));toast.success(`${name} validé`);}
    catch{toast.error("Erreur");}finally{setAL(null);}
  };
  const handleReject=async(id,name)=>{
    if(!await confirm({type:"warning",title:"Rejeter ce compte ?",message:`"${name}" ne pourra pas accéder à la plateforme.`,confirmLabel:"Rejeter"}))return;
    try{setAL(id+"_r");await axios.patch(`${API}/admin/users/${id}/status`,{status:"rejected"},{headers:authHeaders()});_setUsers(p=>p.map(u=>u._id===id?{...u,status:"rejected"}:u));toast.info(`${name} rejeté`);}
    catch{toast.error("Erreur");}finally{setAL(null);}
  };
  const handleDelete=async(id,name)=>{
    if(!await confirm({type:"danger",title:"Supprimer ce compte ?",message:`Le compte de "${name}" sera définitivement supprimé.`,confirmLabel:"Supprimer"}))return;
    try{setAL(id+"_d");await axios.delete(`${API}/admin/users/${id}`,{headers:authHeaders()});_setUsers(p=>p.filter(u=>u._id!==id));toast.success(`${name} supprimé`);}
    catch{toast.error("Erreur");}finally{setAL(null);}
  };

  const tabs=[
    {k:"tous",         l:"Tous",          count:allUsers.length},
    {k:"prestataire",  l:"Prestataires",  count:allUsers.filter(u=>u.role==="prestataire").length},
    {k:"organisateur", l:"Organisateurs", count:allUsers.filter(u=>u.role==="organisateur").length},
    {k:"en_attente",   l:"En attente",    count:allUsers.filter(u=>u.role==="prestataire"&&u.status==="en_attente").length},
  ];

  const filtered=allUsers.filter(u=>{
    const mt=tab==="tous"?true:tab==="en_attente"?(u.role==="prestataire"&&u.status==="en_attente"):u.role===tab;
    const ms=search===""||`${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return mt&&ms;
  });

  const pendingCount=allUsers.filter(u=>u.role==="prestataire"&&u.status==="en_attente").length;

  return (
    <div>
      <ConfirmModal modal={modal} yes={yes} no={no}/>
      <Toasts toasts={toast.toasts} remove={toast.remove}/>
      {detail&&<DetailModal data={detail} title={`${detail.firstname} ${detail.lastname}`} onClose={()=>setDetail(null)} fields={[
        {label:"Email",     value:detail.email},
        {label:"Rôle",      value:detail.role,  badge:true},
        {label:"Statut",    value:detail.status||"—",badge:true},
        {label:"Téléphone", value:detail.numTel},
        {label:"Région",    value:detail.region},
        {label:"Inscrit le",value:detail.createdAt?new Date(detail.createdAt).toLocaleDateString("fr-FR"):"—"},
      ]}/>}

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:22,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",margin:0 }}>Gestion des utilisateurs</h2>
          <p style={{ fontSize:13,color:C.t2,margin:"4px 0 0" }}>{allUsers.length} utilisateurs au total</p>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"8px 16px",width:240 }}>
          <Search size={14} color={C.t3}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ border:"none",background:"transparent",fontSize:13,color:C.t1,width:"100%",fontFamily:"inherit" }}/>
        </div>
      </div>

      <div style={{ display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:20 }}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{ padding:"10px 20px",border:"none",background:"transparent",cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:"'Google Sans',sans-serif",color:tab===t.k?C.accent:C.t2,borderBottom:tab===t.k?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:"-1px",display:"flex",alignItems:"center",gap:7 }}>
            {t.l}{t.count>0&&<span style={{ background:tab===t.k?C.accentBg:C.borderLight,color:tab===t.k?C.accent:C.t3,borderRadius:10,padding:"1px 8px",fontSize:12,fontWeight:600 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {pendingCount>0&&(
        <div style={{ display:"flex",alignItems:"center",gap:10,background:C.orangeBg,border:`1px solid #fbbc04`,borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:C.orange }}>
          <AlertCircle size={15}/><strong>{pendingCount} prestataire{pendingCount>1?"s":""}</strong>&nbsp;en attente de validation
        </div>
      )}

      <div style={{ background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        {loading?<div style={{padding:24}}>{[1,2,3,4,5].map(i=><div key={i} style={{marginBottom:12}}><Skel h={52} r={8}/></div>)}</div>
          :filtered.length===0?<EmptyState icon={Users} message="Aucun utilisateur trouvé"/>
          :(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                    <TH>Nom</TH><TH>Email</TH><TH>Téléphone</TH><TH>Rôle</TH><TH>Statut</TH><TH>Actions</TH>
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
                              <div style={{fontSize:12,color:C.t3}}>{u.region||"—"}</div>
                            </div>
                          </div>
                        </TD>
                        <TD>{u.email}</TD>
                        <TD>{u.numTel||"—"}</TD>
                        <TD><Badge statut={u.role}/></TD>
                        <TD>{isPrest?<Badge statut={u.status||"en_attente"}/>:<span style={{color:C.t3}}>—</span>}</TD>
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <button onClick={()=>setDetail(u)} title="Voir" style={{width:32,height:32,borderRadius:8,border:"none",background:C.accentBg,color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Eye size={15}/></button>
                            {isPrest&&u.status==="en_attente"&&<>
                              <button onClick={()=>handleValidate(u._id,name)} disabled={actionLoading===u._id+"_v"} style={{width:32,height:32,borderRadius:8,border:"none",background:C.greenBg,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><CheckCircle size={16}/></button>
                              <button onClick={()=>handleReject(u._id,name)} disabled={actionLoading===u._id+"_r"} style={{width:32,height:32,borderRadius:8,border:"none",background:C.orangeBg,color:C.orange,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><XCircle size={16}/></button>
                            </>}
                            {isPrest&&u.status==="rejected"&&(
                              <button onClick={()=>handleValidate(u._id,name)} disabled={actionLoading===u._id+"_v"} style={{width:32,height:32,borderRadius:8,border:"none",background:C.greenBg,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><CheckCircle size={16}/></button>
                            )}
                            <button onClick={()=>handleDelete(u._id,name)} disabled={actionLoading===u._id+"_d"} style={{width:32,height:32,borderRadius:8,border:"none",background:C.redBg,color:C.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Trash2 size={16}/></button>
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
   RESSOURCES
═══════════════════════════════════════════════════════════ */
const RessourcesPage = () => {
  const [resources,setResources]=useState([]);
  const [loading,setLoad]=useState(true);
  const [filter,setFilter]=useState("tous");
  const [search,setSearch]=useState("");
  const [expanded,setExpanded]=useState(null);
  const [comments,setComments]=useState({});
  const [detail,setDetail]=useState(null);
  const toast=useToast();
  const {modal,confirm,yes,no}=useConfirm();

  useEffect(()=>{
    const load=async()=>{
      try{setLoad(true);const{data}=await axios.get(`${API}/admin/resources`,{headers:authHeaders()});setResources(data);}
      catch{setResources([]);}finally{setLoad(false);}
    };load();
  },[]);

  const loadComments=async id=>{
    if(comments[id]!==undefined){setExpanded(expanded===id?null:id);return;}
    try{const{data}=await axios.get(`${API}/admin/resources/${id}/commentaires`,{headers:authHeaders()});setComments(p=>({...p,[id]:data}));setExpanded(id);}
    catch{setComments(p=>({...p,[id]:[]}));setExpanded(id);}
  };

  const handleDelete=async(id,name)=>{
    if(!await confirm({type:"danger",title:"Supprimer cette ressource ?",message:`"${name}" sera définitivement supprimée.`,confirmLabel:"Supprimer"}))return;
    try{await axios.delete(`${API}/admin/resources/${id}`,{headers:authHeaders()});setResources(p=>p.filter(r=>r._id!==id));toast.success(`"${name}" supprimée`);}
    catch{toast.error("Erreur");}
  };

  const types=["tous","salle","materiel","decoration","traiteur","dj","photographe","serveur"];
  const typeLabels={tous:"Toutes",salle:"Salle",materiel:"Matériel",decoration:"Décoration",traiteur:"Traiteur",dj:"DJ",photographe:"Photo",serveur:"Serveur"};
  const filtered=resources.filter(r=>{
    const mt=filter==="tous"||r.category===filter||r.type===filter;
    const ms=search===""||`${r.name} ${r.prestataire?.firstname} ${r.prestataire?.lastname}`.toLowerCase().includes(search.toLowerCase());
    return mt&&ms;
  });

  return (
    <div>
      <ConfirmModal modal={modal} yes={yes} no={no}/>
      <Toasts toasts={toast.toasts} remove={toast.remove}/>
      {detail&&<DetailModal data={detail} title={detail.name} onClose={()=>setDetail(null)} fields={[
        {label:"Type",       value:detail.type,    badge:true},
        {label:"Catégorie",  value:detail.category,badge:true},
        {label:"Prix",       value:`${Number(detail.price).toFixed(2)} €`},
        {label:"Stock",      value:detail.stock?.toString()},
        {label:"Description",value:detail.description},
        {label:"Prestataire",value:`${detail.prestataire?.firstname||""} ${detail.prestataire?.lastname||""}`},
        {label:"Email",      value:detail.prestataire?.email},
        {label:"Note moy.",  value:detail.averageRating?`${detail.averageRating.toFixed(1)} ★`:"—"},
      ]}/>}

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:22,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",margin:0 }}>Gestion des ressources</h2>
          <p style={{ fontSize:13,color:C.t2,margin:"4px 0 0" }}>{resources.length} ressources au total</p>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"8px 16px",width:220 }}>
          <Search size={14} color={C.t3}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ border:"none",background:"transparent",fontSize:13,color:C.t1,width:"100%",fontFamily:"inherit" }}/>
        </div>
      </div>

      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{ padding:"6px 16px",borderRadius:20,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:filter===t?C.accentBg:C.card,color:filter===t?C.accent:C.t2,border:filter===t?`1.5px solid ${C.accent}`:`1px solid ${C.border}` }}>
            {typeLabels[t]}
          </button>
        ))}
      </div>

      <div style={{ background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        {loading?<div style={{padding:24}}>{[1,2,3,4,5].map(i=><div key={i} style={{marginBottom:12}}><Skel h={52} r={8}/></div>)}</div>
          :filtered.length===0?<EmptyState icon={Package} message="Aucune ressource trouvée"/>
          :(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:860}}>
                <thead>
                  <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                    <TH>Ressource</TH><TH>Catégorie</TH><TH>Type</TH><TH>Prix</TH><TH>Prestataire</TH><TH>Note</TH><TH>Commentaires</TH><TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r=>(
                    <>
                      <tr key={r._id} className="adash-table-row">
                        <TD style={{fontWeight:600,color:C.t1,fontSize:14}}>
                          <div>{r.name}</div>
                          <div style={{fontSize:11,color:C.t3,marginTop:2}}>Stock: {r.stock??"—"}</div>
                        </TD>
                        <TD><Badge statut={r.category}/></TD>
                        <TD><Badge statut={r.type}/></TD>
                        <TD style={{fontWeight:700,color:C.purple,fontSize:14}}>{Number(r.price).toFixed(2)} €</TD>
                        <TD>
                          <div style={{fontWeight:500,color:C.t1,fontSize:13}}>{r.prestataire?.firstname} {r.prestataire?.lastname}</div>
                          <div style={{fontSize:11,color:C.t3}}>{r.prestataire?.email}</div>
                        </TD>
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <Star size={13} color="#f59e0b" fill="#f59e0b"/>
                            <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{r.averageRating?.toFixed(1)||"—"}</span>
                            <span style={{fontSize:11,color:C.t3}}>({r.totalRatings||0})</span>
                          </div>
                        </TD>
                        <TD>
                          <button onClick={()=>loadComments(r._id)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:C.accentBg,border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit"}}>
                            <Eye size={14}/>Voir<ChevronDown size={13} style={{transform:expanded===r._id?"rotate(180deg)":"none",transition:"transform .25s"}}/>
                          </button>
                        </TD>
                        <TD>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>setDetail(r)} style={{width:32,height:32,borderRadius:8,border:"none",background:C.accentBg,color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Info size={15}/></button>
                            <button onClick={()=>handleDelete(r._id,r.name)} style={{width:32,height:32,borderRadius:8,border:"none",background:C.redBg,color:C.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Trash2 size={16}/></button>
                          </div>
                        </TD>
                      </tr>
                      {expanded===r._id&&(
                        <tr key={r._id+"_exp"}>
                          <td colSpan={8} style={{padding:"0 20px 16px",background:"#f8f9ff"}}>
                            <div style={{borderRadius:10,border:`1px solid ${C.accentBg}`,overflow:"hidden",marginTop:4}}>
                              <div style={{padding:"10px 16px",background:C.accentBg,fontSize:13,fontWeight:600,color:C.accentText}}>Commentaires pour « {r.name} »</div>
                              {!comments[r._id]||comments[r._id].length===0
                                ?<div style={{padding:"16px",fontSize:13,color:C.t3}}>Aucun commentaire.</div>
                                :(
                                  <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
                                    {comments[r._id].map(c=>{
                                      const stars=c.nbr_stars||0;
                                      const user=c.C_user;
                                      const init=user?`${user.firstname?.[0]||""}${user.lastname?.[0]||""}`.toUpperCase():"?";
                                      return (
                                        <div key={c._id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}}>
                                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                                            <div style={{width:34,height:34,borderRadius:"50%",background:C.accentBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.accent,flexShrink:0}}>{init}</div>
                                            <div style={{flex:1}}>
                                              <div style={{fontWeight:600,fontSize:13,color:C.t1}}>{user?`${user.firstname} ${user.lastname}`:"Inconnu"}</div>
                                              <div style={{fontSize:11,color:C.t3}}>{user?.email}</div>
                                            </div>
                                            <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:16,color:s<=stars?"#f59e0b":"#e8eaed"}}>&#9733;</span>)}</div>
                                            <div style={{fontSize:11,color:C.t3}}>{new Date(c.createdAt).toLocaleDateString("fr-FR")}</div>
                                          </div>
                                          <p style={{fontSize:13,color:C.t2,margin:0,lineHeight:1.5}}>{c.contenue}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )
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
          )
        }
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ÉVÉNEMENTS — colonnes: Événement(+statut badge), Catégorie, Type, Dates, Lieu, Actions
   Supprimé: colonne Participants, colonne Statut dropdown
═══════════════════════════════════════════════════════════ */
const EvenementsPage = () => {
  const [events,setEvents]=useState([]);
  const [loading,setLoad]=useState(true);
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("tous");
  const [categoryFilter,setCategoryFilter]=useState("tous");
  const [detail,setDetail]=useState(null);
  const toast=useToast();
  const {modal,confirm,yes,no}=useConfirm();

  const load=useCallback(async()=>{
    try{setLoad(true);const{data}=await axios.get(`${API}/admin/events`,{headers:authHeaders()});setEvents(data);}
    catch{setEvents([]);}finally{setLoad(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const handleDelete=async(id,title)=>{
    if(!await confirm({type:"danger",title:"Supprimer cet événement ?",message:`"${title}" sera définitivement supprimé.`,confirmLabel:"Supprimer"}))return;
    try{await axios.delete(`${API}/admin/events/${id}`,{headers:authHeaders()});setEvents(p=>p.filter(e=>e._id!==id));toast.success(`"${title}" supprimé`);}
    catch{toast.error("Erreur");}
  };

  const statuses=["tous","en attente","en cours","terminé"];
  const categories=["tous","Mariage","Conference","Anniversaire","Seminaire","autre"];
  const counts={"en attente":0,"en cours":0,terminé:0};
  events.forEach(e=>{if(counts[e.status]!==undefined)counts[e.status]++;});

  const filtered=events.filter(e=>{
    const ms=search===""||`${e.title} ${e.lieu} ${e.category}`.toLowerCase().includes(search.toLowerCase());
    const mst=statusFilter==="tous"||e.status===statusFilter;
    const mc=categoryFilter==="tous"||e.category===categoryFilter;
    return ms&&mst&&mc;
  });

  return (
    <div>
      <ConfirmModal modal={modal} yes={yes} no={no}/>
      <Toasts toasts={toast.toasts} remove={toast.remove}/>
      {detail&&<DetailModal data={detail} title={detail.title} onClose={()=>setDetail(null)} fields={[
        {label:"Catégorie",   value:detail.category,badge:true},
        {label:"Type",        value:detail.type,    badge:true},
        {label:"Statut",      value:detail.status,  badge:true},
        {label:"Lieu",        value:detail.lieu},
        {label:"Date début",  value:detail.dateDebut?new Date(detail.dateDebut).toLocaleDateString("fr-FR"):"—"},
        {label:"Date fin",    value:detail.dateFin?new Date(detail.dateFin).toLocaleDateString("fr-FR"):"—"},
        {label:"Participants",value:detail.nombreParticipants?.toString()},
        {label:"Description", value:detail.description},
        {label:"Ressources",  value:detail.ressources_utiliser?.length?`${detail.ressources_utiliser.length} ressource(s)`:"Aucune"},
      ]}/>}

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:22,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",margin:0 }}>Gestion des événements</h2>
          <p style={{ fontSize:13,color:C.t2,margin:"4px 0 0" }}>{events.length} événements au total</p>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"8px 16px",width:240 }}>
          <Search size={14} color={C.t3}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ border:"none",background:"transparent",fontSize:13,color:C.t1,width:"100%",fontFamily:"inherit" }}/>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20 }}>
        {[
          {label:"En attente",count:counts["en attente"],bg:"#fef3c7",color:"#92400e",icon:<Clock size={18} color="#92400e"/>},
          {label:"En cours",  count:counts["en cours"],  bg:C.accentBg,color:C.accent,icon:<TrendingUp size={18} color={C.accent}/>},
          {label:"Terminés",  count:counts["terminé"],   bg:C.greenBg, color:C.green, icon:<CheckCircle size={18} color={C.green}/>},
        ].map(({label,count,bg,color,icon})=>(
          <div key={label} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:16 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center" }}>{icon}</div>
            <div>
              <div style={{ fontSize:24,fontWeight:700,color:C.t1,lineHeight:1 }}>{count}</div>
              <div style={{ fontSize:12,color:C.t2,marginTop:3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex",gap:12,marginBottom:20,flexWrap:"wrap" }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          <span style={{ fontSize:12,color:C.t3,alignSelf:"center",marginRight:4 }}>Statut:</span>
          {statuses.map(s=>(
            <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:statusFilter===s?C.accentBg:C.card,color:statusFilter===s?C.accent:C.t2,border:statusFilter===s?`1.5px solid ${C.accent}`:`1px solid ${C.border}` }}>
              {s==="tous"?"Tous":s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          <span style={{ fontSize:12,color:C.t3,alignSelf:"center",marginRight:4 }}>Catégorie:</span>
          {categories.map(c=>(
            <button key={c} onClick={()=>setCategoryFilter(c)} style={{ padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:categoryFilter===c?"#f3e8ff":C.card,color:categoryFilter===c?C.purple:C.t2,border:categoryFilter===c?`1.5px solid ${C.purple}`:`1px solid ${C.border}` }}>
              {c==="tous"?"Toutes":c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        {loading?<div style={{padding:24}}>{[1,2,3,4,5].map(i=><div key={i} style={{marginBottom:12}}><Skel h={52} r={8}/></div>)}</div>
          :filtered.length===0?<EmptyState icon={Calendar} message="Aucun événement trouvé"/>
          :(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:650}}>
                <thead>
                  <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                    <TH>Événement</TH><TH>Catégorie</TH><TH>Type</TH><TH>Dates</TH><TH>Lieu</TH><TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ev=>(
                    <tr key={ev._id} className="adash-table-row">
                      <TD>
                        <div style={{fontWeight:600,color:C.t1,fontSize:14}}>{ev.title}</div>
                        <div style={{marginTop:4}}><Badge statut={ev.status}/></div>
                      </TD>
                      <TD><Badge statut={ev.category}/></TD>
                      <TD><Badge statut={ev.type}/></TD>
                      <TD>
                        <div style={{fontSize:12,color:C.t1}}>{ev.dateDebut?new Date(ev.dateDebut).toLocaleDateString("fr-FR"):"—"}</div>
                        <div style={{fontSize:11,color:C.t3}}>{ev.dateFin?`→ ${new Date(ev.dateFin).toLocaleDateString("fr-FR")}`:""}</div>
                      </TD>
                      <TD>
                        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.t2}}>
                          <MapPin size={13} color={C.t3}/>{ev.lieu||"—"}
                        </div>
                      </TD>
                      <TD>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>setDetail(ev)} style={{width:32,height:32,borderRadius:8,border:"none",background:C.accentBg,color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Eye size={15}/></button>
                          <button onClick={()=>handleDelete(ev._id,ev.title)} style={{width:32,height:32,borderRadius:8,border:"none",background:C.redBg,color:C.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Trash2 size={16}/></button>
                        </div>
                      </TD>
                    </tr>
                  ))}
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
   DOCUMENTS — endpoint /documents/admin/all, types: CIN|Passport|Contract|patente
═══════════════════════════════════════════════════════════ */
const DocumentsPage = () => {
  const [documents,setDocuments]=useState([]);
  const [loading,setLoad]=useState(true);
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("tous");
  const [detail,setDetail]=useState(null);
  const toast=useToast();
  const {modal,confirm,yes,no}=useConfirm();

  const load=useCallback(async()=>{
    try{
      setLoad(true);
      const{data}=await axios.get(`${API}/documents/admin/all`,{headers:authHeaders()});
      setDocuments(Array.isArray(data)?data:data.data||[]);
    }catch(e){
      console.error("Documents error:",e?.response?.data||e.message);
      setDocuments([]);
    }finally{setLoad(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const handleDelete=async(id,title)=>{
    if(!await confirm({type:"danger",title:"Supprimer ce document ?",message:`"${title}" sera définitivement supprimé.`,confirmLabel:"Supprimer"}))return;
    try{await axios.delete(`${API}/documents/${id}`,{headers:authHeaders()});setDocuments(p=>p.filter(d=>d._id!==id));toast.success("Document supprimé");}
    catch{toast.error("Erreur");}
  };

  const docTypes=["tous","CIN","Passport","Contract","patente"];
  const typeCounts={CIN:0,Passport:0,Contract:0,patente:0};
  documents.forEach(d=>{if(typeCounts[d.documentType]!==undefined)typeCounts[d.documentType]++;});

  const filtered=documents.filter(d=>{
    const ms=search===""||`${d.title} ${d.user?.firstname} ${d.user?.lastname} ${d.user?.email}`.toLowerCase().includes(search.toLowerCase());
    const mt=typeFilter==="tous"||d.documentType===typeFilter;
    return ms&&mt;
  });

  const docIcon =t=>({CIN:"🪪",Passport:"📘",Contract:"📄",patente:"📋"}[t]||"📁");
  const docColor=t=>({
    CIN:    {bg:C.accentBg,col:C.accent},
    Passport:{bg:C.purpleBg,col:C.purple},
    Contract:{bg:C.greenBg, col:C.green},
    patente: {bg:C.orangeBg,col:C.orange},
  }[t]||{bg:C.borderLight,col:C.t2});

  return (
    <div>
      <ConfirmModal modal={modal} yes={yes} no={no}/>
      <Toasts toasts={toast.toasts} remove={toast.remove}/>
      {detail&&<DetailModal data={detail} title={detail.title} onClose={()=>setDetail(null)} fields={[
        {label:"Type",       value:detail.documentType,badge:true},
        {label:"Utilisateur",value:`${detail.user?.firstname||""} ${detail.user?.lastname||""}`},
        {label:"Email",      value:detail.user?.email},
        {label:"Rôle",       value:detail.user?.role,badge:true},
        {label:"Fichier",    value:detail.fileUrl},
        {label:"Ressources", value:detail.resource?.length?`${detail.resource.length} ressource(s)`:"Aucune"},
        {label:"Créé le",    value:detail.createdAt?new Date(detail.createdAt).toLocaleDateString("fr-FR"):"—"},
      ]}/>}

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:22,fontWeight:700,color:C.t1,fontFamily:"'Google Sans',sans-serif",margin:0 }}>Gestion des documents</h2>
          <p style={{ fontSize:13,color:C.t2,margin:"4px 0 0" }}>{documents.length} documents au total</p>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:20,border:`1px solid ${C.border}`,background:C.card,color:C.t2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            <RefreshCw size={14}/>Actualiser
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"8px 16px",width:220 }}>
            <Search size={14} color={C.t3}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ border:"none",background:"transparent",fontSize:13,color:C.t1,width:"100%",fontFamily:"inherit" }}/>
          </div>
        </div>
      </div>

      {/* Stats cards cliquables */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
        {docTypes.filter(t=>t!=="tous").map(type=>{
          const {bg,col}=docColor(type);
          return (
            <div key={type} onClick={()=>setTypeFilter(typeFilter===type?"tous":type)}
              style={{ background:C.card,border:`1px solid ${typeFilter===type?col:C.border}`,borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all .15s",boxShadow:typeFilter===type?"0 0 0 2px "+col+"33":"none" }}>
              <div style={{ width:40,height:40,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{docIcon(type)}</div>
              <div>
                <div style={{ fontSize:22,fontWeight:700,color:col,lineHeight:1 }}>{typeCounts[type]}</div>
                <div style={{ fontSize:11,color:C.t2,marginTop:2 }}>{type==="patente"?"Patentes":type==="Passport"?"Passeports":type==="Contract"?"Contrats":type}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex",gap:8,marginBottom:20 }}>
        {docTypes.map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)} style={{ padding:"6px 16px",borderRadius:20,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:typeFilter===t?C.accentBg:C.card,color:typeFilter===t?C.accent:C.t2,border:typeFilter===t?`1.5px solid ${C.accent}`:`1px solid ${C.border}` }}>
            {t==="tous"?"Tous":t} {t!=="tous"&&`(${typeCounts[t]})`}
          </button>
        ))}
      </div>

      <div style={{ background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        {loading?<div style={{padding:24}}>{[1,2,3,4].map(i=><div key={i} style={{marginBottom:12}}><Skel h={56} r={8}/></div>)}</div>
          :filtered.length===0?<EmptyState icon={FileText} message="Aucun document trouvé"/>
          :(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:780}}>
                <thead>
                  <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                    <TH>Document</TH><TH>Type</TH><TH>Utilisateur</TH><TH>Rôle</TH><TH>Ressources</TH><TH>Créé le</TH><TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d=>{
                    const {bg,col}=docColor(d.documentType);
                    return (
                      <tr key={d._id} className="adash-table-row">
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:40,height:40,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{docIcon(d.documentType)}</div>
                            <div>
                              <div style={{fontWeight:600,color:C.t1,fontSize:13}}>{d.title}</div>
                              <div style={{fontSize:11,color:C.t3,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.fileUrl||"—"}</div>
                            </div>
                          </div>
                        </TD>
                        <TD><Badge statut={d.documentType}/></TD>
                        <TD>
                          {d.user
                            ?<div style={{display:"flex",alignItems:"center",gap:8}}>
                               <UserAvatar user={d.user}/>
                               <div>
                                 <div style={{fontSize:13,fontWeight:500,color:C.t1}}>{d.user.firstname} {d.user.lastname}</div>
                                 <div style={{fontSize:11,color:C.t3}}>{d.user.email}</div>
                               </div>
                             </div>
                            :<span style={{color:C.t3}}>—</span>
                          }
                        </TD>
                        <TD>{d.user?.role?<Badge statut={d.user.role}/>:<span style={{color:C.t3}}>—</span>}</TD>
                        <TD>
                          <span style={{fontSize:12,color:C.t2,background:C.borderLight,padding:"2px 8px",borderRadius:10}}>
                            {d.resource?.length?`${d.resource.length} ressource(s)`:"Aucune"}
                          </span>
                        </TD>
                        <TD style={{fontSize:12,color:C.t2}}>{d.createdAt?new Date(d.createdAt).toLocaleDateString("fr-FR"):"—"}</TD>
                        <TD>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>setDetail(d)} style={{width:32,height:32,borderRadius:8,border:"none",background:C.accentBg,color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Eye size={15}/></button>
                            {d.fileUrl&&(
                              <a href={`http://localhost:5000/${d.fileUrl.replace(/^\//,"")}`} target="_blank" rel="noreferrer"
                                style={{width:32,height:32,borderRadius:8,border:"none",background:C.greenBg,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                                <FileText size={15}/>
                              </a>
                            )}
                            <button onClick={()=>handleDelete(d._id,d.title)} style={{width:32,height:32,borderRadius:8,border:"none",background:C.redBg,color:C.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Trash2 size={16}/></button>
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
   ROOT
═══════════════════════════════════════════════════════════ */
const pageTitles = {
  dashboard: "Dashboard", gestion:"Utilisateurs",
  ressources:"Ressources", evenements:"Événements", documents:"Documents",
};

export default function AdminDashboard() {
  useEffect(()=>{ injectStyles(); },[]);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(()=>{
    const h=()=>{ setWindowWidth(window.innerWidth); if(window.innerWidth>768)setIsMobileOpen(false); };
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  const isMobile = windowWidth<=768;
  const handleLogout = ()=>{ localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };

  const pages = {
    dashboard:  <DashboardPage setActivePage={setActivePage}/>,
    gestion:    <ComptesPage/>,
    ressources: <RessourcesPage/>,
    evenements: <EvenementsPage/>,
    documents:  <DocumentsPage/>,
  };

  return (
    <div style={{ fontFamily:"Roboto,sans-serif",background:C.bg,minHeight:"100vh" }}>
      <Sidebar active={activePage} setActive={setActivePage} onLogout={handleLogout} isMobile={isMobile} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      <div style={{ marginLeft:isMobile?0:256,transition:"margin-left .25s ease" }}>
        <TopBar title={pageTitles[activePage]||""} isMobile={isMobile}/>
        <main style={{ padding:isMobile?16:28 }}>
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}
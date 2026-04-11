import { useState, useEffect, useRef } from "react";
import { Search, Filter, Sparkles, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon, ArrowUpDown, ShoppingCart, X, Send } from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import BookingModal from "../components/BookingModal";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecommendationCard from "../components/RecommendationCard";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import AuthModal from "../components/AuthModal"; 

const categoryGroups = [
  { label: "Salle", value: "salle", subCategories: null },
  { label: "Décoration", value: "decoration", subCategories: null },
  { label: "Matériel", value: "materiel", subCategories: null },
  {
    label: "Personnel", value: "personnel",
    subCategories: [
      { label: "Traiteur", value: "traiteur" },
      { label: "DJ", value: "dj" },
      { label: "Photographe", value: "photographe" },
      { label: "Serveur", value: "serveur" },
    ],
  }
];

const sortOptions = [
  { label: "Par défaut", value: "" },
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Nom A → Z", value: "name_asc" },
  { label: "Nom Z → A", value: "name_desc" },
  { label: "Date récente", value: "date_desc" },
  { label: "Date ancienne", value: "date_asc" },
];

<<<<<<< HEAD
// ─── Lecture cart depuis localStorage ─────────────────────────────────────────
const readCart = () => {
  try { return JSON.parse(localStorage.getItem("reservationCart") || "[]"); }
  catch { return []; }
};

/* ─────────────────────────────────────────────────
   CART SIDEBAR
───────────────────────────────────────────────── */
function CartSidebar({ isOpen, onClose, cartItems, onRemove, onSendClick }) {
  const total = cartItems.reduce((s, i) => s + (i.totalPrice || i.price), 0);
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl"
        style={{
          width: 340, background: "#fff",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          borderLeft: "0.5px solid #e5e7eb",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-indigo-600" />
            <span className="font-bold text-gray-900">Mon panier</span>
            {cartItems.length > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartItems.length}</span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Votre panier est vide</p>
              <p className="text-xs mt-1 text-gray-300">Ajoutez des ressources pour commencer</p>
            </div>
          ) : cartItems.map((item) => (
            <div key={item.resourceId} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={item.type === "product" ? { background: "#DCFCE7", color: "#166534" } : { background: "#EDE9FE", color: "#5B21B6" }}>
                    {item.type === "product" ? "Produit" : "Service"}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{item.resourceName}</span>
                </div>
                {item.selectedDate && (
                  <p className="text-[10px] text-gray-400">
                    {new Date(item.selectedDate).toLocaleDateString("fr-FR")}
                    {item.selectedTimes?.length > 0 && ` · ${item.selectedTimes.length} créneau(x)`}
                  </p>
                )}
                <p className="text-xs font-bold text-indigo-600 mt-1">{item.totalPrice || item.price}€</p>
              </div>
              <button onClick={() => onRemove(item.resourceId)} className="p-1 text-gray-300 hover:text-rose-500 transition flex-shrink-0">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-gray-900">
              <span>Total estimé</span>
              <span className="text-indigo-600">{total}€</span>
            </div>
            <button onClick={onSendClick}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)" }}>
              <Send size={14} /> Envoyer les demandes
            </button>
            <p className="text-[10px] text-gray-400 text-center">Connexion requise pour envoyer</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────
   CATEGORY DROPDOWN
───────────────────────────────────────────────── */
=======
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const getLabel = () => {
    for (const g of categoryGroups) {
      if (!g.subCategories && g.value === value) return g.label;
      if (g.subCategories) { const sub = g.subCategories.find(s => s.value === value); if (sub) return `${g.label} › ${sub.label}`; }
    }
    return "Toutes les catégories";
  };
  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-left text-sm hover:border-blue-300 transition-colors">
        <span className={value ? "text-blue-600 font-medium" : "text-gray-500"}>{getLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[210px] py-1">
          <div className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            onClick={() => { onChange(""); setOpen(false); }}>Toutes les catégories</div>
          <div className="border-t border-gray-100 my-1" />
<<<<<<< HEAD
          {categoryGroups.map(group => (
            <div key={group.value} className="relative"
              onMouseEnter={() => setHoveredGroup(group.value)} onMouseLeave={() => setHoveredGroup(null)}>
              <div className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer flex justify-between items-center"
                onClick={() => { if (!group.subCategories) { onChange(group.value); setOpen(false); } }}>
=======
          {categoryGroups.map((group) => (
            <div
              key={group.value}
              className="relative"
              onMouseEnter={() => setHoveredGroup(group.value)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <div
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer flex justify-between items-center transition-colors"
                onClick={() => {
                  if (!group.subCategories) { onChange(group.value); setOpen(false); }
                }}
              >
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
                <span>{group.label}</span>
                {group.subCategories && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
              </div>
              {group.subCategories && hoveredGroup === group.value && (
                <div className="absolute left-full top-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[180px] py-1">
                  {group.subCategories.map(sub => (
                    <div key={sub.value} className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => { onChange(sub.value); setOpen(false); }}>{sub.label}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
/* ─────────────────────────────────────────────────
   SORT DROPDOWN
───────────────────────────────────────────────── */
=======
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const currentLabel = sortOptions.find(o => o.value === value)?.label || "Trier par";
  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">Trier par</label>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-left text-sm hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span className={value ? "text-blue-600 font-medium" : "text-gray-500"}>{currentLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[200px] py-1">
<<<<<<< HEAD
          {sortOptions.map(opt => (
            <div key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between ${value === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}>
              {opt.label}
              {value === opt.value && <span className="w-2 h-2 rounded-full bg-blue-600" />}
=======
          {sortOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                ${value === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {value === opt.value && <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />}
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
/* ─────────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────────── */
=======
// ─── Spinner réutilisable ──────────────────────────────────────────────────────
function Spinner({ size = "md", color = "blue" }) {
  const sizes = { sm: "w-5 h-5 border-2", md: "w-8 h-8 border-3", lg: "w-12 h-12 border-4" };
  const colors = { blue: "border-blue-600", purple: "border-purple-600", white: "border-white" };
  return (
    <div className={`${sizes[size]} ${colors[color]} border-t-transparent rounded-full animate-spin inline-block`} />
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
export default function OrganizerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.eventId;

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true); // ← spinner recommandations
  const [likedResources, setLikedResources] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
<<<<<<< HEAD
  const itemsPerPage = 10;

  /* ── Cart state ── */
  const [cartItems, setCartItems] = useState(() => readCart()); // ← init immédiate!
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  /* ══════════════════════════════════════════════════════
     SYNC CART — poll toutes les 600ms + focus + storage
     Garantit que le bouton reflète toujours localStorage
     même quand ResourceCard écrit sans passer par ce state
  ══════════════════════════════════════════════════════ */
  useEffect(() => {
    const sync = () => {
      const fresh = readCart();
      setCartItems(prev =>
        JSON.stringify(prev) === JSON.stringify(fresh) ? prev : fresh
      );
    };

    const interval = setInterval(sync, 600);
    window.addEventListener("storage", sync);  // autre onglet
    window.addEventListener("focus", sync);    // retour depuis autre page

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
=======
  const [showFilter, setShowFilter] = useState(true);
  const itemsPerPage = 12;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id || null;

  // ── Likes depuis localStorage ──
  useEffect(() => {
    const adore = JSON.parse(localStorage.getItem("adore")) || [];
    setLikedResources(adore);
  }, []);

  // ── Hide/show filter on scroll ──
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setShowFilter(window.scrollY <= lastScrollY);
      lastScrollY = window.scrollY;
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
    };
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    setLikedResources(JSON.parse(localStorage.getItem("adore") || "[]"));
  }, []);

  const removeFromCart = (resourceId) => {
    const updated = cartItems.filter(i => i.resourceId !== resourceId);
    localStorage.setItem("reservationCart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const cartTotal = cartItems.reduce((s, i) => s + (i.totalPrice || i.price), 0);

  const handleSendClick = () => {
    const tok = localStorage.getItem("token");
    if (!tok) { setAuthModalOpen(true); return; }
    setSidebarOpen(false);
    navigate("/mes-reservations");
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setSidebarOpen(false);
    navigate("/mes-reservations");
  };

  /* ── Données ── */
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id || null;

  useEffect(() => {
    (async () => {
      try {
        let url = "http://localhost:5000/api/recommendations";
        if (userId && eventId) url += `/${userId}/${eventId}`;
        else if (userId) url += `/${userId}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error();
        const result = await r.json();
        setRecommendedResources(result.data || []);
      } catch { setRecommendedResources([]); }
    })();
  }, [userId, eventId]);

  useEffect(() => { loadResources(); }, []);
  useEffect(() => { filterAndSort(); }, [resources, searchTerm, selectedSubCategory, maxPrice, sortBy]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedSubCategory, maxPrice, sortBy]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const r = await fetch("http://localhost:5000/api/ressources/get_all_ressources");
      if (!r.ok) throw new Error();
      setResources(await r.json());
    } catch { } finally { setLoading(false); }
  };

  const handleLikeUpdate = (id, liked) =>
    setLikedResources(p => liked ? [...p, id] : p.filter(x => x !== id));

  const filterAndSort = () => {
    let f = [...resources];
=======
  // ── CAS 1 & 2 : Recommandations générales ──
  useEffect(() => {
    // Si eventId présent → le CAS 3 prendra le relais
    if (eventId) return;

    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/recommendations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!response.ok) throw new Error("Erreur chargement recommandations");
        const result = await response.json();
        setRecommendedResources(result.data || []);
      } catch (error) {
        console.error("Erreur recommandations :", error);
        setRecommendedResources([]);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [userId, eventId]);

  // ── CAS 3 : Recommandations selon l'événement ──
  useEffect(() => {
    if (!eventId) return;

    const fetchEventRecommendations = async () => {
      setLoadingRecs(true);
      try {
        const token = localStorage.getItem("token");
        const eventData = location.state?.eventData || { category: location.state?.eventCategory };
        if (!eventData?.category) return;

        const response = await fetch("http://localhost:5000/api/recommendations/event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) throw new Error("Erreur recommandations événement");
        const result = await response.json();
        setRecommendedResources(result.data?.flat || []);
      } catch (error) {
        console.error("Erreur recommandations événement :", error);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchEventRecommendations();
  }, [eventId]);

  // ── Chargement de toutes les ressources ──
  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/ressources/get_all_ressources");
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  // ── Filtrage & tri ──
  useEffect(() => {
    let filtered = [...resources];
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(r =>
        r.name?.toLowerCase().includes(t) ||
        r.description?.toLowerCase().includes(t) ||
        r.location?.toLowerCase().includes(t) ||
        r.provider_name?.toLowerCase().includes(t)
      );
    }
<<<<<<< HEAD
    if (selectedSubCategory) f = f.filter(r => r.category === selectedSubCategory);
    if (maxPrice) f = f.filter(r => r.price <= parseFloat(maxPrice));
    switch (sortBy) {
      case "price_asc":  f.sort((a, b) => (a.price||0)-(b.price||0)); break;
      case "price_desc": f.sort((a, b) => (b.price||0)-(a.price||0)); break;
      case "name_asc":   f.sort((a, b) => (a.name||"").localeCompare(b.name||"")); break;
      case "name_desc":  f.sort((a, b) => (b.name||"").localeCompare(a.name||"")); break;
      case "date_desc":  f.sort((a, b) => new Date(b.createdAt||0)-new Date(a.createdAt||0)); break;
      case "date_asc":   f.sort((a, b) => new Date(a.createdAt||0)-new Date(b.createdAt||0)); break;
    }
    setFilteredResources(f);
  };

=======
    if (selectedSubCategory) filtered = filtered.filter((r) => r.category === selectedSubCategory);
    if (maxPrice) filtered = filtered.filter((r) => r.price <= parseFloat(maxPrice));

    switch (sortBy) {
      case "price_asc": filtered.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price_desc": filtered.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "name_asc": filtered.sort((a, b) => (a.name || "").localeCompare(b.name || "")); break;
      case "name_desc": filtered.sort((a, b) => (b.name || "").localeCompare(a.name || "")); break;
      case "date_desc": filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
      case "date_asc": filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)); break;
      default: break;
    }
    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedSubCategory, maxPrice, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedSubCategory, maxPrice, sortBy]);

  const handleLikeUpdate = (resourceId, isLiked) => {
    setLikedResources((prev) =>
      isLiked ? [...prev, resourceId] : prev.filter((id) => id !== resourceId)
    );
  };

  // ── Pagination ──
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentResources = filteredResources.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const getPageNums = () => Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i+1;
    if (currentPage <= 3) return i+1;
    if (currentPage >= totalPages-2) return totalPages-4+i;
    return currentPage-2+i;
  });

<<<<<<< HEAD
  const PaginationControls = () => (
    <div className="flex items-center gap-1.5">
      <button onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}
        className={`p-1.5 rounded-lg border transition-all ${currentPage===1 ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"}`}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPageNums().map(n => (
        <button key={n} onClick={() => goToPage(n)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage===n ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50"}`}>
          {n}
        </button>
      ))}
      <button onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}
        className={`p-1.5 rounded-lg border transition-all ${currentPage===totalPages ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"}`}>
=======
  const getPageNumbers = () => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      if (totalPages <= 5) return i + 1;
      if (currentPage <= 3) return i + 1;
      if (currentPage >= totalPages - 2) return totalPages - 4 + i;
      return currentPage - 2 + i;
    });
  };

  const PaginationControls = () => (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1.5 rounded-lg border transition-all ${currentPage === 1
          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50"}`}
        >
          {pageNum}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1.5 rounded-lg border transition-all ${currentPage === totalPages
          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"}`}
      >
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  // ── Titre & message bannière dynamiques selon le cas ──
  const getBannerContent = () => {
    if (eventId) return {
      title: "🎯 Ressources pour votre événement",
      subtitle: "Sélection personnalisée selon les caractéristiques de votre événement",
      gradient: "from-purple-600 to-pink-600",
    };
    if (userId) return {
      title: "✨ Bienvenue, nous sommes toujours là pour vous !",
      subtitle: "Vos recommandations personnalisées sont prêtes selon vos préférences",
      gradient: "from-blue-600 to-purple-600",
    };
    return {
      title: "✨ Organisez l'événement inoubliable",
      subtitle: "Des centaines de ressources à portée de main, filtrées selon vos besoins",
      gradient: "from-blue-600 to-purple-600",
    };
  };

  const banner = getBannerContent();

  // ── Titre section recommandations dynamique ──
  const getRecsTitle = () => {
    if (eventId) return "🎯 Ressources pour votre événement";
    if (userId) return "✨ Nous sommes toujours là pour vous";
    return "🔥 Les plus populaires";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
<<<<<<< HEAD

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} pendingItem={null} onAuthSuccess={handleAuthSuccess} />
      <CartSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} cartItems={cartItems} onRemove={removeFromCart} onSendClick={handleSendClick} />

      <div className="pt-28 pb-10 px-4 max-w-7xl mx-auto">

        {/* Bannière */}
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">✨ Organisez l'événement inoubliable</h2>
              <p className="text-blue-100">Des centaines de ressources à portée de main, filtrées selon vos besoins</p>
=======
      <div className="pt-28 pb-10 px-4 max-w-7xl mx-auto">

        {/* ── Bannière dynamique ── */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.gradient} p-8 text-white shadow-xl`}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
              <p className="text-white/80 mb-4">{banner.subtitle}</p>
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          </motion.div>
        </div>

<<<<<<< HEAD
        {/* ════ FILTRES + BOUTON PANIER ════ */}
=======
        {/* ── Filtres ── */}
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
        <motion.div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">Recherche & Filtres</h2>
            </div>

            {/* ══ BOUTON PANIER — TOUJOURS VISIBLE ══ */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm transition-all text-sm font-medium text-gray-800"
            >
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
              <span>Panier</span>
              {cartItems.length > 0 ? (
                <>
                  <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-none">
                    {cartItems.length}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-indigo-600 font-bold text-sm">{cartTotal}€</span>
                </>
              ) : (
                <span className="text-gray-400 text-xs">vide</span>
              )}
            </button>
          </div>
<<<<<<< HEAD

=======
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher une ressource</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Nom, lieu, prestataire..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm hover:border-blue-300 transition-colors" />
              </div>
            </div>
            <div><CategoryDropdown value={selectedSubCategory} onChange={setSelectedSubCategory} /></div>
            <div>
<<<<<<< HEAD
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget max (€)</label>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" placeholder="Ex: 500"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm hover:border-blue-300 transition-colors" />
            </div>
            <div><SortDropdown value={sortBy} onChange={setSortBy} /></div>
          </div>

          {(searchTerm || selectedSubCategory || maxPrice || sortBy) && (
            <div className="flex justify-end mt-4">
              <button onClick={() => { setSearchTerm(""); setSelectedSubCategory(""); setMaxPrice(""); setSortBy(""); }}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
=======
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget max (DT)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                placeholder="Ex: 500"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm hover:border-blue-300 transition-colors"
              />
            </div>
            <div><SortDropdown value={sortBy} onChange={setSortBy} /></div>
          </div>
          {(searchTerm || selectedSubCategory || maxPrice || sortBy) && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => { setSearchTerm(""); setSelectedSubCategory(""); setMaxPrice(""); setSortBy(""); }}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
              >
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </motion.div>

<<<<<<< HEAD
        {/* Recommandations */}
        {recommendedResources.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-800">Nos recommandations pour vous</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedResources.slice(0, 5).map(r => <RecommendationCard key={r._id} resource={r} />)}
=======
        {/* ── Section Recommandations avec spinner ── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-800">{getRecsTitle()}</h2>
            {/* Spinner inline pendant le chargement */}
            {loadingRecs && <Spinner size="sm" color="purple" />}
          </div>

          {loadingRecs ? (
            // ── Skeleton cards pendant le chargement ──
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : recommendedResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedResources.slice(0, 6).map((resource) => (
                <RecommendationCard key={resource._id} resource={resource} />
              ))}
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
              <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Aucune recommandation disponible pour le moment.</p>
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Liste */}
=======
        {/* ── Liste ressources ── */}
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Nos ressources</h2>
              {!loading && <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">{filteredResources.length}</span>}
            </div>
            {totalPages > 1 && <PaginationControls />}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Spinner size="lg" color="blue" />
              <p className="mt-4 text-slate-500">Chargement des ressources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune ressource trouvée</h3>
              <p className="text-gray-500">Modifiez vos critères pour voir plus de résultats.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentResources.map(r => (
                  <ResourceCard key={r._id} resource={r} isLiked={likedResources.includes(r._id)}
                    onLikeUpdate={handleLikeUpdate} onBook={() => setSelectedResource(r)} />
                ))}
              </div>
<<<<<<< HEAD
              {totalPages > 1 && <div className="mt-12 flex justify-center"><PaginationControls /></div>}
=======
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-3">
                  <PaginationControls />
                </div>
              )}
>>>>>>> af1dc5ccf51fb5f1eec59841b115453607b925ad
            </>
          )}
        </div>
      </div>

      <Footer />
      {selectedResource && <BookingModal resource={selectedResource} onClose={() => setSelectedResource(null)} />}
    </div>
  );
}
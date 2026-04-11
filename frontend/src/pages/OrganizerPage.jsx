import { useState, useEffect, useRef } from "react";
import { Search, Filter, Sparkles, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon, ArrowUpDown } from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import BookingModal from "../components/BookingModal";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecommendationCard from "../components/RecommendationCard";
import Footer from "../components/footer";
import { motion } from "framer-motion";

// Catégories principales avec sous-catégories
const categoryGroups = [
  {
    label: "Salle",
    value: "salle",
    subCategories: null,
  },
  {
    label: "Décoration",
    value: "decoration",
    subCategories: null,
  },
  {
    label: "Matériel",
    value: "materiel",
    subCategories: null,
  },
  {
    label: "Personnel",
    value: "personnel",
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

// ─── Dropdown Catégorie avec sous-menu hover ───────────────────────────────────
function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getLabel = () => {
    for (const g of categoryGroups) {
      if (!g.subCategories && g.value === value) return g.label;
      if (g.subCategories) {
        const sub = g.subCategories.find((s) => s.value === value);
        if (sub) return `${g.label} › ${sub.label}`;
      }
    }
    return "Toutes les catégories";
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-left text-sm text-gray-700 hover:border-blue-300 transition-colors"
      >
        <span className={value ? "text-blue-600 font-medium" : "text-gray-500"}>{getLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[210px] py-1 overflow-visible">
          <div
            className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            Toutes les catégories
          </div>
          <div className="border-t border-gray-100 my-1" />

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
                <span>{group.label}</span>
                {group.subCategories && (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {group.subCategories && hoveredGroup === group.value && (
                <div className="absolute left-full top-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[180px] py-1">
                  {group.subCategories.map((sub) => (
                    <div
                      key={sub.value}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() => { onChange(sub.value); setOpen(false); }}
                    >
                      {sub.label}
                    </div>
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

// ─── Dropdown Tri ──────────────────────────────────────────────────────────────
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLabel = sortOptions.find((o) => o.value === value)?.label || "Trier par";

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">Trier par</label>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-left text-sm hover:border-blue-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span className={value ? "text-blue-600 font-medium" : "text-gray-500"}>{currentLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[200px] py-1">
          {sortOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                ${value === opt.value
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {value === opt.value && (
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
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
  const [likedResources, setLikedResources] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    const adore = JSON.parse(localStorage.getItem("adore")) || [];
    setLikedResources(adore);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setShowFilter(window.scrollY <= lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id || null;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let url = "http://localhost:5000/api/recommendations";
        if (userId && eventId) url += `/${userId}/${eventId}`;
        else if (userId) url += `/${userId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur chargement recommandations");
        const result = await response.json();
        setRecommendedResources(result.data || []);
      } catch (error) {
        console.error("Erreur recommandations :", error);
        setRecommendedResources([]);
      }
    };
    fetchRecommendations();
  }, [userId, eventId]);

  useEffect(() => { loadResources(); }, []);

  useEffect(() => { filterAndSortResources(); }, [resources, searchTerm, selectedSubCategory, maxPrice, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedSubCategory, maxPrice, sortBy]);

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

  const handleLikeUpdate = (resourceId, isLiked) => {
    setLikedResources((prev) =>
      isLiked ? [...prev, resourceId] : prev.filter((id) => id !== resourceId)
    );
  };
  const getLocationDisplay = (location) => {
  if (!location) return "Non spécifié";

  // 🔵 Nouveau format GeoJSON
  if (typeof location === "object" && location.coordinates) {
    const [lng, lat] = location.coordinates;
    return `📍 ${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  }

  // 🟢 Ancien format string
  if (typeof location === "string") {
    return location;
  }

  return "Non spécifié";
};

  const filterAndSortResources = () => {
    let filtered = [...resources];

    // Recherche textuelle
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          r.location?.toLowerCase().includes(term) ||
          r.provider_name?.toLowerCase().includes(term)
      );
    }

    // Filtre par sous-catégorie
    if (selectedSubCategory) {
      filtered = filtered.filter((r) => r.category === selectedSubCategory);
    }

    // Filtre par prix max
    if (maxPrice) {
      filtered = filtered.filter((r) => r.price <= parseFloat(maxPrice));
    }

    // Tri
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name_asc":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name_desc":
        filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "date_desc":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "date_asc":
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        break;
    }

    setFilteredResources(filtered);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Numéros de pages à afficher
  const getPageNumbers = () => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      if (totalPages <= 5) return i + 1;
      if (currentPage <= 3) return i + 1;
      if (currentPage >= totalPages - 2) return totalPages - 4 + i;
      return currentPage - 2 + i;
    });
  };

  // Composant pagination réutilisable
  const PaginationControls = () => (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1.5 rounded-lg border transition-all ${currentPage === 1
          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
          }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50"
            }`}
        >
          {pageNum}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1.5 rounded-lg border transition-all ${currentPage === totalPages
          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
          }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="pt-28 pb-10 px-4 max-w-7xl mx-auto">

        {/* Bannière d'introduction */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">✨ Organisez l'événement inoubliable</h2>
              <p className="text-blue-100 mb-4">Des centaines de ressources à portée de main, filtrées selon vos besoins</p>
              <div className="flex gap-2 flex-wrap">
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          </motion.div>
        </div>

        {/* ── Barre de filtres ── */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">Recherche & Filtres</h2>
          </div>

          {/* Grille responsive avec 5 colonnes sur grand écran */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Recherche – occupe 2 colonnes */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher une ressource</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nom, lieu, prestataire..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm hover:border-blue-300 transition-colors"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <CategoryDropdown value={selectedSubCategory} onChange={setSelectedSubCategory} />
            </div>

            {/* Budget max */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget max (€)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                placeholder="Ex: 500"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm hover:border-blue-300 transition-colors"
              />
            </div>

            {/* Trier par – colonne compacte */}
            <div>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          {/* Bouton de réinitialisation (aligné à droite) */}
          {(searchTerm || selectedSubCategory || maxPrice || sortBy) && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubCategory("");
                  setMaxPrice("");
                  setSortBy("");
                }}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </motion.div>
        {/* ── Recommandations ── */}
        {recommendedResources.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-800">Nos recommandations pour vous</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedResources.slice(0, 5).map((resource) => (
                <RecommendationCard key={resource._id} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* ── Liste des ressources ── */}
        <div>
          {/* Titre + compteur + pagination inline */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Nos ressources</h2>
              {!loading && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                  {filteredResources.length}
                </span>
              )}
            </div>

            {/* Pagination compacte en haut à droite */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">

                <PaginationControls />
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
                {currentResources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    isLiked={likedResources.includes(resource._id)}
                    onLikeUpdate={handleLikeUpdate}
                    onBook={() => setSelectedResource(resource)}
                  />
                ))}
              </div>

              {/* Pagination bas de page */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-3">

                  <PaginationControls />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      {selectedResource && (
        <BookingModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </div>
  );
}
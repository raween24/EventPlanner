import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import BookingModal from "../components/BookingModal";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const resourceTypes = [
  { value: "", label: "Tous les types" },
  { value: "salle", label: "Salles" },
  { value: "materiel", label: "Matériel" },
  { value: "decoration", label: "Décoration" },
  { value: "traiteur", label: "Traiteur" },
];

export default function OrganizerPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const eventId = location.state?.eventId;
  const [likedResources, setLikedResources] = useState([]);

  useEffect(() => {
    const adore = JSON.parse(localStorage.getItem("adore")) || [];
    setLikedResources(adore);
  }, []);

  useEffect(() => { loadResources(); }, []);
  useEffect(() => { filterResources(); }, [resources, searchTerm, selectedType, maxPrice]);

  const user = JSON.parse(localStorage.getItem("user"));

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

  const filterResources = () => {
    let filtered = [...resources];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term) ||
        r.provider_name?.toLowerCase().includes(term)
      );
    }
    if (selectedType) filtered = filtered.filter(r => r.type === selectedType);
    if (maxPrice) filtered = filtered.filter(r => r.price <= parseFloat(maxPrice));
    setFilteredResources(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="pt-28 pb-10 px-4 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Nos Ressources</h1>
            <p className="text-slate-500 mt-2">Trouvez les meilleures ressources pour organiser votre événement</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">Recherche & Filtres</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Rechercher une ressource</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nom, lieu, prestataire..."
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                {resourceTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget maximum (€)</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500">Chargement des ressources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune ressource trouvée</h3>
            <p className="text-gray-500">Modifiez vos critères pour voir plus de résultats.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource._id}
                eventId={eventId}
                resource={resource}
                onBook={() => setSelectedResource(resource)}
                isLiked={likedResources.includes(resource._id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedResource && (
        <BookingModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </div>
  );
}
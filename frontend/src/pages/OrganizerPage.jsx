import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import BookingModal from "../components/BookingModal";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedType, maxPrice]);

  const loadResources = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ressources/get_all_ressources"
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }

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
      filtered = filtered.filter(
        (r) =>
          r.name?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          r.location?.toLowerCase().includes(term) ||
          r.provider_name?.toLowerCase().includes(term)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((r) => r.price <= max);
    }

    setFilteredResources(filtered);
  };

  const handleBook = (resource) => {
    setSelectedResource(resource);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
  
        {/* 🔹 Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Espace Organisateur
            </h1>
            <p className="text-slate-500 mt-2">
              Trouvez les meilleures ressources pour organiser votre événement
            </p>
          </div>
  
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl bg-white shadow hover:bg-blue-600 hover:text-white transition font-medium"
          >
            ← Retour
          </button>
        </div>
  
        {/* 🔹 Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
  
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">
              Recherche & Filtres
            </h2>
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  
            {/* 🔍 Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Rechercher une ressource
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nom, lieu, prestataire..."
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
  
            {/* 📂 Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
  
            {/* 💰 Max Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Budget maximum (€)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
  
        {/* 🔹 Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500">
              Chargement des ressources...
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Aucune ressource trouvée
            </h3>
            <p className="text-gray-500">
              Modifiez vos critères pour voir plus de résultats.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>
  
      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}
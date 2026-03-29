import { MapPin, Users, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResourceCard({ resource = {} }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [adoreIds, setAdoreIds] = useState([]); // stocke les IDs des ressources aimées

  // Images
  const images =
    resource.media?.flatMap((m) =>
      m.img_vd.map((img) =>
        img.startsWith("http")
          ? img
          : `http://localhost:5000/${img}`
      )
    ) || [];

  const isAvailable = resource.availability?.length > 0;

  // Récupérer l'utilisateur depuis localStorage
  const getUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Récupérer la liste des favoris depuis le backend
  const fetchAdoreList = async (userId, token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/adore/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // data est un tableau d'objets ressource, on extrait les ids
        const ids = data.map((item) => item._id);
        setAdoreIds(ids);
        setLiked(ids.includes(resource._id));
      }
    } catch (err) {
      console.error("Erreur récupération favoris:", err);
    }
  };

  // Chargement initial : si utilisateur connecté, on récupère ses favoris
  useEffect(() => {
    const user = getUser();
    const token = localStorage.getItem("token");
    if (user && token) {
      fetchAdoreList(user.id, token);
    }
  }, [resource._id]); // si la ressource change, on revérifie

  // Like / Unlike
  const toggleLike = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    const token = localStorage.getItem("token");
    const user = getUser();

    if (!token || !user) {
      alert("Vous devez être connecté !");
      return;
    }

    setLoadingLike(true);
    try {
      const url = liked
        ? "http://localhost:5000/api/users/remove"
        : "http://localhost:5000/api/users/like";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resourceId: resource._id }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Déjà dans les favoris") {
          setLiked(true);
          if (!adoreIds.includes(resource._id)) {
            setAdoreIds([...adoreIds, resource._id]);
          }
        } else {
          console.error("Erreur:", data.message);
        }
        return;
      }

      // Mise à jour locale
      if (liked) {
        setAdoreIds(adoreIds.filter((id) => id !== resource._id));
        setLiked(false);
      } else {
        setAdoreIds([...adoreIds, resource._id]);
        setLiked(true);
      }

      // Mise à jour de l'utilisateur dans localStorage
      const updatedUser = { ...user, adore: liked ? adoreIds.filter(id => id !== resource._id) : [...adoreIds, resource._id] };
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (error) {
      console.error("Erreur like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  // Animation du carrousel au survol
  useEffect(() => {
    if (!isHovering || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovering, images]);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentIndex(0);
      }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={resource.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            No Image
          </div>
        )}

        {/* Cœur des favoris */}
        <div
          onClick={toggleLike}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={`transition-all ${
              liked ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </div>

        {/* Badge indisponibilité */}
        {!isAvailable && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs text-white bg-red-600 rounded-full">
            Indisponible
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-lg font-semibold">{resource.name}</h3>
        <p className="text-sm text-gray-500">{resource.description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {resource.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {resource.location}
            </div>
          )}
          {resource.capacity && (
            <div className="flex items-center gap-2">
              <Users size={16} />
              {resource.capacity} personnes
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-xl font-bold">{resource.price?.toFixed(2)}€</p>
          <button
            disabled={!isAvailable}
            onClick={() => navigate(`/RessourceDetail/${resource._id}`)}
            className={`px-5 py-2 rounded-xl ${
              isAvailable
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            voir plus
          </button>
        </div>

        <p className="text-xs mt-3 text-gray-500">
          Proposé par {resource.provider_name}
        </p>
      </div>
    </div>
  );
}
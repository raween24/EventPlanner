import { MapPin, Users, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResourceCard({ resource = {} }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  // 🔹 Images
  const images =
    resource.media?.flatMap((m) =>
      m.img_vd.map((img) =>
        img.startsWith("http")
          ? img
          : `http://localhost:5000/${img}`
      )
    ) || [];

  const isAvailable = resource.availability?.length > 0;

  // 🔥 Initialiser le like depuis localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const adore = user?.adore || [];

    setLiked(adore.includes(resource._id));
  }, [resource._id]);

  // 🔥 Toggle Like
  const toggleLike = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("Vous devez être connecté !");
      return;
    }

    setLoadingLike(true);

    try {
      const url = liked
        ? "http://localhost:5000/api/users/remove"
        : "http://localhost:5000/api/users/like";

      const method = liked ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resourceId: resource._id,
        }),
      });
      console.log("resourceId:", resource._id)
      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Déjà dans les favoris") {
          setLiked(true);
          return;
        }
        throw new Error(data.message);
      }

      // 🔥 Mise à jour locale
      let updatedAdore;

      if (liked) {
        updatedAdore = user.adore.filter(id => id !== resource._id);
        setLiked(false);
      } else {
        updatedAdore = [...(user.adore || []), resource._id];
        setLiked(true);
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, adore: updatedAdore })
      );

    } catch (err) {
      alert(err.message); // 🔥 meilleur affichage
    } finally {
      setLoadingLike(false);
    }
  };

  // 🔹 Animation carrousel
  useEffect(() => {
    if (!isHovering || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
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
      {/* 🔹 Image */}
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

        {/* ❤️ Like */}
        <div
          onClick={toggleLike}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={`transition-all ${liked
              ? "fill-red-500 text-red-500"
              : "text-gray-600"
              }`}
          />
        </div>

        {/* ❌ Indisponible */}
        {!isAvailable && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs text-white bg-red-600 rounded-full">
            Indisponible
          </span>
        )}
      </div>

      {/* 🔹 Contenu */}
      <div className="p-5">
        <h3 className="text-lg font-semibold">
          {resource.name}
        </h3>

        <p className="text-sm text-gray-500">
          {resource.description}
        </p>

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
          <p className="text-xl font-bold">
            {resource.price?.toFixed(2)}€
          </p>

          <button
            disabled={!isAvailable}
            onClick={() =>
              navigate(`/RessourceDetail/${resource._id}`)
            }
            className={`px-5 py-2 rounded-xl ${isAvailable
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            voir plus
          </button>
        </div>

        <p className="text-xs mt-3 text-gray-500">
          Proposé par {resource.prestataire?.lastname || "Inconnu"}
        </p>
      </div>
    </div>
  );
}
import { MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";

const typeLabels = {
  salle: "Salle",
  materiel: "Matériel",
  decoration: "Décoration",
  traiteur: "Traiteur",
};

const typeColors = {
  salle: "bg-blue-600",
  materiel: "bg-green-600",
  decoration: "bg-pink-600",
  traiteur: "bg-orange-600",
};

export default function ResourceCard({ resource, onBook }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || !resource.image?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === resource.image.length - 1 ? 0 : prev + 1
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovering, resource.image]);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentIndex(0);
  };

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        {resource.image?.length > 0 ? (
          <img
            src={resource.image[currentIndex]}
            alt={resource.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${
            typeColors[resource.type]
          }`}
        >
          {typeLabels[resource.type]}
        </span>

        {/* Availability badge */}
        {!resource.availability && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
            Indisponible
          </span>
        )}

        {/* Slider dots */}
        {resource.image?.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {resource.image.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white scale-110"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {resource.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {resource.description}
        </p>

        {/* INFO */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {resource.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{resource.location}</span>
            </div>
          )}

          {resource.capacity > 0 && (
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{resource.capacity} personnes</span>
            </div>
          )}
        </div>

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div>
            <p className="text-xl font-bold text-gray-900">
              {Number(resource.price).toFixed(2)}€
              <span className="text-xs text-gray-500"> / jour</span>
            </p>
          </div>

          <button
            onClick={() => onBook(resource)}
            disabled={!resource.availability}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              resource.availability
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Réserver
          </button>
        </div>

        {/* Provider */}
        <p className="mt-4 text-xs text-gray-400">
          Proposé par{" "}
          <span className="text-gray-700 font-medium">
            {resource.provider_name}
          </span>
        </p>
      </div>
    </div>
  );
}
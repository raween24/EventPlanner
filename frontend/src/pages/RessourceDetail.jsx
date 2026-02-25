import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
} from "lucide-react"

export default function ResourceDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserved, setReserved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/ressources/get_by_id/${id}`
        )
        const data = await res.json()
        setResource(data)
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [id])

  const images = resource?.media?.flatMap((m) => 
    m.img_vd.map((img) => 
      img.startsWith("http") ? img : `http://localhost:5000/${img}`
    )
  ) || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'Escape') setShowLightbox(false)
  }

  useEffect(() => {
    if (showLightbox) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [showLightbox, currentImageIndex])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  )

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <p className="text-gray-600 mb-4">Ressource non trouvée.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
          Retour
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Carrousel d'images */}
            <div className="relative group">
              {/* Image principale */}
              <div 
                className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-pointer"
                onClick={() => setShowLightbox(true)}
              >
                <img
                  src={images[currentImageIndex] || "/placeholder-image.jpg"}
                  alt={`${resource.name} - Image ${currentImageIndex + 1}`}
                  className="w-full aspect-[16/9] object-cover transition duration-500 hover:scale-105"
                />
                
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Compteur d'images */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden aspect-[4/3] transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'ring-2 ring-black scale-105 shadow-lg' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations détaillées */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {resource.type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{resource.location}</span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Caractéristiques</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-500">Capacité</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {resource.capacity} personnes
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-500">Fournisseur</p>
                    <p className="font-semibold">{resource.provider_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 transition-all duration-300 hover:shadow-xl">
              {/* Prix */}
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-gray-900">{resource.price}€</span>
                <span className="text-lg text-gray-500 ml-2">/jour</span>
              </div>

              {/* Informations */}
              <div className="py-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize bg-gray-100 px-3 py-1 rounded-full">
                    {resource.type}
                  </span>
                </div>
                
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Capacité max</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {resource.capacity} personnes
                  </span>
                </div>
              </div>

              {/* Bouton de réservation */}
              {reserved ? (
                <div className="bg-green-50 p-4 rounded-xl text-center animate-fade-in">
                  <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">Réservation confirmée !</p>
                  <p className="text-sm text-green-600 mt-1">Un email de confirmation vous a été envoyé.</p>
                </div>
              ) : (
                <button
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setReserved(true)}
                >
                  Réserver maintenant
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Image lightbox */}
          <div 
            className="relative max-w-7xl mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${resource.name} - Vue agrandie`}
              className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl"
            />

            {/* Contrôles de navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Indicateur de position */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
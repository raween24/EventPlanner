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
  X,
  Calendar,
  Clock,
  CalendarRange,
  Star,
  MessageCircle,
  ThumbsUp,
  Send,
  Map,
  User
} from "lucide-react"

export default function ResourceDetailsPage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserved, setReserved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  // État pour l'utilisateur connecté
  const [currentUser, setCurrentUser] = useState(null)

  // États pour le calendrier
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [unavailableDates, setUnavailableDates] = useState([]) // Dates indisponibles
  const [availabilities, setAvailabilities] = useState([]) // Périodes de disponibilité
  const [isSelecting, setIsSelecting] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  // États pour les commentaires
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Récupérer l'utilisateur connecté au chargement
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les détails de la ressource
        const res = await fetch(
          `http://localhost:5000/api/ressources/get_by_id/${id}`
        )
        const data = await res.json()
        setResource(data)

        // Récupérer les disponibilités de la ressource
        if (data.availability && data.availability.length > 0) {
          const unavailableDatesSet = new Set()

          data.availability.forEach(period => {
            if (!period.satut_disp) {
              const start = new Date(period.date_deb)
              const end = new Date(period.date_fin)

              const current = new Date(start)

              while (current <= end) {
                unavailableDatesSet.add(current.toDateString())
                current.setDate(current.getDate() + 1)
              }
            }
          })

          setUnavailableDates(Array.from(unavailableDatesSet))
        }
        await fetchComments()
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Récupérer les disponibilités depuis la base de données

  // Calculer la note moyenne
  const averageRating = comments.reduce((acc, comment) => acc + comment.nbr_stars, 0) / comments.length || 0

  // Récupérer les commentaires depuis la base de données
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/comment/ressource/${id}`
      )
      const data = await res.json()
      setComments(data)
    } catch (error) {
      console.error("Erreur commentaires:", error)
    }
  }

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim() || !currentUser) return

    setSubmitting(true)

    try {
      const response = await fetch(
        "http://localhost:5000/api/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contenue: newComment,
            nbr_stars: newRating,
            C_user: currentUser.id,
            C_res: id,
          }),
        }
      )

      if (!response.ok) throw new Error("Erreur ajout")

      setNewComment("")
      setNewRating(5)
      setShowCommentForm(false)

      await fetchComments()
    } catch (error) {
      console.error("Erreur ajout commentaire:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) throw new Error("Erreur suppression")

      await fetchComments()
    } catch (error) {
      console.error("Erreur suppression commentaire:", error)
    }
  }

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  // Vérifier si une date est disponible (pas dans unavailableDates)
  const normalizeDate = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const isDateAvailable = (date) => {
    if (!resource || !resource.availability) return false

    const checkDate = normalizeDate(date)
    const today = normalizeDate(new Date())

    if (checkDate < today) return false

    return resource.availability.some((period) => {
      const start = normalizeDate(period.date_deb)
      const end = normalizeDate(period.date_fin)

      return checkDate >= start && checkDate <= end
    })
  }
  // Vérifier si une date est dans la période sélectionnée
  const isDateInRange = (date) => {
    if (!startDate) return false
    if (!endDate) return date.toDateString() === startDate.toDateString()

    const dateTime = date.getTime()
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()

    return dateTime >= startTime && dateTime <= endTime
  }

  // Vérifier si la période est valide
  const isRangeValid = () => {
    if (!startDate || !endDate) return false

    const start = new Date(Math.min(startDate.getTime(), endDate.getTime()))
    const end = new Date(Math.max(startDate.getTime(), endDate.getTime()))

    const currentDate = new Date(start)
    while (currentDate <= end) {
      if (!isDateAvailable(currentDate)) {
        return false
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return true
  }

  // Gérer le clic sur une date
  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return

    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
      setIsSelecting(true)
    } else if (startDate && !endDate) {
      if (date.getTime() < startDate.getTime()) {
        setEndDate(startDate)
        setStartDate(date)
      } else {
        setEndDate(date)
      }
      setIsSelecting(false)
    }
  }

  // Réinitialiser la sélection
  const resetSelection = () => {
    setStartDate(null)
    setEndDate(null)
    setIsSelecting(false)
  }

  // Calculer le nombre de jours
  const getNumberOfDays = () => {
    if (!startDate || !endDate) return 0
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  // Navigation du mois
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Obtenir les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []

    const firstDayOfWeek = firstDay.getDay()
    for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
      const prevDate = new Date(year, month, -i)
      days.unshift({ date: prevDate, currentMonth: false })
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i)
      days.push({ date: currentDate, currentMonth: true })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, currentMonth: false })
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

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

                {/* Flèches de navigation sur l'image principale */}
                {images.length > 1 && (
                  <>
                    {/* Flèche gauche */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Flèche droite */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden aspect-[4/3] transition-all duration-300 ${index === currentImageIndex
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.round(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({comments.length} avis)
                    </span>
                  </div>
                </div>
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

            {/* Section Commentaires - CORRIGÉE ET AMÉLIORÉE */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Avis ({comments.length})
                </h2>

                {currentUser ? (
                  <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    {showCommentForm ? 'Annuler' : 'Donner mon avis'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Connectez-vous pour commenter
                  </button>
                )}
              </div>

              {/* Formulaire d'ajout de commentaire */}
              {showCommentForm && currentUser && (
                <form onSubmit={handleAddComment} className="mb-8 bg-gray-50 p-4 rounded-xl animate-fade-in">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre note
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none transition transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 transition-all duration-200 ${star <= newRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-gray-400'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre commentaire
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Partagez votre expérience... (minimum 10 caractères)"
                      minLength="10"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || newComment.length < 10}
                      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? 'Publication...' : 'Publier mon avis'}
                    </button>
                  </div>
                </form>
              )}

              {/* Liste des commentaires */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Aucun avis pour le moment
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Soyez le premier à donner votre avis sur cette ressource !
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment._id} 
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 hover:bg-gray-50/50 p-4 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar de l'utilisateur */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-semibold shadow-md">
                          {comment.C_user?.image ? (
                            <img 
                              src={comment.C_user.image} 
                              alt={comment.C_user.firstname}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<span>' + (comment.C_user?.firstname?.charAt(0).toUpperCase() || 'U') + '</span>';
                              }}
                            />
                          ) : (
                            <span className="text-lg">
                              {comment.C_user?.firstname?.charAt(0).toUpperCase() || 
                               comment.C_user?.name?.charAt(0).toUpperCase() || 
                               'U'}
                            </span>
                          )}
                        </div>
                        
                        {/* Contenu du commentaire */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {comment.C_user?.firstname || comment.C_user?.name || "Utilisateur"} {comment.C_user?.lastname || ""}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>

                            {/* Bouton de suppression (visible seulement pour l'auteur) */}
                            {currentUser && currentUser.id === comment.C_user?._id && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-xs text-red-500 hover:text-red-700 px-3 py-1 rounded-full hover:bg-red-50 transition"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>

                          {/* Étoiles de notation */}
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= comment.nbr_stars
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Contenu du commentaire */}
                          <p className="text-gray-700 leading-relaxed">
                            {comment.contenue}
                          </p>

                          {/* Footer du commentaire avec actions */}
                          <div className="flex items-center gap-4 mt-3">
                            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition">
                              <ThumbsUp className="h-3 w-3" />
                              <span>Utile</span>
                            </button>
                            <span className="text-xs text-gray-400">
                              Il y a {Math.floor((new Date() - new Date(comment.createdAt)) / (1000 * 60 * 60 * 24))} jours
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section Carte */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Map className="h-5 w-5" />
                Localisation
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p>{resource.location}</p>
                  </div>
                </div>
                <div className="relative h-[300px] rounded-xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      resource.location
                    )}&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Calendrier et réservation */}
          <div className="lg:col-span-1 space-y-6">

            {/* Calendrier interactif avec sélection de période */}
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarRange className="h-5 w-5" />
                  Sélectionner une période
                </h3>
                {loadingAvailability ? (
                  <span className="text-xs text-gray-500">Chargement...</span>
                ) : (
                  (startDate || endDate) && (
                    <button
                      onClick={resetSelection}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Réinitialiser
                    </button>
                  )
                )}
              </div>

              {/* Navigation du mois */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, currentMonth }, index) => {
                  const isAvailable = isDateAvailable(date)
                  const isInRange = isDateInRange(date)
                  const isStart = startDate?.toDateString() === date.toDateString()
                  const isEnd = endDate?.toDateString() === date.toDateString()
                  const isToday = date.toDateString() === new Date().toDateString()

                  let bgColor = ''
                  if (isInRange && currentMonth) {
                    if (isStart || isEnd) {
                      bgColor = 'bg-blue-600 text-white'
                    } else {
                      bgColor = 'bg-blue-100 text-blue-700'
                    }
                  } else if (currentMonth && isAvailable) {
                    bgColor = 'hover:bg-green-50 text-gray-700'
                  } else if (currentMonth && !isAvailable) {
                    bgColor = 'text-red-400 cursor-not-allowed opacity-60 bg-red-50'
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => currentMonth && handleDateClick(date)}
                      disabled={!currentMonth || !isAvailable || loadingAvailability}
                      className={`
                        aspect-square p-1 rounded-lg text-sm transition-all duration-200 relative
                        ${bgColor}
                        ${isToday && currentMonth && isAvailable && 'font-bold border-2 border-gray-300'}
                        ${!currentMonth && 'text-gray-300'}
                        ${loadingAvailability && 'opacity-50 cursor-wait'}
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span>{date.getDate()}</span>
                        {isAvailable && currentMonth && !isInRange && (
                          <span className="text-[8px] text-green-600">●</span>
                        )}
                      </div>
                      {isStart && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Légende et informations de sélection */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">Disponible</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-xs text-gray-600">Indisponible</span>
                    </div>
                  </div>
                  {availabilities.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {availabilities.length} période(s)
                    </span>
                  )}
                </div>

                {(startDate || endDate) && (
                  <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Début :</span>
                      <span className="font-medium">
                        {startDate ? startDate.toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Fin :</span>
                      <span className="font-medium">
                        {endDate ? endDate.toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </div>
                    {startDate && endDate && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Durée :</span>
                          <span className="font-medium text-blue-600">
                            {getNumberOfDays()} jour{getNumberOfDays() > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Total :</span>
                          <span className="font-bold text-lg">
                            {resource.price * getNumberOfDays()}€
                          </span>
                        </div>
                      </>
                    )}
                    {isSelecting && (
                      <p className="text-xs text-blue-600 mt-2">
                        Sélectionnez la date de fin
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Carte de réservation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 transition-all duration-300 hover:shadow-xl">
              {/* Prix */}
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-gray-900">{resource.price}€</span>
                <span className="text-lg text-gray-500 ml-2">/jour</span>
              </div>

              {/* Résumé de la réservation */}
              {startDate && endDate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Période sélectionnée
                    </span>
                  </div>
                  <div className="text-sm text-blue-600 space-y-1">
                    <p>Du {startDate.toLocaleDateString('fr-FR')}</p>
                    <p>Au {endDate.toLocaleDateString('fr-FR')}</p>
                    <p className="font-medium mt-2">
                      Total: {resource.price * getNumberOfDays()}€
                    </p>
                  </div>
                </div>
              )}

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
                  <p className="text-sm text-green-600 mt-1">
                    Du {startDate?.toLocaleDateString('fr-FR')} au {endDate?.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ) : (
                <button
                  className={`
                    w-full py-4 rounded-xl font-semibold transition-all duration-300
                    ${startDate && endDate && isRangeValid() && !loadingAvailability
                      ? 'bg-black text-white hover:bg-gray-800 transform hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  onClick={() => startDate && endDate && setReserved(true)}
                  disabled={!startDate || !endDate || !isRangeValid() || loadingAvailability}
                >
                  {loadingAvailability
                    ? 'Chargement des disponibilités...'
                    : !startDate
                      ? 'Sélectionnez une date de début'
                      : !endDate
                        ? 'Sélectionnez une date de fin'
                        : !isRangeValid()
                          ? 'Période non disponible'
                          : 'Réserver maintenant'}
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

          <div
            className="relative max-w-7xl mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${resource.name} - Vue agrandie`}
              className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl"
            />

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

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
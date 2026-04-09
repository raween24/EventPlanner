import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MapPin, Mail, Users, Phone, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Maximize2, X, Calendar, Clock, CalendarRange, Star, MessageCircle, ThumbsUp, Send, Map, User, Clock3, CalendarClock, Check, AlertCircle, Info, Edit3, Trash2, Flag, Zap, Ruler, Palette, Weight, Tag, Building, ShoppingCart } from "lucide-react";

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectionMode, setSelectionMode] = useState("single");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [commentFilter, setCommentFilter] = useState("all");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ressources/get_by_id/${id}`);
        const data = await res.json();
        setResource(data);

        if (data.availability && data.availability.length > 0) {
          const unavailableFullDays = new Set();
          const tempUnavailableSlots = [];

          data.availability.forEach((period) => {
            if (!period.satut_disp) {
              const start = new Date(period.date_deb);
              const end = new Date(period.date_fin);
              tempUnavailableSlots.push({ start, end });

              const isFullDay = start.getHours() === 0 && end.getHours() >= 23;
              if (isFullDay) {
                const current = new Date(start);
                while (current <= end) {
                  unavailableFullDays.add(current.toDateString());
                  current.setDate(current.getDate() + 1);
                }
              }
            }
          });

          setUnavailableDates(Array.from(unavailableFullDays));
          setUnavailableSlots(tempUnavailableSlots);
        }

        await fetchComments();
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ═══════════════════════════════════════════
  // ✅ AJOUTER AU PANIER (localStorage)
  //    — ne crée PAS de demande, ne POST rien
  //    — l'envoi se fait depuis "Mes réservations"
  // ═══════════════════════════════════════════
  const addToCart = () => {
    const existing = JSON.parse(localStorage.getItem("reservationCart") || "[]");

    // Ressource déjà dans le panier ?
    const alreadyIn = existing.some(i => i.resourceId === resource._id);
    if (alreadyIn) {
      alert("Cette ressource est déjà dans votre panier !");
      return;
    }

    const cartItem = {
      resourceId:    resource._id,
      resourceName:  resource.name,
      price:         resource.price,
      type:          resource.type,
      category:      resource.category,
      quantity:      1,
      totalPrice:    resource.price,
      stock:         resource.stock ?? 999,
      // Créneaux retenus pour info (affichage dans MesReservations)
      selectedTimes: selectedTimes.map(s => ({
        display: s.display,
        start:   s.start.toISOString(),
        end:     s.end.toISOString(),
        price:   s.price,
      })),
      selectedDate: selectedDate ? selectedDate.toISOString() : null,
    };

    localStorage.setItem("reservationCart", JSON.stringify([...existing, cartItem]));
    setAddedToCart(true);

    // Reset après 2,5 s
    setTimeout(() => {
      setAddedToCart(false);
      resetSelection();
    }, 2500);
  };

  // === DISPONIBILITÉS ===
  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date); checkDate.setHours(0, 0, 0, 0);
    if (checkDate < today) return false;
    return !unavailableDates.includes(checkDate.toDateString());
  };

  const isPartiallyUnavailable = (date) => {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    return unavailableSlots.some((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd   = new Date(slot.end);
      return d.toDateString() === slotStart.toDateString() || d.toDateString() === slotEnd.toDateString();
    });
  };

  const getDayAvailabilityStatus = (date) => {
    if (!isDateAvailable(date)) return false;
    if (isPartiallyUnavailable(date)) return "partial";
    return true;
  };

  const fetchAvailableTimeSlots = async (date) => {
    if (!date) return;
    setLoadingTimeSlots(true);
    try {
      const slots = [];
      const baseDate = new Date(date); baseDate.setHours(0, 0, 0, 0);

      for (let hour = 0; hour < 24; hour++) {
        const start = new Date(baseDate); start.setHours(hour, 0, 0);
        const end   = new Date(baseDate); end.setHours(hour + 1, 0, 0);

        const isUnavailable = unavailableSlots.some(
          s => start < new Date(s.end) && end > new Date(s.start)
        );

        if (!isUnavailable) {
          slots.push({
            id:      `${start.toISOString()}-${end.toISOString()}`,
            start,
            end,
            display: `${hour}:00 - ${hour + 1}:00`,
            price:   resource?.price || 0,
          });
        }
      }

      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error("Erreur lors du chargement des créneaux:", error);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    if (selectionMode === "single") {
      setSelectedTime(slot);
      setSelectedTimes([slot]);
    } else {
      setSelectedTimes((prev) => {
        const isSelected = prev.some(t => t.id === slot.id);
        return isSelected ? prev.filter(t => t.id !== slot.id) : [...prev, slot];
      });
    }
  };

  const removeTimeSlot = (slotId) => {
    setSelectedTimes(prev => prev.filter(t => t.id !== slotId));
    if (selectedTime?.id === slotId) setSelectedTime(null);
  };

  const calculateTotalPrice = () => selectedTimes.reduce((total, slot) => total + slot.price, 0);

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedTimes([]);
    setShowTimeSlots(true);
    fetchAvailableTimeSlots(date);

    if (!startDate || (startDate && endDate)) {
      setStartDate(date); setEndDate(null);
    } else if (startDate && !endDate) {
      if (date.getTime() < startDate.getTime()) {
        setEndDate(startDate); setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const resetSelection = () => {
    setSelectedDate(null); setSelectedTime(null); setSelectedTimes([]);
    setStartDate(null); setEndDate(null);
    setShowTimeSlots(false); setAvailableTimeSlots([]);
    setSelectionMode("single");
  };

  // === COMMENTAIRES ===
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comment/ressource/${id}`);
      const data = await res.json();
      let sorted = [...data];
      switch (commentFilter) {
        case "recent":  sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
        case "highest": sorted.sort((a, b) => b.nbr_stars - a.nbr_stars); break;
        case "lowest":  sorted.sort((a, b) => a.nbr_stars - b.nbr_stars); break;
        default:        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setComments(sorted);
    } catch (error) { console.error("Erreur commentaires:", error); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!newComment.trim() || !currentUser) { alert("Veuillez vous connecter pour commenter"); return; }
    if (newComment.length < 10) { alert("Le commentaire doit contenir au moins 10 caractères"); return; }
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/comment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contenue: newComment, nbr_stars: newRating, C_res: id }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout");
      setNewComment(""); setNewRating(5); setShowCommentForm(false);
      alert("Commentaire ajouté avec succès !");
      await fetchComments();
    } catch (error) {
      console.error(error); alert("Erreur lors de l'ajout du commentaire");
    } finally { setSubmitting(false); }
  };

  const handleEditComment = async (commentId, content, stars) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenue: content, nbr_stars: stars }),
      });
      if (!response.ok) throw new Error("Erreur modification");
      setEditingCommentId(null);
      await fetchComments();
    } catch (error) { console.error(error); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    try {
      await fetch(`http://localhost:5000/api/comments/${commentId}`, { method: "DELETE" });
      await fetchComments();
    } catch (error) { console.error(error); }
  };

  const handleReportComment = (commentId) => {
    if (!currentUser) { alert("Veuillez vous connecter pour signaler un commentaire"); return; }
    if (window.confirm("Voulez-vous signaler ce commentaire à l'administrateur ?")) {
      alert("Commentaire signalé. Merci de votre contribution !");
    }
  };

  // === UTILITAIRES ===
  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString), now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
    return formatDate(dateString);
  };

  const isDateInRange = (date) => {
    if (!startDate) return false;
    if (!endDate) return date.toDateString() === startDate.toDateString();
    return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime();
  };

  const isRangeValid = () => {
    if (!startDate || !endDate) return false;
    const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
    const end   = new Date(Math.max(startDate.getTime(), endDate.getTime()));
    const cur   = new Date(start);
    while (cur <= end) { if (!isDateAvailable(cur)) return false; cur.setDate(cur.getDate() + 1); }
    return true;
  };

  const getNumberOfDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0);
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
      days.unshift({ date: new Date(year, month, -i), currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) days.push({ date: new Date(year, month, i), currentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    return days;
  };

  const averageRating = comments.reduce((acc, c) => acc + c.nbr_stars, 0) / comments.length || 0;
  const days = getDaysInMonth(currentMonth);
  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const weekDays = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  const images = resource?.media?.flatMap(m =>
    m.img_vd.map(img => img.startsWith("http") ? img : `http://localhost:5000/${img}`)
  ) || [];

  const nextImage = () => setCurrentImageIndex(p => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(p => (p - 1 + images.length) % images.length);
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") setShowLightbox(false);
  };

  useEffect(() => {
    if (showLightbox) { document.addEventListener("keydown", handleKeyDown); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = "unset"; };
  }, [showLightbox, currentImageIndex]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );

  if (!resource) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-10">
        <p className="text-gray-600 mb-4">Ressource non trouvée.</p>
        <button onClick={() => navigate("/")} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">Retour à l'accueil</button>
      </div>
    </div>
  );

  // ─── bouton actif ? ───────────────────────────────────
  const canAddToCart = (selectedTimes.length > 0 || (startDate && endDate && isRangeValid())) && termsAccepted;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" /> Retour
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Colonne gauche ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carrousel */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-pointer" onClick={() => setShowLightbox(true)}>
                <img src={images[currentImageIndex] || "/placeholder-image.jpg"} alt={`${resource.name} - Image ${currentImageIndex + 1}`} className="w-full aspect-[16/9] object-cover transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Maximize2 className="h-8 w-8 text-white drop-shadow-lg" /></div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">{currentImageIndex + 1} / {images.length}</div>
                {images.length > 1 && (
                  <>
                    <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"><ChevronLeft className="h-6 w-6" /></button>
                    <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"><ChevronRight className="h-6 w-6" /></button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`relative rounded-lg overflow-hidden aspect-[4/3] transition-all duration-300 ${index === currentImageIndex ? "ring-2 ring-black scale-105 shadow-lg" : "opacity-70 hover:opacity-100"}`}>
                      <img src={img} alt={`Miniature ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(star => <Star key={star} className={`h-5 w-5 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                    </div>
                    <span className="text-sm text-gray-600">{averageRating.toFixed(1)} ({comments.length} avis)</span>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{resource.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500"><MapPin className="h-4 w-4" /><span>{resource.location}</span></div>
              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{resource.description}</p>
              </div>
            </div>

            {/* Prestataire */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4"><Building className="h-5 w-5 text-indigo-500" />Informations du prestataire</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Building className="h-4 w-4 text-indigo-500" /><div><p className="text-xs text-gray-500">Fournisseur</p><p className="font-semibold text-gray-800">{resource?.prestataire?.lastname || 'Non disponible'}</p></div></div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Mail className="h-4 w-4 text-sky-500" /><div><p className="text-xs text-gray-500">Email</p><p className="font-semibold text-gray-800 truncate">{resource?.prestataire?.email || 'Non disponible'}</p></div></div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Phone className="h-4 w-4 text-emerald-500" /><div><p className="text-xs text-gray-500">Téléphone</p><p className="font-semibold text-gray-800">{resource?.prestataire?.numTel || 'Non disponible'}</p></div></div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Zap className="h-5 w-5 text-amber-500" />Caractéristiques</h2>
              <div className="flex flex-wrap gap-3">
                {resource.attributes && Object.entries(resource.attributes).map(([key, value]) => {
                  let icon = <Tag className="h-4 w-4" />;
                  if (key === 'capacity') icon = <Users className="h-4 w-4" />;
                  else if (key === 'power') icon = <Zap className="h-4 w-4" />;
                  else if (key === 'size') icon = <Ruler className="h-4 w-4" />;
                  else if (key === 'color') icon = <Palette className="h-4 w-4" />;
                  else if (key === 'weight') icon = <Weight className="h-4 w-4" />;
                  const displayValue = typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value;
                  return (
                    <div key={key} className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-full text-sm font-medium">
                      <span className="text-amber-500">{icon}</span>
                      <span className="capitalize">{key}</span>
                      <span className="text-amber-400">·</span>
                      <span>{displayValue}</span>
                    </div>
                  );
                })}
                {resource.customAttributes?.map((attr, index) => (
                  <div key={index} className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="text-amber-500"><Tag className="h-4 w-4" /></span>
                    <span className="capitalize">{attr.name}</span>
                    <span className="text-amber-400">·</span>
                    <span>{typeof attr.value === 'boolean' ? (attr.value ? 'Oui' : 'Non') : attr.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commentaires */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><MessageCircle className="h-5 w-5" />Avis ({comments.length})</h2>
                  {comments.length > 0 && <p className="text-sm text-gray-500 mt-1">Note moyenne : {averageRating.toFixed(1)}/5</p>}
                </div>
                <div className="flex items-center gap-3">
                  <select value={commentFilter} onChange={e => setCommentFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="all">Tous les avis</option>
                    <option value="recent">Plus récents</option>
                    <option value="highest">Meilleures notes</option>
                    <option value="lowest">Moins bonnes notes</option>
                  </select>
                  {currentUser ? (
                    <button onClick={() => setShowCommentForm(!showCommentForm)} className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                      <Edit3 className="h-4 w-4" />{showCommentForm ? "Annuler" : "Donner mon avis"}
                    </button>
                  ) : (
                    <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                      <User className="h-4 w-4" />Connectez-vous
                    </button>
                  )}
                </div>
              </div>

              {showCommentForm && currentUser && (
                <form onSubmit={handleAddComment} className="mb-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl animate-fade-in border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Partagez votre expérience</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none transition transform hover:scale-110">
                          <Star className={`h-8 w-8 transition-all duration-200 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-gray-400"}`} />
                        </button>
                      ))}
                      <span className="text-sm text-gray-500 ml-2">{newRating}/5</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none" placeholder="Partagez votre expérience en détail... (minimum 10 caractères)" minLength="10" required />
                    <p className="text-xs text-gray-500 mt-1">{newComment.length}/500 caractères</p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => { setShowCommentForm(false); setNewComment(""); setNewRating(5); }} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                    <button type="submit" disabled={submitting || newComment.length < 10} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="h-4 w-4" />{submitting ? "Publication..." : "Publier mon avis"}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Aucun avis pour le moment</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">{currentUser ? "Soyez le premier à donner votre avis !" : "Connectez-vous pour être le premier à donner votre avis !"}</p>
                  </div>
                ) : comments.map(comment => (
                  <div key={comment._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 hover:bg-gray-50/50 p-4 rounded-xl transition-all duration-200 group">
                    {editingCommentId === comment._id ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} type="button" onClick={() => setEditingRating(star)} className="focus:outline-none">
                              <Star className={`h-6 w-6 ${star <= editingRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            </button>
                          ))}
                        </div>
                        <textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" rows="3" />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingCommentId(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                          <button onClick={() => handleEditComment(comment._id, editingContent, editingRating)} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Sauvegarder</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-semibold shadow-md">
                          {comment.C_user?.image ? (
                            <img src={comment.C_user.image} alt={comment.C_user.firstname} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
                          ) : (
                            <span className="text-lg">{comment.C_user?.firstname?.charAt(0).toUpperCase() || "U"}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{comment.C_user?.firstname || "Utilisateur"} {comment.C_user?.lastname || ""}</h4>
                                {comment.C_user?._id === currentUser?.id && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Vous</span>}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" />{formatRelativeDate(comment.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {currentUser && currentUser.id === comment.C_user?._id && (
                                <>
                                  <button onClick={() => { setEditingCommentId(comment._id); setEditingContent(comment.contenue); setEditingRating(comment.nbr_stars); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition" title="Modifier"><Edit3 className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteComment(comment._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                                </>
                              )}
                              <button onClick={() => handleReportComment(comment._id)} className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition" title="Signaler"><Flag className="h-4 w-4" /></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[1,2,3,4,5].map(star => <Star key={star} className={`h-4 w-4 ${star <= comment.nbr_stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.contenue}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition group"><ThumbsUp className="h-3 w-3 group-hover:scale-110 transition" /><span>Utile</span></button>
                            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition"><MessageCircle className="h-3 w-3" /><span>Répondre</span></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4"><Map className="h-5 w-5" />Localisation</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-600"><MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" /><div><p className="font-medium text-gray-900">Adresse</p><p>{resource.location}</p></div></div>
                <div className="relative h-[300px] rounded-xl overflow-hidden">
                  <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://www.google.com/maps?q=${encodeURIComponent(resource.location)}&output=embed`}></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* ── Colonne droite ── */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calendrier */}
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><CalendarRange className="h-5 w-5" />Sélectionner une période</h3>
                {(startDate || endDate || selectedDate) && <button onClick={resetSelection} className="text-xs text-gray-500 hover:text-gray-700 underline">Réinitialiser</button>}
              </div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-sm font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition"><ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, currentMonth: cm }, index) => {
                  const status = cm ? getDayAvailabilityStatus(date) : null;
                  const isAvailable = status === true, isPartial = status === "partial", isUnavailable = status === false;
                  const isInRange = isDateInRange(date);
                  const isStart = startDate?.toDateString() === date.toDateString();
                  const isEnd   = endDate?.toDateString()   === date.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  let bgColor = "";
                  if (!cm) bgColor = "text-gray-300";
                  else if (isInRange) bgColor = isStart || isEnd ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700";
                  else if (isSelected) bgColor = "bg-purple-600 text-white";
                  else if (isUnavailable) bgColor = "text-red-400 cursor-not-allowed opacity-60 bg-red-50";
                  else if (isPartial) bgColor = "bg-yellow-50 text-yellow-700 border border-yellow-300";
                  else if (isAvailable) bgColor = "hover:bg-green-50 text-gray-700";
                  return (
                    <button key={index} onClick={() => cm && handleDateClick(date)} disabled={!cm || isUnavailable}
                      className={`aspect-square p-1 rounded-lg text-sm transition-all duration-200 relative ${bgColor} ${isToday && cm && isAvailable ? "font-bold border-2 border-gray-300" : ""}`}>
                      <div className="flex flex-col items-center">
                        <span>{date.getDate()}</span>
                        {isAvailable && cm && !isInRange && !isSelected && <span className="text-[8px] text-green-600">●</span>}
                        {isPartial  && cm && !isInRange && !isSelected && <span className="text-[8px] text-yellow-500">●</span>}
                      </div>
                      {isStart && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>}
                      {isSelected && !isInRange && <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-600 rounded-full"></div>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-gray-600">Disponible</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span className="text-xs text-gray-600">Partiellement indisponible</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><span className="text-xs text-gray-600">Indisponible</span></div>
              </div>
            </div>

            {/* Créneaux horaires */}
            {showTimeSlots && selectedDate && (
              <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-purple-600" /><h3 className="text-lg font-semibold text-gray-900">Créneaux disponibles</h3></div>
                  {selectedTimes.length > 0 && <button onClick={() => setSelectedTimes([])} className="text-xs text-gray-500 hover:text-gray-700 underline">Tout désélectionner</button>}
                </div>
                <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                  <p className="text-sm font-medium text-purple-700 flex items-center gap-2"><Calendar className="h-4 w-4" />{selectedDate.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div className="mb-4 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <button onClick={() => setSelectionMode("single")} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectionMode === "single" ? "bg-purple-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}>Simple</button>
                  <button onClick={() => setSelectionMode("multiple")} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectionMode === "multiple" ? "bg-purple-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}>Multiple</button>
                </div>
                {selectionMode === "multiple" && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">Mode sélection multiple activé.{selectedTimes.length > 0 && ` ${selectedTimes.length} créneau(x) sélectionné(s)`}</p>
                  </div>
                )}
                {loadingTimeSlots ? (
                  <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div></div>
                ) : availableTimeSlots.length > 0 ? (
                  <>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {availableTimeSlots.map(slot => {
                        const isSelected = selectionMode === "single" ? selectedTime?.id === slot.id : selectedTimes.some(t => t.id === slot.id);
                        return (
                          <button key={slot.id} onClick={() => handleTimeSlotSelect(slot)} className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${isSelected ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"}`}>
                            <div className="flex items-center gap-3"><Clock className={`h-5 w-5 ${isSelected ? "text-purple-600" : "text-gray-400"}`} /><div className="text-left"><p className="font-medium text-gray-900">{slot.display}</p><p className="text-sm text-gray-500">{slot.price}€</p></div></div>
                            {isSelected && <Check className="h-5 w-5 text-purple-600" />}
                          </button>
                        );
                      })}
                    </div>
                    {selectionMode === "multiple" && selectedTimes.length > 0 && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl space-y-2">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium text-purple-700">Créneaux sélectionnés ({selectedTimes.length})</span><span className="text-sm font-bold text-purple-700">Total: {calculateTotalPrice()}€</span></div>
                        <div className="max-h-[100px] overflow-y-auto space-y-1">
                          {selectedTimes.map(slot => (
                            <div key={slot.id} className="flex items-center justify-between text-xs text-purple-600">
                              <span>{slot.display}</span>
                              <button onClick={e => { e.stopPropagation(); removeTimeSlot(slot.id); }} className="text-purple-400 hover:text-purple-600"><X className="h-3 w-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectionMode === "single" && selectedTime && (
                      <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" /><p className="text-sm text-green-700">Créneau sélectionné : {selectedTime.display}</p></div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8"><AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Aucun créneau disponible</p><p className="text-sm text-gray-400 mt-1">Essayez une autre date</p></div>
                )}
              </div>
            )}

            {/* ── Carte réservation ── */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 transition-all duration-300 hover:shadow-xl">
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-gray-900">{resource.price}€</span>
                <span className="text-lg text-gray-500 ml-2">/heure</span>
              </div>

              {(startDate || selectedDate) && (
                <div className="mt-4 space-y-3">
                  {selectedDate && (
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium text-purple-700">Date sélectionnée</span></div>
                      <p className="text-sm text-purple-600">{selectedDate.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  )}
                  {selectedTimes.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium text-blue-700">Créneaux sélectionnés ({selectedTimes.length})</span></div>
                      <div className="space-y-1">{selectedTimes.map(slot => <p key={slot.id} className="text-sm text-blue-600">{slot.display}</p>)}</div>
                      <p className="text-sm font-medium text-blue-700 mt-2">Total: {calculateTotalPrice()}€</p>
                    </div>
                  )}
                  {startDate && endDate && (
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2"><CalendarRange className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium text-blue-700">Période sélectionnée</span></div>
                      <div className="text-sm text-blue-600 space-y-1">
                        <p>Du {startDate.toLocaleDateString("fr-FR")}</p>
                        <p>Au {endDate.toLocaleDateString("fr-FR")}</p>
                        <p className="font-medium mt-2">Total: {resource.price * getNumberOfDays() * 24}€</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="py-6 space-y-4 border-b border-gray-100">
                <div className="flex justify-between items-center"><span className="text-gray-500">Type</span><span className="font-medium capitalize bg-gray-100 px-3 py-1 rounded-full">{resource.type}</span></div>
                {resource.capacity && (
                  <div className="flex justify-between items-center"><span className="text-gray-500">Capacité max</span><span className="font-medium flex items-center gap-1"><Users className="h-4 w-4" />{resource.capacity} personnes</span></div>
                )}
              </div>

              {/* Conditions */}
              <div className="my-4 flex items-start gap-2">
                <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{" "}
                  <button type="button" onClick={() => setShowTermsPopup(true)} className="text-black underline hover:text-gray-700 font-medium">conditions générales</button>
                </label>
              </div>

              {/* ═══ BOUTON AJOUTER AU PANIER ═══ */}
              {addedToCart ? (
                <div className="bg-green-50 p-4 rounded-xl text-center animate-fade-in">
                  <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">Ajouté au panier !</p>
                  <p className="text-sm text-green-600 mt-1">Allez dans "Mes réservations" pour envoyer la demande.</p>
                  <button onClick={() => navigate("/mes-reservations")} className="mt-3 text-sm underline text-green-700 hover:text-green-900">
                    Voir le panier →
                  </button>
                </div>
              ) : (
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${canAddToCart ? "bg-black text-white hover:bg-gray-800 transform hover:scale-[1.02] active:scale-[0.98]" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    const user  = JSON.parse(localStorage.getItem("user"));
                    if (!token || !user) { navigate("/login"); return; }
                    addToCart();
                  }}
                  disabled={!canAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {!selectedDate
                    ? "Sélectionnez une date"
                    : selectedTimes.length === 0 && !endDate
                      ? "Choisissez des créneaux"
                      : `Ajouter au panier ${selectedTimes.length > 0 ? `(${calculateTotalPrice()}€)` : ""}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2 hover:bg-white/10 rounded-full"><X className="h-8 w-8" /></button>
          <div className="relative max-w-7xl mx-auto px-4" onClick={e => e.stopPropagation()}>
            <img src={images[currentImageIndex]} alt={`${resource.name} - Vue agrandie`} className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl" />
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"><ChevronLeft className="h-6 w-6" /></button>
                <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"><ChevronRight className="h-6 w-6" /></button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">{currentImageIndex + 1} / {images.length}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Popup conditions générales */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowTermsPopup(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Conditions Générales</h2>
              <button onClick={() => setShowTermsPopup(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-gray-700">
              <p className="font-semibold text-gray-900">1. Objet</p><p>Les présentes conditions générales régissent l'utilisation de la plateforme de réservation et la location des ressources mises à disposition par les prestataires.</p>
              <p className="font-semibold text-gray-900">2. Réservation</p><p>La réservation devient définitive après validation de la demande par le prestataire. Toute réservation est personnelle et non transférable.</p>
              <p className="font-semibold text-gray-900">3. Annulation et remboursement</p><p>Les annulations effectuées plus de 48h avant la date de début donnent droit à un remboursement intégral. Passé ce délai, aucun remboursement ne sera effectué.</p>
              <p className="font-semibold text-gray-900">4. Utilisation des ressources</p><p>L'utilisateur s'engage à utiliser la ressource de manière conforme à sa destination et à respecter le règlement intérieur du prestataire.</p>
              <p className="font-semibold text-gray-900">5. Responsabilité</p><p>L'utilisateur est responsable de tout dommage causé à la ressource pendant la période de réservation.</p>
              <p className="font-semibold text-gray-900">6. Données personnelles</p><p>Les données collectées sont nécessaires à la gestion des réservations et ne sont pas transmises à des tiers sans consentement.</p>
              <p className="text-sm text-gray-500 mt-6">Dernière mise à jour : 29 mars 2026</p>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowTermsPopup(false)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">Fermer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
      `}</style>
    </div>
  );
}
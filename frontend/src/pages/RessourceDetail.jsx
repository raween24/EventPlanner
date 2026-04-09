import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MapPin, Mail, Users, Phone, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Maximize2, X, Calendar, Clock, CalendarRange, Star, MessageCircle, ThumbsUp, Send, Map, User, Clock3, CalendarClock, Check, AlertCircle, Info, Edit3, Trash2, Flag, Zap, Ruler, Palette, Weight, Tag, Building, Plus, Minus, ShoppingCart } from "lucide-react";

import QuickEventModal from "../components/QuickEventModal";
import SelectEventModal from "../components/SelectEventModal";
import { useEventManager } from "../hooks/useEventManager";

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // États principaux
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserved, setReserved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // États pour les PRODUITS
  const [quantity, setQuantity] = useState(1);
  const [productStock, setProductStock] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [orderingDirect, setOrderingDirect] = useState(false);

  // États calendrier et créneaux (pour SERVICES)
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

  // États commentaires
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [commentFilter, setCommentFilter] = useState("all");

  // États pour les conditions
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  // États pour la gestion des événements (services)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showSelectEventModal, setShowSelectEventModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const { userEvents, fetchUserEvents, setUserEvents } = useEventManager();

  const isProduct = resource?.type === "product";
  const isService = resource?.type === "service";

  // Récupération de l'utilisateur connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  // Récupération de la ressource
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ressources/get_by_id/${id}`);
        const data = await res.json();
        setResource(data);
        
        // Si c'est un produit, récupérer le stock
        if (data.type === "product") {
          setProductStock(data.stock || 1);
          setQuantity(1);
        }

        // Traitement des indisponibilités (uniquement pour les services)
        if (data.type === "service" && data.availability && data.availability.length > 0) {
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

  // Vérifier s'il y a une réservation en attente après login (pour services)
  useEffect(() => {
    if (location.state?.pendingReservation) {
      const { selectedTimes: pendingTimes, selectedDate: pendingDate } = location.state.pendingReservation;
      if (pendingDate) setSelectedDate(new Date(pendingDate));
      if (pendingTimes && pendingTimes.length > 0) {
        setSelectedTimes(pendingTimes.map(s => ({
          ...s,
          start: new Date(s.start),
          end: new Date(s.end)
        })));
        setShowTimeSlots(true);
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // === FONCTIONS POUR PRODUITS ===

  const addToCart = () => {
    if (quantity > productStock) {
      alert(`Stock insuffisant. Maximum disponible: ${productStock}`);
      return;
    }
    
    const existingCart = JSON.parse(localStorage.getItem("reservationCart") || "[]");
    const existingItemIndex = existingCart.findIndex(item => item.resourceId === resource._id);
    
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].totalPrice = existingCart[existingItemIndex].quantity * resource.price;
    } else {
      existingCart.push({
        resourceId: resource._id,
        resourceName: resource.name,
        price: resource.price,
        quantity: quantity,
        totalPrice: quantity * resource.price,
        resource: resource
      });
    }
    
    localStorage.setItem("reservationCart", JSON.stringify(existingCart));
    alert(`${quantity} x ${resource.name} ajouté au panier !`);
    setQuantity(1);
  };

  const orderDirectly = async () => {
    if (quantity > productStock) {
      alert(`Stock insuffisant. Maximum disponible: ${productStock}`);
      return;
    }
    
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !user) {
      localStorage.setItem("pendingProduct", JSON.stringify({
        resourceId: resource._id,
        resourceName: resource.name,
        price: resource.price,
        quantity: quantity
      }));
      navigate("/login");
      return;
    }

    setOrderingDirect(true);
    try {
      const eventsRes = await axios.get(`http://localhost:5000/api/event/user_event/${user._id || user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let eventId;
      if (eventsRes.data.length === 0) {
        const newEvent = await axios.post("http://localhost:5000/api/event/addEvent", {
          title: `Commande de ${resource.name}`,
          description: `Commande de ${quantity} x ${resource.name}`,
          lieu: "À définir",
          category: "autre",
          type: "privé",
          dateDebut: new Date(),
          dateFin: new Date(),
          nombreParticipants: 0,
        }, { headers: { Authorization: `Bearer ${token}` } });
        eventId = newEvent.data._id;
      } else {
        eventId = eventsRes.data[0]._id;
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      await axios.post("http://localhost:5000/api/location/create", {
        event: eventId,
        resource: resource._id,
        dateDebut: today.toISOString(),
        dateFin: tomorrow.toISOString(),
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert(`Demande pour ${quantity} x ${resource.name} envoyée !`);
      setReserved(true);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setOrderingDirect(false);
    }
  };

  // === FONCTIONS POUR SERVICES ===

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    if (checkDate < today) return false;
    return !unavailableDates.includes(checkDate.toDateString());
  };

  const isPartiallyUnavailable = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return unavailableSlots.some((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return (
        d.toDateString() === slotStart.toDateString() ||
        d.toDateString() === slotEnd.toDateString()
      );
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
      const baseDate = new Date(date);
      baseDate.setHours(0, 0, 0, 0);

      const createSlot = (hour) => {
        const start = new Date(baseDate);
        start.setHours(hour, 0, 0);
        const end = new Date(baseDate);
        end.setHours(hour + 1, 0, 0);

        const isUnavailable = unavailableSlots.some(
          (slot) => start < new Date(slot.end) && end > new Date(slot.start)
        );

        if (!isUnavailable) {
          return {
            id: `${start.toISOString()}-${end.toISOString()}`,
            start,
            end,
            display: `${hour}:00 - ${hour + 1}:00`,
            price: resource?.price || 0,
          };
        }
        return null;
      };

      for (let hour = 0; hour < 24; hour++) {
        const slot = createSlot(hour);
        if (slot) slots.push(slot);
      }

      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const sendLocationRequests = async (eventId) => {
    setSendingRequest(true);
    const token = localStorage.getItem("token");

    try {
      for (const slot of selectedTimes) {
        await axios.post(
          "http://localhost:5000/api/location/create",
          {
            event: eventId,
            resource: resource._id,
            dateDebut: slot.start.toISOString(),
            dateFin: slot.end.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("Demande(s) envoyée(s) avec succès !");
      setReserved(true);
      setSelectedTimes([]);
      setSelectedDate(null);
    } catch (err) {
      console.error("Erreur envoi:", err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSendingRequest(false);
      setShowCreateEventModal(false);
      setShowSelectEventModal(false);
    }
  };

  const handleServiceReservation = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || user?.id;

    if (!token || !userId) {
      localStorage.setItem("pendingReservation", JSON.stringify({
        resourceId: resource._id,
        selectedTimes: selectedTimes.map(slot => ({
          start: slot.start,
          end: slot.end,
          display: slot.display
        })),
        selectedDate,
      }));
      navigate("/login");
      return;
    }

    setSendingRequest(true);
    try {
      const events = await fetchUserEvents(userId, token);
      
      if (events.length === 0) {
        setShowCreateEventModal(true);
      } else {
        setUserEvents(events);
        setShowSelectEventModal(true);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la vérification des événements");
    } finally {
      setSendingRequest(false);
    }
  };

  // === AUTRES FONCTIONS ===

  const handleTimeSlotSelect = (slot) => {
    if (selectionMode === "single") {
      setSelectedTime(slot);
      setSelectedTimes([slot]);
    } else {
      setSelectedTimes((prev) => {
        const isSelected = prev.some((t) => t.id === slot.id);
        if (isSelected) {
          return prev.filter((t) => t.id !== slot.id);
        } else {
          return [...prev, slot];
        }
      });
    }
  };

  const removeTimeSlot = (slotId) => {
    setSelectedTimes((prev) => prev.filter((t) => t.id !== slotId));
    if (selectedTime?.id === slotId) setSelectedTime(null);
  };

  const calculateTotalPrice = () => {
    return selectedTimes.reduce((total, slot) => total + slot.price, 0);
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedTimes([]);
    setShowTimeSlots(true);
    fetchAvailableTimeSlots(date);

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date.getTime() < startDate.getTime()) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const resetSelection = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedTimes([]);
    setStartDate(null);
    setEndDate(null);
    setShowTimeSlots(false);
    setAvailableTimeSlots([]);
    setSelectionMode("single");
  };

  const isDateInRange = (date) => {
    if (!startDate) return false;
    if (!endDate) return date.toDateString() === startDate.toDateString();
    const dateTime = date.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    return dateTime >= startTime && dateTime <= endTime;
  };

  const isRangeValid = () => {
    if (!startDate || !endDate) return false;
    const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
    const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (!isDateAvailable(currentDate)) return false;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return true;
  };

  const getNumberOfDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // === GESTION DES COMMENTAIRES ===

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comment/ressource/${id}`);
      const data = await res.json();
      let sortedComments = [...data];
      switch (commentFilter) {
        case "recent":
          sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "highest":
          sortedComments.sort((a, b) => b.nbr_stars - a.nbr_stars);
          break;
        case "lowest":
          sortedComments.sort((a, b) => a.nbr_stars - b.nbr_stars);
          break;
        default:
          sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setComments(sortedComments);
    } catch (error) {
      console.error("Erreur commentaires:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!newComment.trim() || !currentUser) {
      alert("Veuillez vous connecter pour commenter");
      return;
    }
    if (newComment.length < 10) {
      alert("Le commentaire doit contenir au moins 10 caractères");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/comment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          contenue: newComment,
          nbr_stars: newRating,
          C_res: id,
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout");
      setNewComment("");
      setNewRating(5);
      setShowCommentForm(false);
      alert("Commentaire ajouté avec succès !");
      await fetchComments();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du commentaire");
    } finally {
      setSubmitting(false);
    }
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
      alert("Commentaire modifié avec succès !");
      await fetchComments();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur suppression");
      alert("Commentaire supprimé avec succès !");
      await fetchComments();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleReportComment = (commentId) => {
    if (!currentUser) {
      alert("Veuillez vous connecter pour signaler un commentaire");
      return;
    }
    if (window.confirm("Voulez-vous signaler ce commentaire à l'administrateur ?")) {
      alert("Commentaire signalé. Merci de votre contribution !");
    }
  };

  // === FONCTIONS UTILITAIRES ===

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
    return formatDate(dateString);
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, currentMonth: true });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, currentMonth: false });
    }
    return days;
  };

  const averageRating = comments.reduce((acc, c) => acc + c.nbr_stars, 0) / comments.length || 0;
  const days = getDaysInMonth(currentMonth);
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const images = resource?.media?.flatMap((m) =>
    m.img_vd.map((img) => (img.startsWith("http") ? img : `http://localhost:5000/${img}`))
  ) || [];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") setShowLightbox(false);
  };

  useEffect(() => {
    if (showLightbox) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showLightbox, currentImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <p className="text-gray-600 mb-4">Ressource non trouvée.</p>
          <button onClick={() => navigate("/")} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
          Retour
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carrousel */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-pointer" onClick={() => setShowLightbox(true)}>
                <img src={images[currentImageIndex] || "/placeholder-image.jpg"} alt={`${resource.name}`} className="w-full aspect-[16/9] object-cover transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110">
                      <ChevronRight className="h-6 w-6" />
                    </button>
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

            {/* Badge type */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isProduct ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                {isProduct ? "📦 Produit" : "⏰ Service"}
              </span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{resource.category}</span>
            </div>

            {/* Informations principales */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-5 w-5 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{averageRating.toFixed(1)} ({comments.length} avis)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{resource.location}</span>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{resource.description}</p>
              </div>
            </div>

            {/* Informations prestataire */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Building className="h-5 w-5 text-indigo-500" />
                Informations du prestataire
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building className="h-4 w-4 text-indigo-500" />
                  <div>
                    <p className="text-xs text-gray-500">Fournisseur</p>
                    <p className="font-semibold text-gray-800">{resource?.prestataire?.lastname || 'Non disponible'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-4 w-4 text-sky-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800 truncate">{resource?.prestataire?.email || 'Non disponible'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="font-semibold text-gray-800">{resource?.prestataire?.numTel || 'Non disponible'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section commentaires */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Section commentaires</p>
              </div>
            </div>
          </div>

          {/* Colonne droite - Réservation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte de prix et réservation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-gray-900">{resource.price}€</span>
                <span className="text-lg text-gray-500 ml-2">
                  {isProduct ? "/unité" : "/heure"}
                </span>
              </div>

              {/* PRODUIT */}
              {isProduct && (
                <div className="mt-6 space-y-4">
                  {/* Affichage du stock */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock disponible</span>
                      <span className={`font-semibold ${productStock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {productStock} unité(s)
                      </span>
                    </div>
                  </div>

                  {/* Sélecteur de quantité avec + et - */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quantité</span>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-1 hover:bg-white rounded-md transition disabled:opacity-50"
                      >
                        <Minus size={18} className="text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(quantity + 1, productStock))}
                        disabled={quantity >= productStock}
                        className="p-1 hover:bg-white rounded-md transition disabled:opacity-50"
                      >
                        <Plus size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{resource.price * quantity}€</span>
                  </div>

                  {/* Conditions */}
                  <div className="mb-4 flex items-start gap-2">
                    <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      J'accepte les{" "}
                      <button type="button" onClick={() => setShowTermsPopup(true)} className="text-black underline hover:text-gray-700 font-medium">
                        conditions générales
                      </button>
                    </label>
                  </div>

                  {/* Bouton Ajouter au panier */}
                  <button
                    onClick={addToCart}
                    disabled={!termsAccepted || addingToCart}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart size={18} />
                    Ajouter au panier ({quantity})
                  </button>

                  {/* Bouton Commander directement */}
                  <button
                    onClick={orderDirectly}
                    disabled={!termsAccepted || orderingDirect}
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={18} />
                    {orderingDirect ? "Envoi..." : "Commander directement"}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    Ou retrouvez votre panier dans "Mes réservations"
                  </p>
                </div>
              )}

              {/* SERVICE - calendrier et créneaux */}
              {isService && (
                <>
                  {/* Calendrier */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <CalendarRange className="h-5 w-5" />
                        Sélectionner une date
                      </h3>
                      {(startDate || endDate || selectedDate) && (
                        <button onClick={resetSelection} className="text-xs text-gray-500 hover:text-gray-700 underline">
                          Réinitialiser
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition"><ChevronLeft className="h-4 w-4" /></button>
                      <span className="text-sm font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                      <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day) => (<div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {days.map(({ date, currentMonth: isCurrentMonth }, index) => {
                        const status = isCurrentMonth ? getDayAvailabilityStatus(date) : null;
                        const isAvailable = status === true;
                        const isPartial = status === "partial";
                        const isUnavailable = status === false;
                        const isInRange = isDateInRange(date);
                        const isStart = startDate?.toDateString() === date.toDateString();
                        const isEnd = endDate?.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();

                        let bgColor = "";
                        if (!isCurrentMonth) bgColor = "text-gray-300";
                        else if (isInRange) {
                          if (isStart || isEnd) bgColor = "bg-blue-600 text-white";
                          else bgColor = "bg-blue-100 text-blue-700";
                        } else if (isSelected) bgColor = "bg-purple-600 text-white";
                        else if (isUnavailable) bgColor = "text-red-400 cursor-not-allowed opacity-60 bg-red-50";
                        else if (isPartial) bgColor = "bg-yellow-50 text-yellow-700 border border-yellow-300";
                        else if (isAvailable) bgColor = "hover:bg-green-50 text-gray-700";

                        return (
                          <button key={index} onClick={() => isCurrentMonth && handleDateClick(date)} disabled={!isCurrentMonth || isUnavailable}
                            className={`aspect-square p-1 rounded-lg text-sm transition-all duration-200 relative ${bgColor} ${isToday && isCurrentMonth && isAvailable && "font-bold border-2 border-gray-300"}`}>
                            <div className="flex flex-col items-center">
                              <span>{date.getDate()}</span>
                              {isAvailable && isCurrentMonth && !isInRange && !isSelected && <span className="text-[8px] text-green-600">●</span>}
                              {isPartial && isCurrentMonth && !isInRange && !isSelected && <span className="text-[8px] text-yellow-500">●</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Créneaux horaires */}
                  {showTimeSlots && selectedDate && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock3 className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Créneaux disponibles</h3>
                      </div>
                      <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-700">
                          {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                      </div>
                      <div className="mb-3 flex items-center gap-2">
                        <button onClick={() => setSelectionMode("single")} className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${selectionMode === "single" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"}`}>Simple</button>
                        <button onClick={() => setSelectionMode("multiple")} className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${selectionMode === "multiple" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"}`}>Multiple</button>
                      </div>
                      {loadingTimeSlots ? (
                        <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div></div>
                      ) : availableTimeSlots.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {availableTimeSlots.map((slot) => {
                            const isSelected = selectionMode === "single" ? selectedTime?.id === slot.id : selectedTimes.some((t) => t.id === slot.id);
                            return (
                              <button key={slot.id} onClick={() => handleTimeSlotSelect(slot)} className={`w-full p-3 rounded-lg border transition-all flex justify-between items-center ${isSelected ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}>
                                <span className="font-medium">{slot.display}</span>
                                <span className="text-blue-600 font-semibold">{slot.price}€</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">Aucun créneau disponible</div>
                      )}
                      {selectedTimes.length > 0 && (
                        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-purple-700">{calculateTotalPrice()}€</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-4 flex items-start gap-2 mt-4">
                    <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      J'accepte les{" "}
                      <button type="button" onClick={() => setShowTermsPopup(true)} className="text-black underline hover:text-gray-700 font-medium">
                        conditions générales
                      </button>
                    </label>
                  </div>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${(selectedTimes.length > 0) && termsAccepted ? "bg-black text-white hover:bg-gray-800" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                    onClick={handleServiceReservation}
                    disabled={!(selectedTimes.length > 0 && termsAccepted)}
                  >
                    <CalendarClock className="h-5 w-5" />
                    {!selectedDate ? "Sélectionnez une date" : selectedTimes.length === 0 ? "Choisissez des créneaux" : `Réserver (${selectedTimes.length} créneau(x) - ${calculateTotalPrice()}€)`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2 hover:bg-white/10 rounded-full"><X className="h-8 w-8" /></button>
          <div className="relative max-w-7xl mx-auto px-4" onClick={(e) => e.stopPropagation()}>
            <img src={images[currentImageIndex]} alt={`${resource.name}`} className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl" />
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"><ChevronLeft className="h-6 w-6" /></button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"><ChevronRight className="h-6 w-6" /></button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">{currentImageIndex + 1} / {images.length}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Popup Conditions générales */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowTermsPopup(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Conditions Générales</h2>
              <button onClick={() => setShowTermsPopup(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-gray-700">
              <p className="font-semibold text-gray-900">1. Objet</p>
              <p>Les présentes conditions générales régissent l'utilisation de la plateforme de réservation et la location des ressources mises à disposition par les prestataires.</p>
              <p className="font-semibold text-gray-900">2. Réservation</p>
              <p>La réservation devient définitive après validation du paiement. Toute réservation est personnelle et non transférable.</p>
              <p className="font-semibold text-gray-900">3. Annulation et remboursement</p>
              <p>Les annulations effectuées plus de 48h avant la date de début donnent droit à un remboursement intégral. Passé ce délai, aucun remboursement ne sera effectué.</p>
              <p className="font-semibold text-gray-900">4. Utilisation des ressources</p>
              <p>L'utilisateur s'engage à utiliser la ressource de manière conforme à sa destination et à respecter le règlement intérieur du prestataire.</p>
              <p className="font-semibold text-gray-900">5. Responsabilité</p>
              <p>L'utilisateur est responsable de tout dommage causé à la ressource pendant la période de réservation. Une caution peut être demandée par le prestataire.</p>
              <p className="text-sm text-gray-500 mt-6">Dernière mise à jour : 29 mars 2026</p>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowTermsPopup(false)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAUX POUR LA CRÉATION/SÉLECTION D'ÉVÉNEMENT (uniquement pour services) */}
      {isService && (
        <>
          <QuickEventModal
            isOpen={showCreateEventModal}
            onClose={() => setShowCreateEventModal(false)}
            onEventCreated={(eventId) => sendLocationRequests(eventId)}
          />
          <SelectEventModal
            isOpen={showSelectEventModal}
            onClose={() => setShowSelectEventModal(false)}
            onConfirm={(eventId) => sendLocationRequests(eventId)}
            events={userEvents}
            onCreateNew={() => {
              setShowSelectEventModal(false);
              setShowCreateEventModal(true);
            }}
          />
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Calendar, Clock, Euro, CheckCircle, XCircle, 
  Clock as ClockIcon, Trash2, CreditCard, ShoppingBag, 
  Plus, Minus, Send, Package, X, User, Mail, Phone, MapPin, Upload, FileText
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import NavbarProfileOrg from "../components/navbarProfileOrg";

// Modal pour les informations personnelles avec CIN
const InfoPersonnellesModal = ({ isOpen, onClose, onConfirm, item }) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    cin: ""
  });
  const [cinFile, setCinFile] = useState(null);
  const [cinPreview, setCinPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCinFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCinPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("nom", formData.nom);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("telephone", formData.telephone);
    formDataToSend.append("adresse", formData.adresse);
    formDataToSend.append("cin", formData.cin);
    if (cinFile) {
      formDataToSend.append("cinFile", cinFile);
    }
    
    await onConfirm(item, formData, formDataToSend);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Vos informations
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet *</label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="jean@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone *</label>
            <input
              type="tel"
              required
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="06 12 34 56 78"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Adresse de livraison</label>
            <textarea
              value={formData.adresse}
              onChange={(e) => setFormData({...formData, adresse: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Votre adresse..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Numéro CIN *</label>
            <input
              type="text"
              required
              value={formData.cin}
              onChange={(e) => setFormData({...formData, cin: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="12345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Carte d'identité (CIN) *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="cin-upload"
              />
              <label htmlFor="cin-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {cinPreview ? (
                  <div className="relative">
                    <img src={cinPreview} alt="CIN Preview" className="w-32 h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCinFile(null);
                        setCinPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Cliquez pour uploader votre CIN</span>
                    <span className="text-xs text-gray-400">JPG, PNG ou PDF (max 5MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!cinFile && !cinPreview)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Confirmer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function MesReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // État pour les quantités modifiables dans "Mes demandes"
  const [pendingQuantities, setPendingQuantities] = useState({});
  // État pour les limites de stock
  const [stockLimits, setStockLimits] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReservations();
    loadCartFromStorage();
  }, [token]);

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("reservationCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      // Charger les stocks pour les produits du panier
      loadCartStocks(JSON.parse(savedCart));
    }
  };

  // Charger les stocks pour les produits du panier
  const loadCartStocks = async (items) => {
    const stocks = { ...stockLimits };
    for (const item of items) {
      if (!stocks[item.resourceId]) {
        const stock = await fetchResourceStock(item.resourceId);
        stocks[item.resourceId] = stock;
      }
    }
    setStockLimits(stocks);
  };

  const saveCartToStorage = (items) => {
    localStorage.setItem("reservationCart", JSON.stringify(items));
    setCartItems(items);
  };

  // Récupérer le stock d'une ressource
  const fetchResourceStock = async (resourceId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ressources/get_by_id/${resourceId}`);
      return response.data.stock || 999;
    } catch (err) {
      console.error("Erreur récupération stock:", err);
      return 999;
    }
  };

  // Charger les stocks pour tous les produits
  const loadAllStocks = async () => {
    const stocks = { ...stockLimits };
    
    // Pour les produits dans le panier
    for (const item of cartItems) {
      if (!stocks[item.resourceId]) {
        stocks[item.resourceId] = await fetchResourceStock(item.resourceId);
      }
    }
    
    // Pour les produits dans les demandes
    for (const res of reservations) {
      if (res.resource?.type === "product" && res.resource?._id) {
        if (!stocks[res.resource._id]) {
          stocks[res.resource._id] = await fetchResourceStock(res.resource._id);
        }
      }
    }
    
    setStockLimits(stocks);
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/location/get_my_locations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
      
      // Initialiser les quantités pour les produits en attente
      const initialQuantities = {};
      response.data.forEach(res => {
        if (res.resource?.type === "product" && res.status === "en attente") {
          initialQuantities[res._id] = 1;
        }
      });
      setPendingQuantities(initialQuantities);
      
      // Charger les stocks après avoir les réservations
      await loadAllStocks();
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (resourceId, newQuantity) => {
    const maxStock = stockLimits[resourceId] || 999;
    
    if (newQuantity < 1) {
      removeFromCart(resourceId);
      return;
    }
    
    if (newQuantity > maxStock) {
      alert(`Stock maximum disponible: ${maxStock}`);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.resourceId === resourceId
        ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price }
        : item
    );
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (resourceId) => {
    saveCartToStorage(cartItems.filter(item => item.resourceId !== resourceId));
  };

  // Modifier la quantité dans "Mes demandes" avec vérification du stock
  const updatePendingQuantity = (reservationId, resourceId, newQuantity) => {
    const maxStock = stockLimits[resourceId] || 999;
    
    if (newQuantity < 1) return;
    if (newQuantity > maxStock) {
      alert(`Stock maximum disponible: ${maxStock}`);
      return;
    }
    
    setPendingQuantities(prev => ({
      ...prev,
      [reservationId]: newQuantity
    }));
  };

  const openInfoModal = (item) => {
    setSelectedItem(item);
    setShowInfoModal(true);
  };

  const sendProductRequest = async (cartItem, infoPersonnelles, formDataWithFile) => {
    // Vérifier le stock avant d'envoyer
    const maxStock = stockLimits[cartItem.resourceId] || 999;
    if (cartItem.quantity > maxStock) {
      alert(`Stock insuffisant. Maximum disponible: ${maxStock}`);
      return;
    }
    
    setSending(cartItem.resourceId);
    try {
      const eventsRes = await axios.get(`http://localhost:5000/api/event/user_event/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let eventId;
      if (eventsRes.data.length === 0) {
        const eventFormData = new FormData();
        eventFormData.append("title", `Commande de ${cartItem.resourceName}`);
        eventFormData.append("description", `Commande de ${cartItem.quantity} x ${cartItem.resourceName}\n\nInfos client:\nNom: ${infoPersonnelles.get("nom")}\nEmail: ${infoPersonnelles.get("email")}\nTél: ${infoPersonnelles.get("telephone")}\nAdresse: ${infoPersonnelles.get("adresse")}\nCIN: ${infoPersonnelles.get("cin")}`);
        eventFormData.append("lieu", infoPersonnelles.get("adresse") || "À définir");
        eventFormData.append("category", "autre");
        eventFormData.append("type", "privé");
        eventFormData.append("dateDebut", new Date());
        eventFormData.append("dateFin", new Date());
        eventFormData.append("nombreParticipants", 0);
        
        if (formDataWithFile?.get("cinFile")) {
          eventFormData.append("cinFile", formDataWithFile.get("cinFile"));
        }
        
        const newEvent = await axios.post("http://localhost:5000/api/event/addEvent", eventFormData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        eventId = newEvent.data._id;
      } else {
        eventId = eventsRes.data[0]._id;
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      await axios.post("http://localhost:5000/api/location/create", {
        event: eventId,
        resource: cartItem.resourceId,
        dateDebut: today.toISOString(),
        dateFin: tomorrow.toISOString(),
      }, { headers: { Authorization: `Bearer ${token}` } });

      removeFromCart(cartItem.resourceId);
      alert(`Demande pour ${cartItem.quantity} x ${cartItem.resourceName} envoyée !`);
      await fetchReservations();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSending(null);
    }
  };

  // Envoyer la demande depuis "Mes demandes"
  const sendPendingRequest = async (reservation, quantity) => {
    // Vérifier le stock avant d'envoyer
    const maxStock = stockLimits[reservation.resource._id] || 999;
    if (quantity > maxStock) {
      alert(`Stock insuffisant pour ${reservation.resource?.name}. Maximum disponible: ${maxStock}`);
      return;
    }
    
    setSending(reservation._id);
    try {
      const eventsRes = await axios.get(`http://localhost:5000/api/event/user_event/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let eventId;
      if (eventsRes.data.length === 0) {
        const newEvent = await axios.post("http://localhost:5000/api/event/addEvent", {
          title: `Commande de ${reservation.resource?.name}`,
          description: `Commande de ${quantity} x ${reservation.resource?.name}`,
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
        resource: reservation.resource._id,
        dateDebut: today.toISOString(),
        dateFin: tomorrow.toISOString(),
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert(`Demande pour ${quantity} x ${reservation.resource?.name} envoyée !`);
      await fetchReservations();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSending(null);
    }
  };

  const handleCancel = async (locationId) => {
    if (!window.confirm("Annuler cette demande ?")) return;
    setCancelling(locationId);
    try {
      await axios.delete(`http://localhost:5000/api/location/delete/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setCancelling(null);
    }
  };

  const handlePayment = (reservation) => {
    alert(`Paiement pour ${reservation.resource?.name} - ${reservation.resource?.price}€`);
  };

  const getStatusBadge = (status) => {
    const config = {
      "en attente": { bg: "bg-yellow-100", text: "text-yellow-700", icon: ClockIcon, label: "En attente" },
      "acceptée": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Acceptée" },
      "refusée": { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Refusée" }
    };
    const conf = config[status] || config["en attente"];
    const Icon = conf.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${conf.bg} ${conf.text}`}>
        <Icon size={12} /> {conf.label}
      </span>
    );
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <>
        <NavbarProfileOrg />
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarProfileOrg />
      <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Mes réservations</h1>
          </div>

          {/* SECTION 1: PRODUITS À COMMANDER (PANIER) */}
          {cartItems.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Produits à commander
                <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-sm">
                  {cartItemsCount} article(s)
                </span>
              </h2>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => {
                    const maxStock = stockLimits[item.resourceId] || 999;
                    return (
                      <div key={item.resourceId} className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📦</span>
                              <h3 className="font-semibold text-gray-900">{item.resourceName}</h3>
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Produit</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.price}€ / unité</p>
                            <p className="text-xs text-gray-400 mt-1">Stock disponible: {maxStock}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {/* + / - pour le panier avec vérification stock */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.resourceId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1.5 hover:bg-white rounded-md transition disabled:opacity-50"
                              >
                                <Minus size={16} className="text-gray-600" />
                              </button>
                              <span className="w-10 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.resourceId, item.quantity + 1)}
                                disabled={item.quantity >= maxStock}
                                className="p-1.5 hover:bg-white rounded-md transition disabled:opacity-50"
                              >
                                <Plus size={16} className="text-gray-600" />
                              </button>
                            </div>
                            <span className="font-bold text-blue-600 w-24 text-right">
                              {item.totalPrice}€
                            </span>
                            <button
                              onClick={() => openInfoModal(item)}
                              disabled={sending === item.resourceId}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                            >
                              <Send size={16} />
                              {sending === item.resourceId ? "Envoi..." : "Envoyer la demande"}
                            </button>
                            <button
                              onClick={() => removeFromCart(item.resourceId)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MES DEMANDES AVEC + ET - ET VÉRIFICATION STOCK */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-purple-600" />
            Mes demandes
            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-sm">
              {reservations.length} demande(s)
            </span>
          </h2>

          {reservations.length === 0 && cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune réservation</h3>
              <p className="text-gray-500 mb-6">Vous n'avez pas encore effectué de réservation.</p>
              <button
                onClick={() => navigate("/les_ressources")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Découvrir les ressources
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservations.map((res) => {
                const currentQuantity = pendingQuantities[res._id] || 1;
                const totalPrice = (res.resource?.price || 0) * currentQuantity;
                const maxStock = stockLimits[res.resource?._id] || 999;
                
                return (
                  <div key={res._id} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {res.resource?.type === "product" ? (
                              <span className="text-xl">📦</span>
                            ) : (
                              <span className="text-xl">⏰</span>
                            )}
                            <h3 className="font-semibold text-lg text-gray-900">
                              {res.resource?.name || "Ressource"}
                            </h3>
                          </div>
                          {getStatusBadge(res.status)}
                          {res.resource?.type === "product" && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              Produit
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Du {format(new Date(res.dateDebut), "dd/MM/yyyy", { locale: fr })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>Au {format(new Date(res.dateFin), "dd/MM/yyyy", { locale: fr })}</span>
                          </div>
                        </div>
                        {res.resource?.type === "product" && (
                          <p className="text-xs text-gray-400 mt-1">Stock disponible: {maxStock}</p>
                        )}
                        {res.event && (
                          <p className="text-xs text-gray-400 mt-2">Événement: {res.event.title}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {/* + / - pour les produits en attente avec vérification stock */}
                        {res.resource?.type === "product" && res.status === "en attente" && (
                          <>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updatePendingQuantity(res._id, res.resource._id, currentQuantity - 1)}
                                disabled={currentQuantity <= 1}
                                className="p-1.5 hover:bg-white rounded-md transition disabled:opacity-50"
                              >
                                <Minus size={16} className="text-gray-600" />
                              </button>
                              <span className="w-10 text-center font-semibold">{currentQuantity}</span>
                              <button
                                onClick={() => updatePendingQuantity(res._id, res.resource._id, currentQuantity + 1)}
                                disabled={currentQuantity >= maxStock}
                                className="p-1.5 hover:bg-white rounded-md transition disabled:opacity-50"
                              >
                                <Plus size={16} className="text-gray-600" />
                              </button>
                            </div>
                            <span className="font-bold text-blue-600 w-24 text-right">
                              {totalPrice}€
                            </span>
                          </>
                        )}
                        <div className="flex gap-2">
                          {res.resource?.type === "product" && res.status === "en attente" && (
                            <button
                              onClick={() => sendPendingRequest(res, currentQuantity)}
                              disabled={sending === res._id}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                            >
                              <Send size={16} />
                              {sending === res._id ? "Envoi..." : "Envoyer la demande"}
                            </button>
                          )}
                          {res.status === "en attente" && (
                            <button
                              onClick={() => handleCancel(res._id)}
                              disabled={cancelling === res._id}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              {cancelling === res._id ? "Annulation..." : "Annuler"}
                            </button>
                          )}
                          {res.status === "acceptée" && (
                            <button
                              onClick={() => handlePayment(res)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                            >
                              <CreditCard size={16} />
                              Payer {res.resource?.price}€
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal informations personnelles */}
      <InfoPersonnellesModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onConfirm={sendProductRequest}
        item={selectedItem}
      />
    </>
  );
}
import React, { useState, useEffect } from 'react';
import {
    Calendar, ChevronLeft, ChevronRight,
    User, Mail, Phone, Building2,
    MapPin, Euro, Edit2, Search,
    Trash2, Camera, Award, Star,
    LogOut, RefreshCw, Filter, X,
    ChevronDown, CheckCircle, Clock,
    AlertCircle, TrendingUp, Users,
    DollarSign, CalendarDays, LayoutGrid,
    List, ArrowUpRight, Eye, Calendar as CalendarIcon,
    MoreVertical, PlusCircle, History,
    Package, FolderOpen, Archive,
    ChevronRight as ChevronRightIcon,
    Bell, BellRing, Menu, ArrowLeft, Home // Ajout des icônes
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, getDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrganizerDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDayEvents, setSelectedDayEvents] = useState([]);
    const [showDayEventsModal, setShowDayEventsModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [activeTab, setActiveTab] = useState('events');

    // Nouveaux états pour les notifications et le menu mobile
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(3);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // États pour les données
    const [organizer, setOrganizer] = useState(null);
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [eventHistory, setEventHistory] = useState([]);

    // Récupérer le token et userId du localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    // Configuration axios avec token
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Charger les données au montage
    useEffect(() => {
        if (!token || !userId) {
            navigate('/login');
            return;
        }
        fetchOrganizerData();
        loadNotifications();
    }, []);

    // Charger les notifications (exemple)
    const loadNotifications = () => {
        // Exemple de notifications - à remplacer par un vrai appel API
        setNotifications([
            { id: 1, title: 'Nouvelle réservation', message: 'Salle de conférence réservée pour demain', time: '5 min', read: false, type: 'info' },
            { id: 2, title: 'Paiement reçu', message: 'Paiement de 3500€ pour l\'événement "Conférence Tech"', time: '1 heure', read: false, type: 'success' },
            { id: 3, title: 'Rappel', message: 'Événement "Team Building" dans 2 jours', time: '3 heures', read: true, type: 'warning' },
            { id: 4, title: 'Modification', message: 'La ressource "Traiteur Prestige" a été modifiée', time: '1 jour', read: true, type: 'info' },
        ]);
    };

    // Filtrer les ressources quand l'événement sélectionné change
    useEffect(() => {
        if (selectedEvent) {
            const eventResources = resources.filter(resource =>
                selectedEvent.ressources_utiliser?.includes(resource._id)
            );
            setFilteredResources(eventResources);
        } else {
            setFilteredResources(resources);
        }
    }, [selectedEvent, resources]);

    // Mettre à jour les événements du jour sélectionné
    useEffect(() => {
        const dayEvents = events.filter(event => {
            if (!event.dateDebut) return false;
            const eventDate = parseISO(event.dateDebut);
            return isSameDay(eventDate, selectedDate);
        });
        setSelectedDayEvents(dayEvents);
    }, [selectedDate, events]);

    // Filtrer l'historique des événements terminés
    useEffect(() => {
        const now = new Date();
        const history = events.filter(event => {
            if (!event.dateFin) return false;
            return isBefore(parseISO(event.dateFin), now) || event.status === 'terminé';
        });
        setEventHistory(history);
    }, [events]);

    // Fonction pour charger toutes les données
    const fetchOrganizerData = async () => {
        try {
            setLoading(true);

            const [userRes, eventsRes, resourcesRes] = await Promise.all([
                api.get(`/users/${userId}`),
                api.get(`/event/user_event/${userId}`),
                api.get('/ressources/get_all_ressources')
            ]);

            setOrganizer(userRes.data);
            setEvents(eventsRes.data);
            setResources(resourcesRes.data);
            setFilteredResources(resourcesRes.data);

        } catch (err) {
            console.error('Erreur lors du chargement:', err);
            setError('Impossible de charger les données');

            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Marquer une notification comme lue
    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Marquer toutes les notifications comme lues
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    };

    // Formater le prix
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Formater la date
    const formatDate = (date) => {
        if (!date) return 'Date non définie';
        return format(parseISO(date), 'dd MMMM yyyy', { locale: fr });
    };

    // Formater l'heure
    const formatTime = (date) => {
        if (!date) return '';
        return format(parseISO(date), 'HH:mm', { locale: fr });
    };

    // Obtenir les jours du mois pour le calendrier
    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    // Obtenir les événements pour un jour spécifique
    const getEventsForDay = (day) => {
        return events.filter(event => {
            if (!event.dateDebut) return false;
            const eventDate = parseISO(event.dateDebut);
            return isSameDay(eventDate, day);
        });
    };

    // Vérifier si un jour a des événements
    const hasEventOnDay = (day) => {
        return getEventsForDay(day).length > 0;
    };

    // Gérer le clic sur un jour
    const handleDayClick = (day) => {
        setSelectedDate(day);
        const dayEvents = getEventsForDay(day);
        if (dayEvents.length > 0) {
            setSelectedDayEvents(dayEvents);
            setShowDayEventsModal(true);
        }
    };

    // Navigation du calendrier
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
        setSelectedDate(new Date());
    };

    // Gérer la sélection d'un événement
    const handleEventSelect = (event) => {
        setSelectedEvent(selectedEvent?._id === event._id ? null : event);
        setShowDayEventsModal(false);
        setActiveTab('events');

        // Fermer le menu mobile si ouvert
        if (window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
        }
    };

    // Gérer la modification d'événement
    const handleEditEvent = (eventId) => {
        navigate(`/edit-event/${eventId}`);
    };

    // Gérer la suppression de ressource
    const handleDeleteResource = async (resourceId) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette ressource ?')) {
            try {
                await api.delete(`/resources/${resourceId}`);
                fetchOrganizerData();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
                alert('Erreur lors de la suppression');
            }
        }
    };

    // Gérer le retour à l'accueil
    const handleGoBack = () => {
        navigate('/');
    };

    // Gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Calculer les statistiques
    const getStats = () => {
        const totalBudget = resources.reduce((acc, r) => acc + (r.price || 0), 0);
        const upcomingEvents = events.filter(e => new Date(e.dateDebut) > new Date()).length;
        const completedEvents = events.filter(e => e.status === 'terminé').length;

        return { totalBudget, upcomingEvents, completedEvents };
    };

    const stats = getStats();

    // Obtenir le nom du mois en français
    const getMonthName = (date) => {
        return format(date, 'MMMM yyyy', { locale: fr });
    };

    // Composant des onglets (version responsive)
    const Tabs = () => (
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex space-x-4 sm:space-x-8 min-w-max px-2">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'events'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden xs:inline">Mes événements</span>
                    <span className="xs:hidden">Events</span>
                    {events.length > 0 && (
                        <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {events.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('resources')}
                    className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'resources'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Package size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden xs:inline">Ressources</span>
                    <span className="xs:hidden">Ress.</span>
                    {resources.length > 0 && (
                        <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {resources.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'history'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <History size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden xs:inline">Historique</span>
                    <span className="xs:hidden">Hist.</span>
                    {eventHistory.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {eventHistory.length}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center w-full max-w-md"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"
                    />
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-sm sm:text-base text-gray-600"
                    >
                        Chargement de votre profil...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="text-center bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <AlertCircle size={32} className="sm:w-10 sm:h-10 text-red-600" />
                    </div>
                    <p className="text-red-600 mb-4 sm:mb-6 text-base sm:text-lg">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 mx-auto shadow-lg text-sm sm:text-base"
                    >
                        <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Réessayer
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header responsive avec notifications et bouton retour */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Bouton retour avec design amélioré */}
                            <motion.button
                                whileHover={{ scale: 1.05, x: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGoBack}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all group"
                                title="Retour à l'accueil"
                            >
                                <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                <span className="hidden sm:inline text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                                    Retour
                                </span>
                            </motion.button>

                            {/* Titre responsive */}
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none"
                            >
                                Profile Organisateur
                            </motion.h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Bouton de notification avec design amélioré */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                                    title="Notifications"
                                >
                                    {unreadCount > 0 ? (
                                        <BellRing size={20} className="sm:w-[22px] sm:h-[22px] text-blue-600 group-hover:animate-shake" />
                                    ) : (
                                        <Bell size={20} className="sm:w-[22px] sm:h-[22px] text-gray-600 group-hover:text-blue-600 transition-colors" />
                                    )}
                                    {unreadCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg"
                                        >
                                            {unreadCount}
                                        </motion.span>
                                    )}
                                </motion.button>

                                {/* Panneau des notifications amélioré */}
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                                        >
                                            <div className="p-3 sm:p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                                                    <Bell size={16} className="text-blue-600" />
                                                    Notifications
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllAsRead}
                                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 bg-white rounded-lg shadow-sm hover:shadow transition-all"
                                                    >
                                                        Tout marquer
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif) => (
                                                        <motion.div
                                                            key={notif.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className={`p-3 sm:p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all ${!notif.read ? 'bg-blue-50/30' : ''
                                                                }`}
                                                            onClick={() => markAsRead(notif.id)}
                                                        >
                                                            <div className="flex items-start gap-2 sm:gap-3">
                                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${notif.type === 'success' ? 'bg-green-100' :
                                                                    notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                                                                    }`}>
                                                                    {notif.type === 'success' ? <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-600" /> :
                                                                        notif.type === 'warning' ? <AlertCircle size={16} className="sm:w-5 sm:h-5 text-yellow-600" /> :
                                                                            <Bell size={16} className="sm:w-5 sm:h-5 text-blue-600" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                                                        {notif.title}
                                                                    </p>
                                                                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 line-clamp-2">
                                                                        {notif.message}
                                                                    </p>
                                                                    <p className="text-gray-400 text-[8px] sm:text-[10px] mt-1">
                                                                        il y a {notif.time}
                                                                    </p>
                                                                </div>
                                                                {!notif.read && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1"
                                                                    />
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500 text-sm">
                                                        <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                                                        Aucune notification
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 border-t border-gray-100 bg-gray-50">
                                                <button className="w-full text-center text-xs sm:text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                                    Voir toutes les notifications
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bouton Nouvel événement avec design amélioré */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/CreerEvenement')}
                                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium group"
                            >
                                <PlusCircle size={16} className="sm:w-[18px] sm:h-[18px] group-hover:rotate-90 transition-transform" />
                                <span className="hidden md:inline">Nouvel événement</span>
                                <span className="md:hidden">Nouveau</span>
                            </motion.button>

                            {/* Bouton menu mobile */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Menu size={20} />
                            </motion.button>

                            {/* Bouton déconnexion avec design amélioré */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-red-600 transition-all rounded-xl hover:bg-red-50 text-xs sm:text-sm font-medium group"
                                title="Déconnexion"
                            >
                                <LogOut size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
                                <span className="hidden md:inline">Déconnexion</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Menu mobile amélioré */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden mt-4 space-y-2 border-t border-gray-100 pt-4"
                            >
                                <button
                                    onClick={() => {
                                        navigate('/creer-evenement');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                                >
                                    <PlusCircle size={18} />
                                    Nouvel événement
                                </button>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
                                >
                                    <LogOut size={18} />
                                    Déconnexion
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Main Content responsive */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">

                {/* Section Profil + Calendrier responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Carte Profil responsive avec design amélioré */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 h-full hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col items-center">
                                {/* Photo de profil responsive avec animation */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative mb-3 sm:mb-4 cursor-pointer"
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg">
                                        {organizer?.image ? (
                                            <img
                                                src={`http://localhost:5000/${organizer.image}`}
                                                alt={`${organizer.firstname} ${organizer.lastname}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                                <User size={28} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full border-2 sm:border-4 border-white ${organizer?.status === 'valide' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                    />
                                </motion.div>

                                {/* Informations responsive */}
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center">
                                    {organizer?.firstname} {organizer?.lastname}
                                </h2>
                                <p className="text-sm sm:text-base text-blue-600 font-medium flex items-center gap-1 mt-0.5 sm:mt-1">
                                    <Award size={14} className="sm:w-4 sm:h-4" />
                                    Organisateur
                                </p>

                                {/* Contacts responsive avec design amélioré */}
                                <div className="w-full mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <Mail size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{organizer?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-green-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                            <Phone size={14} className="sm:w-4 sm:h-4 text-green-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{organizer?.numTel || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-purple-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                            <Building2 size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{organizer?.region || 'Région non renseignée'}</span>
                                    </div>
                                </div>

                                {/* Stats rapides responsive avec design amélioré */}
                                <div className="w-full grid grid-cols-3 gap-1 sm:gap-2 mt-4 sm:mt-6">
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-blue-600">{events.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Événements</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-purple-600">{resources.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Ressources</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-green-600">{eventHistory.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Historique</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Calendrier interactif responsive avec design amélioré */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            {/* En-tête du calendrier responsive */}
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                                        <CalendarIcon className="text-blue-600" size={18} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <span className="hidden xs:inline">Agenda des événements</span>
                                    <span className="xs:hidden">Agenda</span>
                                </h3>
                                <div className="flex items-center gap-1 sm:gap-2 w-full xs:w-auto">
                                    {/* Bouton Aujourd'hui amélioré */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={goToToday}
                                        className="flex-1 xs:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2 group"
                                    >
                                        <Home size={14} className="sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
                                        <span>Aujourd'hui</span>
                                    </motion.button>
                                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={prevMonth}
                                            className="p-1.5 sm:p-2 bg-white rounded-lg hover:bg-gray-200 shadow-sm transition-all"
                                            title="Mois précédent"
                                        >
                                            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={nextMonth}
                                            className="p-1.5 sm:p-2 bg-white rounded-lg hover:bg-gray-200 shadow-sm transition-all"
                                            title="Mois suivant"
                                        >
                                            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Mois et année avec animation */}
                            <motion.h4
                                key={currentMonth.toString()}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                            >
                                {getMonthName(currentMonth)}
                            </motion.h4>

                            {/* Jours de la semaine */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                    <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Grille du calendrier responsive */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: (getDay(startOfMonth(currentMonth)) + 6) % 7 }).map((_, i) => (
                                    <div key={`empty-${i}`} className="p-1 sm:p-3" />
                                ))}

                                {getDaysInMonth().map((day, index) => {
                                    const dayEvents = getEventsForDay(day);
                                    const hasEvents = dayEvents.length > 0;
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDayClick(day)}
                                            className={`
                                                relative p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium
                                                ${isSelected ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105' : ''}
                                                ${!isSelected && isTodayDate ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                                                ${!isSelected && !isTodayDate && hasEvents ? 'bg-blue-50 hover:bg-blue-100' : ''}
                                                ${!isSelected && !isTodayDate && !hasEvents ? 'hover:bg-gray-100' : ''}
                                            `}
                                        >
                                            <span>{format(day, 'd')}</span>

                                            {hasEvents && !isSelected && (
                                                <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                                    {dayEvents.slice(0, 3).map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Événements du jour responsive avec design amélioré */}
                            <div className="mt-4 sm:mt-6">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1 sm:gap-2">
                                        <Calendar size={12} className="sm:w-3 sm:h-3" />
                                        <span className="truncate max-w-[120px] xs:max-w-[200px] sm:max-w-none">
                                            {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                                        </span>
                                    </h4>
                                    {selectedDayEvents.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-[10px] sm:text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm"
                                        >
                                            {selectedDayEvents.length}
                                        </motion.span>
                                    )}
                                </div>

                                <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                                    {selectedDayEvents.length > 0 ? (
                                        selectedDayEvents.slice(0, 2).map((event, index) => (
                                            <motion.div
                                                key={event._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                onClick={() => handleEventSelect(event)}
                                                className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg cursor-pointer border border-blue-100 hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-[8px] sm:text-xs flex-shrink-0">
                                                        {event.category === 'Mariage' ? '💒' : '📅'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-[10px] sm:text-xs truncate">
                                                            {event.title}
                                                        </p>
                                                        <p className="text-[8px] sm:text-[10px] text-gray-500">
                                                            {formatTime(event.dateDebut)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-xs sm:text-sm text-gray-400 text-center py-2 sm:py-4">
                                            Aucun événement ce jour
                                        </p>
                                    )}

                                    {selectedDayEvents.length > 2 && (
                                        <button
                                            onClick={() => setShowDayEventsModal(true)}
                                            className="w-full text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium py-0.5 sm:py-1 hover:underline transition-all"
                                        >
                                            +{selectedDayEvents.length - 2} autres événements
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Onglets et contenu responsive - le reste du code avec adaptations responsives */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
                    <Tabs />

                    <AnimatePresence mode="wait">
                        {activeTab === 'events' && (
                            <motion.div
                                key="events"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* En-tête responsive */}
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <h2 className="text-base sm:text-xl font-bold text-gray-900">
                                            Mes événements
                                        </h2>

                                        {/* Toggle view mode responsive */}
                                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg sm:rounded-xl">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setViewMode('grid')}
                                                className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <LayoutGrid size={14} className="sm:w-4 sm:h-4" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setViewMode('list')}
                                                className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <List size={14} className="sm:w-4 sm:h-4" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedEvent(null)}
                                        className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-blue-600 bg-blue-50 rounded-lg sm:rounded-xl hover:bg-blue-100 text-xs sm:text-sm font-medium transition-all"
                                    >
                                        <Filter size={14} className="sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Tous les événements</span>
                                        <span className="xs:hidden">Tous</span>
                                    </motion.button>
                                </div>

                                {/* Grille des événements responsive */}
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                        {events.map((event, index) => {
                                            const totalPrice = event.ressources_utiliser?.reduce((acc, resId) => {
                                                const resource = resources.find(r => r._id === resId);
                                                return acc + (resource?.price || 0);
                                            }, 0) || 0;

                                            return (
                                                <motion.div
                                                    key={event._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ y: -5 }}
                                                    onClick={() => handleEventSelect(event)}
                                                    className={`
                                                        relative bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-3 sm:p-5 
                                                        transition-all duration-300 border-2 cursor-pointer overflow-hidden
                                                        ${selectedEvent?._id === event._id
                                                            ? 'border-blue-500 shadow-2xl'
                                                            : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'}
                                                    `}
                                                >
                                                    {/* Effet de brillance */}
                                                    <motion.div
                                                        initial={{ x: '-100%' }}
                                                        animate={{ x: hoveredCard === event._id ? '100%' : '-100%' }}
                                                        transition={{ duration: 0.8 }}
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                                    />

                                                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">
                                                        {event.category === 'Mariage' ? '💒' :
                                                            event.category === 'Conference' ? '🎤' :
                                                                event.category === 'Anniversaire' ? '🎂' : '📚'}
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base truncate">
                                                        {event.title}
                                                    </h3>

                                                    <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                                                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                                            <Calendar size={10} className="sm:w-3 sm:h-3" />
                                                            <span className="truncate">{formatDate(event.dateDebut)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                                            <MapPin size={10} className="sm:w-3 sm:h-3" />
                                                            <span className="truncate">{event.lieu || 'Lieu non défini'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-blue-600">
                                                            <Euro size={12} className="sm:w-3 sm:h-3" />
                                                            <span className="text-[10px] sm:text-sm">{formatPrice(totalPrice)}</span>
                                                        </div>
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditEvent(event._id);
                                                        }}
                                                        className="w-full flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-medium hover:shadow-lg transition-all group"
                                                    >
                                                        <Edit2 size={12} className="sm:w-3 sm:h-3 group-hover:rotate-12 transition-transform" />
                                                        Modifier
                                                    </motion.button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3">
                                        {events.map((event, index) => (
                                            <motion.div
                                                key={event._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ x: 5 }}
                                                onClick={() => handleEventSelect(event)}
                                                className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-blue-50 transition-all group"
                                            >
                                                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">
                                                        {event.category === 'Mariage' ? '💒' : '📅'}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                                                            {formatDate(event.dateDebut)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 ml-2">
                                                    <span className="text-blue-600 font-bold text-[10px] sm:text-sm whitespace-nowrap">
                                                        {formatPrice(event.ressources_utiliser?.reduce((acc, resId) => {
                                                            const resource = resources.find(r => r._id === resId);
                                                            return acc + (resource?.price || 0);
                                                        }, 0) || 0)}
                                                    </span>
                                                    <Edit2 size={12} className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {events.length === 0 && (
                                    <div className="text-center py-8 sm:py-16">
                                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <Calendar size={24} className="sm:w-10 sm:h-10 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">Aucun événement trouvé</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/creer-evenement')}
                                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium"
                                        >
                                            Créer un événement
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Section Ressources responsive */}
                        {activeTab === 'resources' && (
                            <motion.div
                                key="resources"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Package size={16} className="sm:w-5 sm:h-5 text-purple-600" />
                                        <span className="hidden xs:inline">Ressources disponibles</span>
                                        <span className="xs:hidden">Ressources</span>
                                    </h2>

                                    {/* Barre de recherche responsive */}
                                    <div className="relative w-full xs:w-auto">
                                        <Search size={14} className="sm:w-4 sm:h-4 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full xs:w-48 sm:w-64 pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Grille des ressources responsive */}
                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                    {resources
                                        .filter(resource =>
                                            resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            resource.type?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .slice(0, 6) // Limiter pour la démo
                                        .map((resource, index) => {
                                            const associatedEvent = events.find(event =>
                                                event.ressources_utiliser?.includes(resource._id)
                                            );

                                            return (
                                                <motion.div
                                                    key={resource._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ y: -5 }}
                                                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-200 hover:shadow-xl transition-all group"
                                                >
                                                    <div className="flex flex-col xs:flex-row items-start gap-2 sm:gap-4">
                                                        <div className="w-full xs:w-12 sm:w-16 h-24 xs:h-12 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group-hover:shadow-md transition-all">
                                                            {resource.media && resource.media.length > 0 ? (
                                                                <img
                                                                    src={`http://localhost:5000/${resource.media[0].img_vd?.[0] || resource.media[0]}`}
                                                                    alt={resource.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Camera size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
                                                                {resource.name}
                                                            </h3>
                                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2">
                                                                {resource.description?.substring(0, 60)}...
                                                            </p>

                                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                                                                <span className="px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] sm:text-xs">
                                                                    {resource.type}
                                                                </span>
                                                                <span className="text-xs sm:text-sm font-bold text-green-600">
                                                                    {formatPrice(resource.price)}
                                                                </span>
                                                            </div>

                                                            <p className="text-[8px] sm:text-xs text-gray-500 mt-2 truncate">
                                                                {associatedEvent?.title || 'Non assigné'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            </motion.div>
                        )}

                        {/* Section Historique responsive */}
                        {activeTab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                                        <History size={16} className="sm:w-5 sm:h-5 text-gray-600" />
                                    </div>
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900">
                                        Historique
                                    </h2>
                                </div>

                                {eventHistory.length > 0 ? (
                                    <div className="space-y-2 sm:space-y-4">
                                        {eventHistory.slice(0, 5).map((event, index) => (
                                            <motion.div
                                                key={event._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                                                            <Archive size={14} className="sm:w-5 sm:h-5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
                                                                {event.title}
                                                            </h3>
                                                            <p className="text-[10px] sm:text-xs text-gray-600 mt-1 line-clamp-2">
                                                                {event.description}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-[8px] sm:text-xs text-gray-500">
                                                                <span className="flex items-center gap-0.5 sm:gap-1">
                                                                    <Calendar size={8} className="sm:w-3 sm:h-3" />
                                                                    {formatDate(event.dateDebut)}
                                                                </span>
                                                                <span className="px-1 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                                    Terminé
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRightIcon size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-16 bg-white rounded-xl sm:rounded-2xl">
                                        <History size={32} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                                        <p className="text-gray-500 text-xs sm:text-sm">Aucun historique</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Modal des événements du jour responsive */}
                <AnimatePresence>
                    {showDayEventsModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowDayEventsModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden mx-3 sm:mx-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-base sm:text-xl font-bold text-gray-900">
                                            {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                                        </h3>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowDayEventsModal(false)}
                                            className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl transition-all"
                                        >
                                            <X size={16} className="sm:w-5 sm:h-5" />
                                        </motion.button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        {selectedDayEvents.length} événement(s) planifié(s)
                                    </p>
                                </div>

                                <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                                    <div className="space-y-2 sm:space-y-3">
                                        {selectedDayEvents.map((event, index) => (
                                            <motion.div
                                                key={event._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                                className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition-all"
                                                onClick={() => {
                                                    handleEventSelect(event);
                                                    setShowDayEventsModal(false);
                                                }}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-base sm:text-xl flex-shrink-0">
                                                        {event.category === 'Mariage' ? '💒' : '📅'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{event.title}</h4>
                                                        <p className="text-[10px] sm:text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                                                        <div className="flex items-center gap-2 sm:gap-4 mt-2 text-[8px] sm:text-xs text-gray-500">
                                                            <span className="flex items-center gap-0.5 sm:gap-1">
                                                                <Clock size={8} className="sm:w-3 sm:h-3" />
                                                                {formatTime(event.dateDebut)}
                                                            </span>
                                                            <span className="flex items-center gap-0.5 sm:gap-1">
                                                                <MapPin size={8} className="sm:w-3 sm:h-3" />
                                                                <span className="truncate max-w-[100px] sm:max-w-[150px]">
                                                                    {event.lieu || 'Lieu non défini'}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowDayEventsModal(false)}
                                        className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:shadow-lg transition-all"
                                    >
                                        Fermer
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Ajout des animations personnalisées dans le CSS global */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg); }
                    10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
                    20%, 40%, 60%, 80% { transform: rotate(5deg); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
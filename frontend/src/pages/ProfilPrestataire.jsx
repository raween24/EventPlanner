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
    Bell, BellRing, Menu, ArrowLeft, Home,
    FileText, Upload, Download, CheckSquare,
    Clock as ClockIcon, CheckCircle as CheckCircleIcon,
    XCircle, AlertTriangle, File, Image as ImageIcon,
    Layers
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, getDay, addMonths, subMonths, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilPres() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedDayDetails, setSelectedDayDetails] = useState([]);
    const [showDayDetailsModal, setShowDayDetailsModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [activeTab, setActiveTab] = useState('resources');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedResourceFilter, setSelectedResourceFilter] = useState('all');

    // Nouveaux états
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // États pour les données
    const [provider, setProvider] = useState(null);
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [requests, setRequests] = useState([]);
    const [documents, setDocuments] = useState([]);

    // États pour les disponibilités
    const [allAvailability, setAllAvailability] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [showAddAvailability, setShowAddAvailability] = useState(false);
    const [newAvailability, setNewAvailability] = useState({
        resourceId: '',
        start: null,
        end: null,
        status: 'available'
    });

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
        fetchProviderData();
        loadNotifications();
        loadMockData();
    }, []);

    // Charger les données mockées pour la démo
    const loadMockData = () => {
        setRequests([
            {
                id: 1,
                resourceName: 'Salle de conférence A',
                clientName: 'Sophie Martin',
                eventName: 'Conférence Tech 2026',
                dateDebut: '2026-04-15T09:00:00',
                dateFin: '2026-04-15T18:00:00',
                status: 'en_attente',
                price: 3500,
                message: 'Besoin d\'un vidéoprojecteur supplémentaire',
                resourceId: 1
            },
            {
                id: 2,
                resourceName: 'Traiteur Prestige',
                clientName: 'Jean Dupont',
                eventName: 'Mariage de Jean et Marie',
                dateDebut: '2026-05-20T12:00:00',
                dateFin: '2026-05-20T23:00:00',
                status: 'confirmé',
                price: 5200,
                message: 'Menu végétarien pour 30 personnes',
                resourceId: 2
            },
            {
                id: 3,
                resourceName: 'Décoration Florale',
                clientName: 'Marie Lambert',
                eventName: 'Anniversaire 50 ans',
                dateDebut: '2026-04-10T14:00:00',
                dateFin: '2026-04-10T22:00:00',
                status: 'refusé',
                price: 1200,
                message: 'Thème champêtre',
                resourceId: 3
            }
        ]);

        setDocuments([
            { id: 1, name: 'Devis - Salle de conférence.pdf', type: 'pdf', size: '2.4 MB', date: '2026-03-15', status: 'validé' },
            { id: 2, name: 'Contrat prestation.docx', type: 'doc', size: '1.1 MB', date: '2026-03-10', status: 'en_attente' },
            { id: 3, name: 'Facture Traiteur.pdf', type: 'pdf', size: '1.8 MB', date: '2026-03-05', status: 'validé' },
            { id: 4, name: 'Photo salle principale.jpg', type: 'image', size: '3.2 MB', date: '2026-03-01', status: 'validé' },
            { id: 5, name: 'Certification qualité.pdf', type: 'pdf', size: '0.8 MB', date: '2026-02-28', status: 'refusé' }
        ]);
    };

    // Charger les notifications
    const loadNotifications = () => {
        setNotifications([]);
    };

    // Filtrer les ressources par recherche
    useEffect(() => {
        if (searchTerm) {
            const filtered = resources.filter(resource =>
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.type?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredResources(filtered);
        } else {
            setFilteredResources(resources);
        }
    }, [searchTerm, resources]);

    // Extraire toutes les disponibilités des ressources
    useEffect(() => {
        if (resources.length > 0) {
            const availabilityList = [];
            resources.forEach(resource => {
                if (resource.availability && resource.availability.length > 0) {
                    resource.availability.forEach(avail => {
                        availabilityList.push({
                            ...avail,
                            resourceId: resource._id,
                            resourceName: resource.name,
                            resourceType: resource.type
                        });
                    });
                }
            });
            setAllAvailability(availabilityList);
        }
    }, [resources]);

    // Fonction pour charger toutes les données
    // Fonction pour charger toutes les données
    const fetchProviderData = async () => {
        try {
            setLoading(true);

            // Récupérer d'abord les informations du prestataire
            const userRes = await api.get(`/users/${userId}`);
            setProvider(userRes.data);

            // Récupérer les ressources avec leurs disponibilités
            const resourcesRes = await api.get('/ressources/res_user');
            console.log('Données reçues:', resourcesRes.data); // Pour vérifier les données

            setResources(resourcesRes.data);
            setFilteredResources(resourcesRes.data);

            // Extraire toutes les disponibilités des ressources
            const availabilityList = [];
            resourcesRes.data.forEach(resource => {
                if (resource.availability && resource.availability.length > 0) {
                    resource.availability.forEach(avail => {
                        availabilityList.push({
                            ...avail,
                            resourceId: resource._id,
                            resourceName: resource.name,
                            resourceType: resource.type
                        });
                    });
                }
            });

            console.log('Disponibilités extraites:', availabilityList); // Pour vérifier
            setAllAvailability(availabilityList);

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

    // Formater le prix
    const formatPrice = (price) => {
        if (!price) return '0 €';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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

    // Gérer les demandes de réservation
    const handleRequestAction = (requestId, action) => {
        setRequests(prev =>
            prev.map(req =>
                req.id === requestId
                    ? { ...req, status: action === 'accept' ? 'confirmé' : 'refusé' }
                    : req
            )
        );
    };

    // Gérer l'upload de document
    const handleDocumentUpload = () => {
        alert('Fonctionnalité d\'upload à implémenter');
    };

    // Gérer la suppression de document
    const handleDocumentDelete = (docId) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce document ?')) {
            setDocuments(prev => prev.filter(doc => doc.id !== docId));
        }
    };

    // Gérer l'ajout de disponibilité
    const handleAddAvailability = () => {
        if (newAvailability.resourceId && newAvailability.start && newAvailability.end) {
            alert(`Disponibilité ajoutée pour la ressource ${newAvailability.resourceId}`);
            setShowAddAvailability(false);
            setNewAvailability({ resourceId: '', start: null, end: null, status: 'available' });
        }
    };

    // Obtenir les disponibilités pour un jour spécifique
    // Obtenir les disponibilités pour un jour spécifique
    const getAvailabilityForDay = (day) => {
        if (!allAvailability || allAvailability.length === 0) {
            return [];
        }

        // Formater le jour pour la comparaison (ignorer l'heure)
        const dayStr = format(day, 'yyyy-MM-dd');

        return allAvailability.filter(avail => {
            if (!avail.date_deb || !avail.date_fin) return false;

            try {
                // Formater les dates de début et fin
                const startStr = format(parseISO(avail.date_deb), 'yyyy-MM-dd');
                const endStr = format(parseISO(avail.date_fin), 'yyyy-MM-dd');

                // Vérifier si le jour est entre start et end (inclus)
                return dayStr >= startStr && dayStr <= endStr;
            } catch (error) {
                console.error('Erreur de parsing:', error);
                return false;
            }
        });
    };

    // Obtenir les disponibilités pour un jour spécifique (filtré par ressource)
    // Obtenir les disponibilités pour un jour spécifique (filtré par ressource)
    const getAvailabilityForDayFiltered = (day) => {
        if (!allAvailability || allAvailability.length === 0) {
            return [];
        }

        let filtered = allAvailability;
        if (selectedResourceFilter !== 'all') {
            filtered = filtered.filter(avail => avail.resourceId === selectedResourceFilter);
        }

        // Formater le jour pour la comparaison
        const dayStr = format(day, 'yyyy-MM-dd');

        return filtered.filter(avail => {
            if (!avail.date_deb || !avail.date_fin) return false;

            try {
                const startStr = format(parseISO(avail.date_deb), 'yyyy-MM-dd');
                const endStr = format(parseISO(avail.date_fin), 'yyyy-MM-dd');

                return dayStr >= startStr && dayStr <= endStr;
            } catch (error) {
                return false;
            }
        });
    };
    // Ajoutez ce useEffect temporaire pour voir les disponibilités chargées
    useEffect(() => {
        if (allAvailability.length > 0) {
            console.log('✅ Disponibilités chargées:', allAvailability.length);

            // Test pour le 22 mars 2026
            const testDate = new Date('2026-03-22');
            const availForTest = getAvailabilityForDay(testDate);
            console.log('📅 Disponibilités pour le 22/03/2026:', availForTest);

            const unavailableForTest = availForTest.filter(a => a.satut_disp === false);
            console.log('❌ Indisponibilités pour le 22/03/2026:', unavailableForTest);
        } else {
            console.log('❌ Aucune disponibilité chargée');
        }
    }, [allAvailability]);

    // Obtenir le statut de disponibilité pour un jour
    const getDayAvailabilityStatus = (day) => {
        const dayAvail = getAvailabilityForDayFiltered(day);
        if (dayAvail.length === 0) return null;
        const hasUnavailable = dayAvail.some(a => a.satut_disp === false);
        return hasUnavailable ? 'unavailable' : null;
    };

    // Obtenir le nombre de ressources disponibles/indisponibles pour un jour
    // Obtenir le nombre de ressources disponibles/indisponibles pour un jour
    const getDayStats = (day) => {
        const dayAvail = getAvailabilityForDay(day);
        const available = dayAvail.filter(a => a.satut_disp === true).length;
        const unavailable = dayAvail.filter(a => a.satut_disp === false).length;
        return { available, unavailable, total: dayAvail.length };
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

    // Gérer le clic sur un jour

    const handleDayClick = (day) => {
        setSelectedDate(day);
        const dayAvailability = getAvailabilityForDay(day);
        const unavailableOnly = dayAvailability.filter(avail => avail.satut_disp === false);

        if (unavailableOnly.length > 0) {
            const groupedByResource = {};
            unavailableOnly.forEach(avail => {
                const resourceId = avail.resourceId;
                if (!groupedByResource[resourceId]) {
                    groupedByResource[resourceId] = {
                        resourceId,
                        resourceName: avail.resourceName,
                        resourceType: avail.resourceType,
                        availabilities: []
                    };
                }
                groupedByResource[resourceId].availabilities.push(avail);
            });
            setSelectedDayDetails(Object.values(groupedByResource));
            setShowDayDetailsModal(true);
        } else {
            setSelectedDayDetails([]);
            setShowDayDetailsModal(true);
        }
    };

    // Gérer la modification de ressource
    const handleEditResource = (resourceId) => {
        navigate(`/edit-resource/${resourceId}`);
    };

    // Gérer la suppression de ressource
    const handleDeleteResource = async (resourceId) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette ressource ?')) {
            try {
                await api.delete(`/ressources/dell/${resourceId}`);
                setResources(prev => prev.filter(r => r._id !== resourceId));
                setFilteredResources(prev => prev.filter(r => r._id !== resourceId));
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
        const totalRevenue = resources.reduce((acc, r) => acc + (r.price || 0), 0);
        const pendingRequests = requests.filter(r => r.status === 'en_attente').length;
        const totalDocuments = documents.length;
        return { totalRevenue, pendingRequests, totalDocuments };
    };

    const stats = getStats();

    // Obtenir le nom du mois en français
    const getMonthName = (date) => {
        return format(date, 'MMMM yyyy', { locale: fr });
    };

    // Obtenir les jours du mois
    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    // Composant des onglets
    const Tabs = () => (
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex space-x-4 sm:space-x-8 min-w-max px-2">
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'resources'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Package size={16} />
                    <span className="hidden xs:inline">Mes ressources</span>
                    <span className="xs:hidden">Ress.</span>
                    {resources.length > 0 && (
                        <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {resources.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'requests'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <ClockIcon size={16} />
                    <span className="hidden xs:inline">Demandes</span>
                    <span className="xs:hidden">Dem.</span>
                    {requests.filter(r => r.status === 'en_attente').length > 0 && (
                        <span className="bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {requests.filter(r => r.status === 'en_attente').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'documents'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText size={16} />
                    <span className="hidden xs:inline">Documents</span>
                    <span className="xs:hidden">Docs</span>
                    {documents.filter(d => d.status === 'en_attente').length > 0 && (
                        <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {documents.filter(d => d.status === 'en_attente').length}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );

    // Composant pour le badge de statut
    const StatusBadge = ({ status }) => {
        const config = {
            'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ClockIcon, label: 'En attente' },
            'confirmé': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Confirmé' },
            'validé': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Validé' },
            'refusé': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Refusé' },
            'available': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Disponible' },
            'unavailable': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Indisponible' }
        };
        const conf = config[status] || config['en_attente'];
        const Icon = conf.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${conf.bg} ${conf.text}`}>
                <Icon size={12} />
                {conf.label}
            </span>
        );
    };

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
                        <RefreshCw size={16} />
                        Réessayer
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-4">
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
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none"
                            >
                                Espace Prestataire
                            </motion.h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Notifications */}
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
                                                {notifications.map((notif) => (
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
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {/* Bouton Ajouter ressource */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/add-resource')}
                                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium group"
                            >
                                <PlusCircle size={16} className="sm:w-[18px] sm:h-[18px] group-hover:rotate-90 transition-transform" />
                                <span className="hidden md:inline">Nouvelle ressource</span>
                                <span className="md:hidden">Nouveau</span>
                            </motion.button>
                            {/* Menu mobile */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Menu size={20} />
                            </motion.button>
                            {/* Déconnexion */}
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
                    {/* Menu mobile déroulant */}
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
                                        navigate('/add-resource');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                                >
                                    <PlusCircle size={18} />
                                    Nouvelle ressource
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Section Profil + Calendrier */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Carte Profil */}
                    <motion.div whileHover={{ y: -5 }} className="lg:col-span-1">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 h-full hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col items-center">
                                <motion.div whileHover={{ scale: 1.05 }} className="relative mb-3 sm:mb-4 cursor-pointer">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg">
                                        {provider?.image ? (
                                            <img
                                                src={`http://localhost:5000/${provider.image}`}
                                                alt={`${provider.firstname} ${provider.lastname}`}
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
                                        className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full border-2 sm:border-4 border-white ${provider?.status === 'valide' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                    />
                                </motion.div>
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center">
                                    {provider?.firstname} {provider?.lastname}
                                </h2>
                                <p className="text-sm sm:text-base text-blue-600 font-medium flex items-center gap-1 mt-0.5 sm:mt-1">
                                    <Award size={14} className="sm:w-4 sm:h-4" />
                                    Prestataire
                                </p>
                                <div className="w-full mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <Mail size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{provider?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-green-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                            <Phone size={14} className="sm:w-4 sm:h-4 text-green-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{provider?.numTel || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-purple-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                            <Building2 size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{provider?.region || 'Région non renseignée'}</span>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-3 gap-1 sm:gap-2 mt-4 sm:mt-6">
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-purple-600">{resources.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Ressources</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-yellow-600">{stats.pendingRequests}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Demandes</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-blue-600">{stats.totalDocuments}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Documents</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Calendrier */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            {/* En-tête */}
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                                        <CalendarIcon className="text-blue-600" size={18} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Disponibilités des ressources
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 w-full xs:w-auto">
                                    <select
                                        value={selectedResourceFilter}
                                        onChange={(e) => setSelectedResourceFilter(e.target.value)}
                                        className="px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="all">Toutes les ressources</option>
                                        {resources.map(r => (
                                            <option key={r._id} value={r._id}>{r.name}</option>
                                        ))}
                                    </select>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={goToToday}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1 group"
                                    >
                                        <Home size={14} className="group-hover:rotate-12 transition-transform" />
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
                                            <ChevronLeft size={16} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={nextMonth}
                                            className="p-1.5 sm:p-2 bg-white rounded-lg hover:bg-gray-200 shadow-sm transition-all"
                                            title="Mois suivant"
                                        >
                                            <ChevronRight size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Légende */}
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                                    <span className="text-gray-600">Pas d'indisponibilité</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-600">Indisponibilité(s)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Jour sélectionné</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-gray-500" />
                                    <span className="text-gray-600">Plusieurs ressources</span>
                                </div>
                            </div>


                            {/* Mois et année */}
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

                            {/* Grille du calendrier */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: (getDay(startOfMonth(currentMonth)) + 6) % 7 }).map((_, i) => (
                                    <div key={`empty-${i}`} className="p-1 sm:p-3" />
                                ))}
                                {getDaysInMonth().map((day, index) => {
                                    const availabilityStatus = getDayAvailabilityStatus(day);
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isTodayDate = isToday(day);
                                    const stats = getDayStats(day);
                                    const unavailableCount = stats.unavailable;

                                    return (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDayClick(day)}
                                            className={`
                                                relative p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium
                                                ${isSelected ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105' : ''}
                                                ${!isSelected && availabilityStatus === 'unavailable' ? 'bg-red-100 hover:bg-red-200 text-red-800' : ''}
                                                ${!isSelected && !availabilityStatus && isTodayDate ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                                                ${!isSelected && !availabilityStatus && !isTodayDate ? 'hover:bg-gray-100 bg-white' : ''}
                                            `}
                                        >
                                            <span>{format(day, 'd')}</span>
                                            {unavailableCount > 0 && (
                                                <div className="absolute -top-1 -right-1">
                                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-medium text-white">
                                                        {unavailableCount}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Statistiques du jour */}
                           
                        </div>
                    </motion.div>
                </div>

                {/* Onglets */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
                    <Tabs />
                    <AnimatePresence mode="wait">
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
                                        <Package size={20} className="text-purple-600" />
                                        Mes ressources
                                    </h2>
                                    <div className="relative w-full xs:w-64">
                                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        />
                                    </div>
                                </div>
                                {filteredResources.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredResources.map((resource, index) => (
                                            <motion.div
                                                key={resource._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ y: -5 }}
                                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                                            >
                                                <div className="relative h-40 bg-gray-100">
                                                    {resource.media && resource.media.length > 0 ? (
                                                        <img
                                                            src={`http://localhost:5000/${resource.media[0].img_vd?.[0] || resource.media[0]}`}
                                                            alt={resource.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon size={40} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                                                            {resource.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-2 truncate">
                                                        {resource.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {resource.description}
                                                    </p>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-lg font-bold text-blue-600">
                                                            {formatPrice(resource.price)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {resource.location || 'Lieu non défini'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleEditResource(resource._id)}
                                                            className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
                                                        >
                                                            <Edit2 size={14} />
                                                            Modifier
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleDeleteResource(resource._id)}
                                                            className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                            Supprimer
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500 mb-4">Aucune ressource trouvée</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/add-resource')}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl"
                                        >
                                            Ajouter une ressource
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'requests' && (
                            <motion.div
                                key="requests"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                    <ClockIcon size={20} className="text-yellow-600" />
                                    Demandes de réservation
                                </h2>
                                {requests.length > 0 ? (
                                    <div className="space-y-3">
                                        {requests.map((request, index) => (
                                            <motion.div
                                                key={request.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.01 }}
                                                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${request.status === 'en_attente' ? 'bg-yellow-100' :
                                                            request.status === 'confirmé' ? 'bg-green-100' : 'bg-red-100'
                                                            }`}>
                                                            {request.status === 'en_attente' ? <Clock size={20} className="text-yellow-600" /> :
                                                                request.status === 'confirmé' ? <CheckCircle size={20} className="text-green-600" /> :
                                                                    <XCircle size={20} className="text-red-600" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{request.resourceName}</h3>
                                                            <p className="text-sm text-gray-600 mt-1">{request.eventName}</p>
                                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <User size={12} />
                                                                    {request.clientName}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar size={12} />
                                                                    {formatDate(request.dateDebut)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={12} />
                                                                    {formatTime(request.dateDebut)} - {formatTime(request.dateFin)}
                                                                </span>
                                                            </div>
                                                            {request.message && (
                                                                <p className="text-xs text-gray-500 mt-2 italic">
                                                                    "{request.message}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <StatusBadge status={request.status} />
                                                        <span className="text-lg font-bold text-blue-600">
                                                            {formatPrice(request.price)}
                                                        </span>
                                                        {request.status === 'en_attente' && (
                                                            <div className="flex gap-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleRequestAction(request.id, 'accept')}
                                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                                                    title="Accepter"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleRequestAction(request.id, 'reject')}
                                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                                    title="Refuser"
                                                                >
                                                                    <XCircle size={18} />
                                                                </motion.button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <ClockIcon size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500">Aucune demande de réservation</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'documents' && (
                            <motion.div
                                key="documents"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <FileText size={20} className="text-blue-600" />
                                        Mes documents
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDocumentUpload}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg"
                                    >
                                        <Upload size={16} />
                                        Upload document
                                    </motion.button>
                                </div>
                                {documents.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Taille</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documents.map((doc, index) => (
                                                    <motion.tr
                                                        key={doc.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                {doc.type === 'pdf' ? <FileText size={16} className="text-red-500" /> :
                                                                    doc.type === 'image' ? <ImageIcon size={16} className="text-blue-500" /> :
                                                                        <File size={16} className="text-gray-500" />}
                                                                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-gray-600 uppercase">{doc.type}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{doc.size}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(doc.date)}</td>
                                                        <td className="py-3 px-4">
                                                            <StatusBadge status={doc.status} />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                                    title="Télécharger"
                                                                >
                                                                    <Download size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => handleDocumentDelete(doc.id)}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500 mb-4">Aucun document</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Modal des détails du jour */}
                <AnimatePresence>
                    {showDayDetailsModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowDayDetailsModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-3 sm:mx-4"
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
                                            onClick={() => setShowDayDetailsModal(false)}
                                            className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl transition-all"
                                        >
                                            <X size={16} className="sm:w-5 sm:h-5" />
                                        </motion.button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        {selectedDayDetails.length} ressource(s) avec des indisponibilités
                                    </p>
                                </div>

                                <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                                    {selectedDayDetails.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedDayDetails.map((resourceData, idx) => (
                                                <motion.div
                                                    key={resourceData.resourceId}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="border border-gray-200 rounded-xl overflow-hidden"
                                                >
                                                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                                                        <h4 className="font-semibold text-gray-900">{resourceData.resourceName}</h4>
                                                        <p className="text-xs text-gray-500">{resourceData.resourceType}</p>
                                                    </div>

                                                    <div className="p-3 space-y-2">
                                                        {resourceData.availabilities.map((avail, i) => (
                                                            <div
                                                                key={i}
                                                                className="p-3 rounded-lg bg-red-50 border border-red-200"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <XCircle size={16} className="text-red-600" />
                                                                        <span className="text-sm font-medium text-red-700">
                                                                            Indisponible
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatTime(avail.date_deb)} - {formatTime(avail.date_fin)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                                            <p className="text-gray-600">Aucune indisponibilité pour cette date</p>
                                            <p className="text-sm text-gray-500 mt-2">Toutes les ressources sont disponibles</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Styles d'animation */}
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
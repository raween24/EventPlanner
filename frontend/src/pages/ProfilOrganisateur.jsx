import React, { useState, useEffect, useMemo } from 'react';
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
    Layers, Save, Lock, Heart,
    Receipt, FileSignature
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, addMonths, subMonths } from 'date-fns';
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

    // Notifications
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Données principales
    const [organizer, setOrganizer] = useState(null);
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [selectedEventFilter, setSelectedEventFilter] = useState('all');

    const [docSearchTerm, setDocSearchTerm] = useState('');
    const [docSortOption, setDocSortOption] = useState('nameAsc'); // nameAsc, nameDesc, dateDesc, dateAsc
    // États pour la modification du profil
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        numTel: '',
        region: ''
    });
    const [profilePasswordData, setProfilePasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileActiveTab, setProfileActiveTab] = useState('info');

    // États pour la modification d'événement
    const [showEditEventModal, setShowEditEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editEventFormData, setEditEventFormData] = useState({
        title: '',
        description: '',
        lieu: '',
        category: '',
        type: 'public',
        dateDebut: '',
        dateFin: '',
        nombreParticipants: '',
        status: 'en attente'
    });
    const [editEventLoading, setEditEventLoading] = useState(false);
    const [editEventError, setEditEventError] = useState('');

    // Favoris
    const [favorites, setFavorites] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);

    // DOCUMENTS : État pour le type et les données mockées
    const [selectedDocType, setSelectedDocType] = useState('invoices'); // 'invoices' ou 'contracts'
    const [documents, setDocuments] = useState([]);

    // Mock des factures et contrats
    const mockInvoices = [
        { id: 'inv1', name: 'Facture janvier 2024', date: '2024-01-15', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'inv2', name: 'Facture février 2024', date: '2024-02-20', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'inv3', name: 'Facture mars 2024', date: '2024-03-10', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ];
    const mockContracts = [
        { id: 'con1', name: 'Contrat mariage - Dupont', date: '2024-01-05', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'con2', name: 'Contrat conférence tech', date: '2024-02-12', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'con3', name: 'Contrat anniversaire - Martin', date: '2024-03-01', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ];

    // Token et userId
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?._id || user?.id;

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Chargement initial
    useEffect(() => {
        if (!token || !userId) {
            navigate('/login');
            return;
        }
        fetchOrganizerData();
        loadNotifications();
    }, []);

    // Charger les documents mockés selon le type sélectionné
    useEffect(() => {
        if (selectedDocType === 'invoices') {
            setDocuments(mockInvoices);
        } else {
            setDocuments(mockContracts);
        }
    }, [selectedDocType]);

    // Mettre à jour les ressources filtrées quand l'événement change
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

    const loadNotifications = () => {
        setNotifications([]);
    };

    const fetchOrganizerData = async () => {
        try {
            setLoading(true);
            const [userRes, eventsRes, resourcesRes] = await Promise.all([
                api.get(`/users/${userId}`),
                api.get(`/event/user_event/${userId}`),
                api.get(`/users/adore/${userId}`)
            ]);
            setOrganizer(userRes.data);
            setProfileFormData({
                firstname: userRes.data.firstname || '',
                lastname: userRes.data.lastname || '',
                email: userRes.data.email || '',
                numTel: userRes.data.numTel || '',
                region: userRes.data.region || ''
            });
            setEvents(eventsRes.data);
            setResources(resourcesRes.data);
            setFilteredResources(resourcesRes.data);
        } catch (err) {
            console.error('Erreur chargement:', err);
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
    const filteredAndSortedDocuments = useMemo(() => {
        let filtered = documents.filter(doc =>
            doc.name.toLowerCase().includes(docSearchTerm.toLowerCase())
        );

        switch (docSortOption) {
            case 'nameAsc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameDesc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'dateDesc':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'dateAsc':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            default:
                break;
        }
        return filtered;
    }, [documents, docSearchTerm, docSortOption]);

    // Gestion du profil
    const handleProfileEdit = () => {
        setProfileFormData({
            firstname: organizer?.firstname || '',
            lastname: organizer?.lastname || '',
            email: organizer?.email || '',
            numTel: organizer?.numTel || '',
            region: organizer?.region || ''
        });
        setProfilePasswordData({ password: '', confirmPassword: '' });
        setProfileImage(null);
        setProfileImagePreview(null);
        setProfileError('');
        setProfileSuccess('');
        setShowProfileEditModal(true);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');

        if (profilePasswordData.password && profilePasswordData.password !== profilePasswordData.confirmPassword) {
            setProfileError('Les mots de passe ne correspondent pas');
            setProfileLoading(false);
            return;
        }
        if (profilePasswordData.password && profilePasswordData.password.length < 6) {
            setProfileError('Le mot de passe doit contenir au moins 6 caractères');
            setProfileLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('firstname', profileFormData.firstname);
            formData.append('lastname', profileFormData.lastname);
            formData.append('email', profileFormData.email);
            formData.append('numTel', profileFormData.numTel || '');
            formData.append('region', profileFormData.region || '');
            if (profilePasswordData.password) {
                formData.append('password', profilePasswordData.password);
            }
            if (profileImage) {
                formData.append('image', profileImage);
            }

            const response = await api.put(`/users/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setOrganizer(response.data);
            setProfileFormData({
                firstname: response.data.firstname || '',
                lastname: response.data.lastname || '',
                email: response.data.email || '',
                numTel: response.data.numTel || '',
                region: response.data.region || ''
            });
            const updatedUser = { ...user, ...response.data, id: response.data._id };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setProfileSuccess('Profil modifié avec succès !');
            setProfilePasswordData({ password: '', confirmPassword: '' });
            setProfileImage(null);
            setProfileImagePreview(null);
            setTimeout(() => {
                setShowProfileEditModal(false);
                setProfileSuccess('');
            }, 2000);
        } catch (err) {
            console.error('Erreur:', err);
            setProfileError(err.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfileImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProfileImage = () => {
        setProfileImage(null);
        setProfileImagePreview(null);
    };

    // Gestion des événements
    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setEditEventFormData({
            title: event.title || '',
            description: event.description || '',
            lieu: event.lieu || '',
            category: event.category || '',
            type: event.type || 'public',
            dateDebut: event.dateDebut ? format(parseISO(event.dateDebut), "yyyy-MM-dd'T'HH:mm") : '',
            dateFin: event.dateFin ? format(parseISO(event.dateFin), "yyyy-MM-dd'T'HH:mm") : '',
            nombreParticipants: event.nombreParticipants || '',
            status: event.status || 'en attente'
        });
        setShowEditEventModal(true);
    };

    const handleEditEventSubmit = async (e) => {
        e.preventDefault();
        if (!editingEvent || !editingEvent._id) {
            setEditEventError('Événement invalide');
            return;
        }
        setEditEventLoading(true);
        setEditEventError('');
        try {
            const submitData = {
                title: editEventFormData.title?.trim(),
                description: editEventFormData.description?.trim(),
                lieu: editEventFormData.lieu?.trim(),
                category: editEventFormData.category,
                type: editEventFormData.type,
                dateDebut: new Date(editEventFormData.dateDebut),
                dateFin: new Date(editEventFormData.dateFin),
                nombreParticipants: Number(editEventFormData.nombreParticipants) || 0,
                status: editEventFormData.status
            };
            const response = await api.put(`/event/update_event/${editingEvent._id}`, submitData);
            setEvents(events.map(ev => ev._id === editingEvent._id ? response.data : ev));
            setShowEditEventModal(false);
            setEditingEvent(null);
            alert('Événement modifié avec succès !');
        } catch (err) {
            console.error(err);
            setEditEventError(err.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setEditEventLoading(false);
        }
    };

    // Notifications
    const markAsRead = (notificationId) => {
        setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, read: true } : notif));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        setUnreadCount(0);
    };

    // Formatage
    const formatPrice = (price) => {
        if (!price) return '0 €';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        if (!date) return 'Date non définie';
        return format(parseISO(date), 'dd MMMM yyyy', { locale: fr });
    };

    const formatDateTime = (date) => {
        if (!date) return 'Date non définie';
        return format(parseISO(date), 'dd MMMM yyyy HH:mm', { locale: fr });
    };

    const formatTime = (date) => {
        if (!date) return '';
        return format(parseISO(date), 'HH:mm', { locale: fr });
    };

    // Calendrier
    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    const getEventsForDay = (day) => {
        let filteredEvents = events;
        if (selectedEventFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event._id === selectedEventFilter);
        }
        return filteredEvents.filter(event => {
            if (!event.dateDebut) return false;
            const eventDate = parseISO(event.dateDebut);
            return isSameDay(eventDate, day);
        });
    };

    const handleDayClick = (day) => {
        setSelectedDate(day);
        const dayEvents = getEventsForDay(day);
        if (dayEvents.length > 0) {
            setSelectedDayEvents(dayEvents);
            setShowDayEventsModal(true);
        }
    };

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const goToToday = () => {
        setCurrentMonth(new Date());
        setSelectedDate(new Date());
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(selectedEvent?._id === event._id ? null : event);
        setShowDayEventsModal(false);
        setActiveTab('events');
        if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
    };

    // Like resources
    const [likedResources, setLikedResources] = useState([]);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setLikedResources(user?.adore || []);
    }, []);

    const toggleLike = async (e, resourceId) => {
        e.stopPropagation();
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token || !user) {
            alert("Vous devez être connecté !");
            return;
        }
        const isLiked = likedResources.includes(resourceId);
        try {
            const url = isLiked ? "http://localhost:5000/api/users/remove" : "http://localhost:5000/api/users/like";
            const method = isLiked ? "DELETE" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ resourceId }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
                return;
            }
            let updated;
            if (isLiked) {
                updated = likedResources.filter(id => id !== resourceId);
            } else {
                updated = [...likedResources, resourceId];
            }
            setLikedResources(updated);
            localStorage.setItem("user", JSON.stringify({ ...user, adore: updated }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoBack = () => navigate('/');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Statistiques
    const getStats = () => {
        const totalBudget = resources.reduce((acc, r) => acc + (r.price || 0), 0);
        const upcomingEvents = events.filter(e => new Date(e.dateDebut) > new Date()).length;
        const completedEvents = events.filter(e => e.status === 'terminé').length;
        const totalDocuments = mockInvoices.length + mockContracts.length;
        return { totalBudget, upcomingEvents, completedEvents, totalDocuments };
    };
    const stats = getStats();
    const getMonthName = (date) => format(date, 'MMMM yyyy', { locale: fr });

    // Actions documents
    const handleViewPDF = (url) => {
        window.open(url, '_blank');
    };
    const handleDownloadPDF = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Composants UI
    const StatusBadge = ({ status }) => {
        const config = {
            'en attente': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ClockIcon, label: 'En attente' },
            'en cours': { bg: 'bg-blue-100', text: 'text-blue-700', icon: TrendingUp, label: 'En cours' },
            'terminé': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Terminé' }
        };
        const conf = config[status] || config['en attente'];
        const Icon = conf.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${conf.bg} ${conf.text}`}>
                <Icon size={12} /> {conf.label}
            </span>
        );
    };

    const Tabs = () => (
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex space-x-4 sm:space-x-8 min-w-max px-2">
                <button onClick={() => setActiveTab('events')} className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'events' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Calendar size={16} />
                    <span>Mes événements</span>
                    {events.length > 0 && <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">{events.length}</span>}
                </button>
                <button onClick={() => setActiveTab('resources')} className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Package size={16} />
                    <span>Mes favoris</span>
                    {likedResources.length > 0 && <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">{likedResources.length}</span>}
                </button>
                <button onClick={() => setActiveTab('demandes')} className={`pb-4 px-1 flex items-center gap-2 font-medium text-xs sm:text-sm transition-all relative ${activeTab === 'demandes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <FileText size={16} />
                    <span>Mes Documents</span>
                    <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">{mockInvoices.length + mockContracts.length}</span>
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-md">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6" />
                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-sm sm:text-base text-gray-600">Chargement de votre profil...</motion.p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <AlertCircle size={32} className="sm:w-10 sm:h-10 text-red-600" />
                    </div>
                    <p className="text-red-600 mb-4 sm:mb-6 text-base sm:text-lg">{error}</p>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.location.reload()} className="flex items-center justify-center gap-2 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 mx-auto shadow-lg text-sm sm:text-base">
                        <RefreshCw size={16} /> Réessayer
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100 }} className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <motion.button whileHover={{ scale: 1.05, x: -3 }} whileTap={{ scale: 0.95 }} onClick={handleGoBack} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all group" title="Retour à l'accueil">
                                <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                <span className="hidden sm:inline text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Retour</span>
                            </motion.button>
                            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">Espace Organisateur</motion.h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="relative">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors group" title="Notifications">
                                    {unreadCount > 0 ? <BellRing size={20} className="sm:w-[22px] sm:h-[22px] text-blue-600 group-hover:animate-shake" /> : <Bell size={20} className="sm:w-[22px] sm:h-[22px] text-gray-600 group-hover:text-blue-600 transition-colors" />}
                                </motion.button>
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                            <div className="p-3 sm:p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2"><Bell size={16} className="text-blue-600" /> Notifications</h3>
                                                {unreadCount > 0 && (<button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 bg-white rounded-lg shadow-sm hover:shadow">Tout marquer</button>)}
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? notifications.map((notif) => (
                                                    <motion.div key={notif.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 sm:p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all ${!notif.read ? 'bg-blue-50/30' : ''}`} onClick={() => markAsRead(notif.id)}>
                                                        <div className="flex items-start gap-2 sm:gap-3">
                                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${notif.type === 'success' ? 'bg-green-100' : notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                                                                {notif.type === 'success' ? <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-600" /> : notif.type === 'warning' ? <AlertCircle size={16} className="sm:w-5 sm:h-5 text-yellow-600" /> : <Bell size={16} className="sm:w-5 sm:h-5 text-blue-600" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{notif.title}</p>
                                                                <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                                                                <p className="text-gray-400 text-[8px] sm:text-[10px] mt-1">il y a {notif.time}</p>
                                                            </div>
                                                            {!notif.read && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1" />}
                                                        </div>
                                                    </motion.div>
                                                )) : (
                                                    <div className="p-8 text-center text-gray-500 text-sm"><Bell size={32} className="mx-auto mb-2 text-gray-300" />Aucune notification</div>
                                                )}
                                            </div>
                                            <div className="p-3 border-t border-gray-100 bg-gray-50">
                                                <button className="w-full text-center text-xs sm:text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Voir toutes les notifications</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/CreerEvenement')} className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium group">
                                <PlusCircle size={16} className="group-hover:rotate-90 transition-transform" />
                                <span className="hidden md:inline">Nouvel événement</span>
                                <span className="md:hidden">Nouveau</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"><Menu size={20} /></motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-red-600 transition-all rounded-xl hover:bg-red-50 text-xs sm:text-sm font-medium group" title="Déconnexion">
                                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                <span className="hidden md:inline">Déconnexion</span>
                            </motion.button>
                        </div>
                    </div>
                    <AnimatePresence>{isMobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden mt-4 space-y-2 border-t border-gray-100 pt-4">
                        <button onClick={() => { navigate('/CreerEvenement'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"><PlusCircle size={18} /> Nouvel événement</button>
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"><LogOut size={18} /> Déconnexion</button>
                    </motion.div>)}</AnimatePresence>
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
                                        {organizer?.image ? (
                                            <img src={`http://localhost:5000/${organizer.image}`} alt={`${organizer.firstname} ${organizer.lastname}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                                <User size={28} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full border-2 sm:border-4 border-white ${organizer?.status === 'valide' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                </motion.div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center">{organizer?.firstname} {organizer?.lastname}</h2>
                                    <motion.button whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }} onClick={handleProfileEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Modifier le profil"><Edit2 size={16} /></motion.button>
                                </div>
                                <p className="text-sm sm:text-base text-blue-600 font-medium flex items-center gap-1 mt-0.5 sm:mt-1"><Award size={14} className="sm:w-4 sm:h-4" /> Organisateur</p>
                                <div className="w-full mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors"><Mail size={14} className="sm:w-4 sm:h-4 text-blue-600" /></div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{organizer?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-green-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors"><Phone size={14} className="sm:w-4 sm:h-4 text-green-600" /></div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{organizer?.numTel || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-purple-50 transition-colors group">
                                        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors"><Building2 size={14} className="sm:w-4 sm:h-4 text-purple-600" /></div>
                                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate">{organizer?.region || 'Région non renseignée'}</span>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-3 gap-1 sm:gap-2 mt-4 sm:mt-6">
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-blue-600">{events.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Événements</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-purple-600">{likedResources.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Favoris</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center cursor-pointer">
                                        <p className="text-base sm:text-lg font-bold text-green-600">{mockInvoices.length + mockContracts.length}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-600">Documents</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Calendrier */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                                        <CalendarIcon className="text-blue-600" size={18} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Agenda des événements</h3>
                                </div>
                                <div className="flex items-center gap-2 w-full xs:w-auto">
                                    <select value={selectedEventFilter} onChange={(e) => setSelectedEventFilter(e.target.value)} className="px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                        <option value="all">Tous les événements</option>
                                        {events.map(event => (<option key={event._id} value={event._id}>{event.title}</option>))}
                                    </select>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goToToday} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1 group"><Home size={14} className="group-hover:rotate-12 transition-transform" /><span>Aujourd'hui</span></motion.button>
                                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevMonth} className="p-1.5 sm:p-2 bg-white rounded-lg hover:bg-gray-200 shadow-sm transition-all"><ChevronLeft size={16} /></motion.button>
                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextMonth} className="p-1.5 sm:p-2 bg-white rounded-lg hover:bg-gray-200 shadow-sm transition-all"><ChevronRight size={16} /></motion.button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full ring-2 ring-blue-300"></div><span className="text-gray-600">Jour sélectionné</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full"></div><span className="text-gray-600">Événement</span></div>
                                {selectedEventFilter !== 'all' && (<div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-gray-600">Filtre actif: {events.find(e => e._id === selectedEventFilter)?.title}</span></div>)}
                            </div>
                            <motion.h4 key={currentMonth.toString()} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{getMonthName(currentMonth)}</motion.h4>
                            <div className="grid grid-cols-7 gap-1 mb-2">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (<div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2">{day}</div>))}</div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: (getDay(startOfMonth(currentMonth)) + 6) % 7 }).map((_, i) => (<div key={`empty-${i}`} className="p-1 sm:p-3" />))}
                                {getDaysInMonth().map((day, index) => {
                                    const dayEvents = getEventsForDay(day);
                                    const hasEvents = dayEvents.length > 0;
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isTodayDate = isToday(day);
                                    const isFiltered = selectedEventFilter !== 'all';
                                    return (
                                        <motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDayClick(day)} className={`relative p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium ${isSelected ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105' : ''} ${!isSelected && isTodayDate ? 'ring-2 ring-blue-400 bg-blue-50' : ''} ${!isSelected && !isTodayDate && hasEvents ? 'bg-blue-50 hover:bg-blue-100' : ''} ${!isSelected && !isTodayDate && !hasEvents ? 'hover:bg-gray-100' : ''}`}>
                                            <span>{format(day, 'd')}</span>
                                            {isFiltered && hasEvents && !isSelected && (<div className="absolute -top-1 -right-1"><span className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500 text-[6px] font-medium text-white">✓</span></div>)}
                                            {hasEvents && !isSelected && !isFiltered && (<div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">{dayEvents.slice(0, 3).map((_, idx) => (<div key={idx} className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full" />))}</div>)}
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 sm:mt-6">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1 sm:gap-2"><Calendar size={12} /><span className="truncate max-w-[120px] xs:max-w-[200px] sm:max-w-none">{format(selectedDate, 'EEEE d MMMM', { locale: fr })}</span></h4>
                                    {selectedDayEvents.length > 0 && (<motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[10px] sm:text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">{selectedDayEvents.length}</motion.span>)}
                                </div>
                                <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                                    {selectedDayEvents.length > 0 ? selectedDayEvents.slice(0, 2).map((event, index) => (
                                        <motion.div key={event._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02, x: 5 }} onClick={() => handleEventSelect(event)} className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg cursor-pointer border border-blue-100 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-1.5 sm:gap-2"><div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-[8px] sm:text-xs flex-shrink-0">{event.category === 'Mariage' ? '💒' : event.category === 'Conference' ? '🎤' : event.category === 'Anniversaire' ? '🎂' : '📅'}</div><div className="flex-1 min-w-0"><p className="font-medium text-gray-900 text-[10px] sm:text-xs truncate">{event.title}</p><p className="text-[8px] sm:text-[10px] text-gray-500">{formatTime(event.dateDebut)}</p></div></div>
                                        </motion.div>
                                    )) : (<p className="text-xs sm:text-sm text-gray-400 text-center py-2 sm:py-4">Aucun événement ce jour</p>)}
                                    {selectedDayEvents.length > 2 && (<button onClick={() => setShowDayEventsModal(true)} className="w-full text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium py-0.5 sm:py-1 hover:underline">+{selectedDayEvents.length - 2} autres événements</button>)}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Onglets */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
                    <Tabs />
                    <AnimatePresence mode="wait">
                        {activeTab === 'events' && (
                            <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <h2 className="text-base sm:text-xl font-bold text-gray-900">Mes événements</h2>
                                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg sm:rounded-xl">
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode('grid')} className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><LayoutGrid size={14} /></motion.button>
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode('list')} className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><List size={14} /></motion.button>
                                        </div>
                                    </div>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedEvent(null)} className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-blue-600 bg-blue-50 rounded-lg sm:rounded-xl hover:bg-blue-100 text-xs sm:text-sm font-medium"><Filter size={14} /><span className="hidden xs:inline">Tous les événements</span><span className="xs:hidden">Tous</span></motion.button>
                                </div>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                        {events.map((event, index) => {
                                            const totalPrice = event.ressources_utiliser?.reduce((acc, resId) => {
                                                const resource = resources.find(r => r._id === resId);
                                                return acc + (resource?.price || 0);
                                            }, 0) || 0;
                                            return (
                                                <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} onClick={() => handleEventSelect(event)} className={`relative bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-300 border-2 cursor-pointer overflow-hidden ${selectedEvent?._id === event._id ? 'border-blue-500 shadow-2xl' : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'}`}>
                                                    <motion.div initial={{ x: '-100%' }} animate={{ x: hoveredCard === event._id ? '100%' : '-100%' }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{event.category === 'Mariage' ? '💒' : event.category === 'Conference' ? '🎤' : event.category === 'Anniversaire' ? '🎂' : '📚'}</div>
                                                    <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base truncate">{event.title}</h3>
                                                    <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                                                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500"><Calendar size={10} /><span className="truncate">{formatDate(event.dateDebut)}</span></div>
                                                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500"><MapPin size={10} /><span className="truncate">{event.lieu || 'Lieu non défini'}</span></div>
                                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-blue-600"><Euro size={12} /><span className="text-[10px] sm:text-sm">{formatPrice(totalPrice)}</span></div>
                                                        <div><StatusBadge status={event.status} /></div>
                                                    </div>
                                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }} className="w-full flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-medium hover:shadow-lg transition-all group"><Edit2 size={12} className="group-hover:rotate-12 transition-transform" /> Modifier</motion.button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3">
                                        {events.map((event, index) => (
                                            <motion.div key={event._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ x: 5 }} onClick={() => handleEventSelect(event)} className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-blue-50 transition-all group">
                                                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">{event.category === 'Mariage' ? '💒' : event.category === 'Conference' ? '🎤' : event.category === 'Anniversaire' ? '🎂' : '📅'}</div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">{event.title}</h3>
                                                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{formatDate(event.dateDebut)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 ml-2">
                                                    <StatusBadge status={event.status} />
                                                    <span className="text-blue-600 font-bold text-[10px] sm:text-sm whitespace-nowrap">{formatPrice(event.ressources_utiliser?.reduce((acc, resId) => { const resource = resources.find(r => r._id === resId); return acc + (resource?.price || 0); }, 0) || 0)}</span>
                                                    <Edit2 size={12} className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600 transition-colors" onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                {events.length === 0 && (<div className="text-center py-8 sm:py-16"><div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"><Calendar size={24} className="sm:w-10 sm:h-10 text-gray-400" /></div><p className="text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">Aucun événement trouvé</p><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/CreerEvenement')} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium">Créer un événement</motion.button></div>)}
                            </motion.div>
                        )}
                        {activeTab === 'resources' && (
                            <motion.div key="resources" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Package size={20} className="text-purple-600" />
                                        Mes Favoris Ressources
                                    </h2>
                                    <div className="relative w-full xs:w-auto">
                                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full xs:w-48 sm:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                    {resources.filter((resource) => likedResources.includes(resource._id)).filter((resource) => resource.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                                        resources.filter((resource) => likedResources.includes(resource._id)).filter((resource) => resource.name.toLowerCase().includes(searchTerm.toLowerCase())).map((resource, index) => (
                                            <motion.div key={resource._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-200 hover:shadow-xl transition-all group">
                                                <div onClick={(e) => { e.stopPropagation(); toggleLike(e, resource._id); }} className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow cursor-pointer hover:scale-110 transition">
                                                    <Heart size={16} className={`transition-all duration-200 ${likedResources.includes(resource._id) ? "text-red-500 fill-red-500 scale-110" : "text-gray-400"}`} />
                                                </div>
                                                <div className="flex flex-col xs:flex-row items-start gap-2 sm:gap-4">
                                                    <div className="w-full xs:w-12 sm:w-16 h-24 xs:h-12 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group-hover:shadow-md transition-all">
                                                        {resource.media && resource.media.length > 0 && resource.media[0]?.img_vd ? (
                                                            <img src={`http://localhost:5000/${resource.media[0].img_vd[0]}`} alt={resource.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center"><Camera size={20} className="sm:w-6 sm:h-6 text-gray-400" /></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">{resource.name}</h3>
                                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2">{resource.description?.substring(0, 60)}...</p>
                                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                                                            <span className="px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] sm:text-xs">{resource.type}</span>
                                                            <span className="text-xs sm:text-sm font-bold text-green-600">{formatPrice(resource.price)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 sm:py-16 bg-white rounded-xl sm:rounded-2xl">
                                            <Heart size={32} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                                            <p className="text-gray-500 text-xs sm:text-sm">Aucun favori trouvé</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'demandes' && (
                            <motion.div
                                key="documents"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Deux grands boutons (taille réduite) */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDocType('invoices')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-6 rounded-xl transition-all ${selectedDocType === 'invoices'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Receipt size={20} />
                                        <span className="font-semibold text-base">Mes Factures</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDocType('contracts')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-6 rounded-xl transition-all ${selectedDocType === 'contracts'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <FileSignature size={20} />
                                        <span className="font-semibold text-base">Mes Contrats</span>
                                    </motion.button>
                                </div>

                                {/* Barre de filtrage et tri */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                    <div className="relative flex-1">
                                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom..."
                                            value={docSearchTerm}
                                            onChange={(e) => setDocSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        />
                                    </div>
                                    <select
                                        value={docSortOption}
                                        onChange={(e) => setDocSortOption(e.target.value)}
                                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                                    >
                                        <option value="nameAsc">Nom (A → Z)</option>
                                        <option value="nameDesc">Nom (Z → A)</option>
                                        <option value="dateDesc">Date (récent → ancien)</option>
                                        <option value="dateAsc">Date (ancien → récent)</option>
                                    </select>
                                </div>

                                {/* Tableau des documents filtrés et triés */}
                                {filteredAndSortedDocuments.length === 0 ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500">Aucun document trouvé</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            {selectedDocType === 'invoices' ? 'Aucune facture ne correspond à votre recherche' : 'Aucun contrat ne correspond à votre recherche'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du document</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredAndSortedDocuments.map((doc) => (
                                                    <motion.tr
                                                        key={doc.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                                    <FileText size={16} />
                                                                </div>
                                                                <span className="font-medium text-gray-900">{doc.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {formatDate(doc.date)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleViewPDF(doc.url)}
                                                                    className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center gap-1 text-sm"
                                                                >
                                                                    <Eye size={14} />
                                                                    Voir
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleDownloadPDF(doc.url, doc.name)}
                                                                    className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1 text-sm"
                                                                >
                                                                    <Download size={14} />
                                                                    Télécharger
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Modal des événements du jour */}
                <AnimatePresence>
                    {showDayEventsModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDayEventsModal(false)}>
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
                                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50"><div className="flex justify-between items-center"><h3 className="text-base sm:text-xl font-bold text-gray-900">{format(selectedDate, 'EEEE d MMMM', { locale: fr })}</h3><motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowDayEventsModal(false)} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl transition-all"><X size={16} className="sm:w-5 sm:h-5" /></motion.button></div><p className="text-xs sm:text-sm text-gray-500 mt-1">{selectedDayEvents.length} événement(s) planifié(s)</p></div>
                                <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]"><div className="space-y-2 sm:space-y-3">{selectedDayEvents.map((event, index) => (<motion.div key={event._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition-all" onClick={() => { handleEventSelect(event); setShowDayEventsModal(false); }}><div className="flex items-start gap-2 sm:gap-3"><div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-base sm:text-xl flex-shrink-0">{event.category === 'Mariage' ? '💒' : event.category === 'Conference' ? '🎤' : event.category === 'Anniversaire' ? '🎂' : '📅'}</div><div className="flex-1 min-w-0"><h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{event.title}</h4><p className="text-[10px] sm:text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p><div className="flex items-center gap-2 sm:gap-4 mt-2 text-[8px] sm:text-xs text-gray-500"><span className="flex items-center gap-0.5 sm:gap-1"><Clock size={8} />{formatTime(event.dateDebut)}</span><span className="flex items-center gap-0.5 sm:gap-1"><MapPin size={8} /><span className="truncate max-w-[100px] sm:max-w-[150px]">{event.lieu || 'Lieu non défini'}</span></span></div></div></div></motion.div>))}</div></div>
                                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDayEventsModal(false)} className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:shadow-lg transition-all">Fermer</motion.button></div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal de modification du profil */}
                <AnimatePresence>
                    {showProfileEditModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowProfileEditModal(false)}>
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
                                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-xl"><User size={20} className="text-blue-600" /></div><h3 className="text-lg sm:text-xl font-bold text-gray-900">Modifier mon profil</h3></div><motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowProfileEditModal(false)} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl transition-all"><X size={18} className="sm:w-5 sm:h-5 text-gray-500" /></motion.button></div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Modifiez vos informations personnelles</p>
                                </div>
                                <div className="flex border-b border-gray-200 px-4 sm:px-6">
                                    <button onClick={() => setProfileActiveTab('info')} className={`py-3 px-4 text-sm font-medium transition-all relative ${profileActiveTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><User size={16} className="mr-2" /> Informations</button>
                                    <button onClick={() => setProfileActiveTab('password')} className={`py-3 px-4 text-sm font-medium transition-all relative ${profileActiveTab === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Lock size={16} className="mr-2" /> Sécurité</button>
                                </div>
                                <form onSubmit={handleProfileSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                                    {profileError && (<div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm"><AlertCircle size={16} /> {profileError}</div>)}
                                    {profileSuccess && (<div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600 text-sm"><CheckCircle size={16} /> {profileSuccess}</div>)}
                                    {profileActiveTab === 'info' && (
                                        <>
                                            <div className="flex flex-col items-center mb-4"><div className="relative"><div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg bg-gray-100">{profileImagePreview ? (<img src={profileImagePreview} alt="Aperçu" className="w-full h-full object-cover" />) : organizer?.image ? (<img src={`http://localhost:5000/${organizer.image}`} alt={organizer.firstname} className="w-full h-full object-cover" />) : (<div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"><User size={32} className="text-white" /></div>)}</div><label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"><Camera size={16} className="text-white" /><input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" /></label>{profileImagePreview && (<button type="button" onClick={handleRemoveProfileImage} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"><X size={12} /></button>)}</div><p className="text-xs text-gray-500 mt-2">Cliquez sur l'icône caméra pour changer la photo</p></div>
                                            <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label><input type="text" value={profileFormData.firstname} onChange={(e) => setProfileFormData({ ...profileFormData, firstname: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label><input type="text" value={profileFormData.lastname} onChange={(e) => setProfileFormData({ ...profileFormData, lastname: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required /></div></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={profileFormData.email} onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required /></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label><input type="tel" value={profileFormData.numTel} onChange={(e) => setProfileFormData({ ...profileFormData, numTel: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="+33 6 12 34 56 78" /></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Région</label><input type="text" value={profileFormData.region} onChange={(e) => setProfileFormData({ ...profileFormData, region: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Île-de-France, Provence-Alpes-Côte d'Azur..." /></div>
                                        </>
                                    )}
                                    {profileActiveTab === 'password' && (
                                        <>
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg"><div className="flex items-center gap-2 text-amber-700 text-sm"><AlertCircle size={16} /> Laissez vide si vous ne voulez pas changer le mot de passe</div></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe (optionnel)</label><input type="password" value={profilePasswordData.password} onChange={(e) => setProfilePasswordData({ ...profilePasswordData, password: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Laissez vide pour conserver l'ancien" /><p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label><input type="password" value={profilePasswordData.confirmPassword} onChange={(e) => setProfilePasswordData({ ...profilePasswordData, confirmPassword: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Confirmez le nouveau mot de passe" disabled={!profilePasswordData.password} />
                                                {profilePasswordData.password && profilePasswordData.confirmPassword && profilePasswordData.password !== profilePasswordData.confirmPassword && (<p className="text-xs text-red-500 mt-1"><XCircle size={12} className="inline mr-1" /> Les mots de passe ne correspondent pas</p>)}
                                                {profilePasswordData.password && profilePasswordData.confirmPassword && profilePasswordData.password === profilePasswordData.confirmPassword && (<p className="text-xs text-green-500 mt-1"><CheckCircle size={12} className="inline mr-1" /> Les mots de passe correspondent</p>)}</div>
                                        </>
                                    )}
                                    <div className="pt-4 flex gap-3"><button type="button" onClick={() => setShowProfileEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Annuler</button><button type="submit" disabled={profileLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">{profileLoading ? <><RefreshCw size={16} className="animate-spin" /> Enregistrement...</> : <><Save size={16} /> Enregistrer</>}</button></div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal de modification d'événement */}
                <AnimatePresence>
                    {showEditEventModal && editingEvent && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditEventModal(false)}>
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
                                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-xl">
                                                <Edit2 size={20} className="text-blue-600" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Modifier l'événement</h3>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowEditEventModal(false)} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl transition-all">
                                            <X size={18} className="sm:w-5 sm:h-5 text-gray-500" />
                                        </motion.button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Modifiez les informations de "{editingEvent.title}"</p>
                                </div>
                                <form onSubmit={handleEditEventSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                                    {editEventError && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle size={16} /> {editEventError}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                                        <input type="text" value={editEventFormData.title} onChange={(e) => setEditEventFormData({ ...editEventFormData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                        <textarea value={editEventFormData.description} onChange={(e) => setEditEventFormData({ ...editEventFormData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-500" />
                                            Lieu *
                                        </label>
                                        <input type="text" value={editEventFormData.lieu} onChange={(e) => setEditEventFormData({ ...editEventFormData, lieu: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Ex: Paris, France | Salle des fêtes..." required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                                            <select value={editEventFormData.category} onChange={(e) => setEditEventFormData({ ...editEventFormData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required>
                                                <option value="Mariage">Mariage 💒</option>
                                                <option value="Conference">Conférence 🎤</option>
                                                <option value="Anniversaire">Anniversaire 🎂</option>
                                                <option value="Seminaire">Séminaire 📚</option>
                                                <option value="autre">Autre 📅</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                            <select value={editEventFormData.type} onChange={(e) => setEditEventFormData({ ...editEventFormData, type: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required>
                                                <option value="public">Public</option>
                                                <option value="privé">Privé</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
                                            <input type="datetime-local" value={editEventFormData.dateDebut} onChange={(e) => setEditEventFormData({ ...editEventFormData, dateDebut: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin *</label>
                                            <input type="datetime-local" value={editEventFormData.dateFin} onChange={(e) => setEditEventFormData({ ...editEventFormData, dateFin: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de participants</label>
                                        <input type="number" value={editEventFormData.nombreParticipants} onChange={(e) => setEditEventFormData({ ...editEventFormData, nombreParticipants: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" min="0" />
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <button type="button" onClick={() => setShowEditEventModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Annuler</button>
                                        <button type="submit" disabled={editEventLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                                            {editEventLoading ? <><RefreshCw size={16} className="animate-spin" /> Modification...</> : <><CheckCircle size={16} /> Enregistrer</>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                @keyframes shake { 0%, 100% { transform: rotate(0deg); } 10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); } 20%, 40%, 60%, 80% { transform: rotate(5deg); } }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
        </div>
    );
}
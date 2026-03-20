import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload, FiDollarSign,
  FiMapPin, FiUsers, FiMail, FiUser, FiTag,
  FiInfo, FiCheckCircle, FiXCircle, FiClock,
  FiMousePointer, FiCalendar, FiChevronLeft, FiChevronRight,
  FiSun, FiMoon, FiCloud, FiStar, FiHeart, FiGift,
  FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// Configuration du calendrier
const localizer = momentLocalizer(moment);

// Composant Tooltip (identique)
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50"
    >
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
    </motion.div>
  </div>
);

// Custom Toolbar Component (identique)
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToDayView = () => {
    toolbar.onView('day');
  };

  const goToWeekView = () => {
    toolbar.onView('week');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return date.format('MMMM YYYY');
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={goToToday}
        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
      >
        Aujourd'hui
      </motion.button>

      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToBack}
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        >
          <FiChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.span
          key={toolbar.date}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-semibold text-gray-800 min-w-[200px] text-center"
        >
          {label()}
        </motion.span>

        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNext}
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        >
          <FiChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToWeekView}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${toolbar.view === 'week'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Semaine
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToDayView}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${toolbar.view === 'day'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Jour
        </motion.button>
      </div>
    </motion.div>
  );
};

// Availability Event Component (identique)
const AvailabilityEvent = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`h-full w-full rounded-md px-2 py-1 text-xs font-medium relative overflow-hidden ${event.type === 'available'
        ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-l-4 border-green-500'
        : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-l-4 border-red-500'
        }`}
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <div className="flex items-center space-x-1">
        <FiClock className="w-3 h-3" />
        <span>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</span>
      </div>
      <div className="font-semibold mt-0.5 flex items-center space-x-1">
        {event.type === 'available' ? (
          <>
            <FiCheckCircle className="w-3 h-3" />
            <span>Disponible</span>
          </>
        ) : (
          <>
            <FiXCircle className="w-3 h-3" />
            <span>Indisponible</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Custom Time Slot Component (identique)
const TimeSlotWrapper = ({ children, value, onSelectSlot }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ripple, setRipple] = useState({ show: false, x: 0, y: 0 });

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ show: true, x, y });
    setTimeout(() => setRipple({ show: false, x: 0, y: 0 }), 500);

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);

    const endTime = moment(value).add(30, 'minutes').toDate();
    onSelectSlot({ start: value, end: endTime });
  };

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{
        scale: isClicked ? 0.98 : 1,
        backgroundColor: isHovered ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
    >
      {ripple.show && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-5 h-5 bg-purple-400 rounded-full pointer-events-none"
          style={{ left: ripple.x - 10, top: ripple.y - 10 }}
        />
      )}
      {children}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-[-8px] px-2 py-1 bg-purple-600 text-white text-xs rounded shadow-lg z-50 pointer-events-none whitespace-nowrap"
        >
          <FiMousePointer className="inline mr-1" />
          Cliquez pour sélectionner {moment(value).format('HH:mm')}
        </motion.div>
      )}
    </motion.div>
  );
};

// Custom Time Column Header (identique)
const TimeColumnWrapper = ({ children, value }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-full"
        />
      )}
    </motion.div>
  );
};

// Custom Date Cell (identique)
const DateCellWrapper = ({ children, value }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
    >
      {children}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 border-2 border-purple-200 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  );
};

const AddResourceForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "salle",
    price: "",
    location: "",
    capacity: "",
    provider_name: "",
    provider_email: "",
    date_deb: "",
    date_fin: ""
  });

  // Media upload state
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");

  // Calendar state
  const [availabilityEvents, setAvailabilityEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarView, setCalendarView] = useState('week');
  const [showSelectionTooltip, setShowSelectionTooltip] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Animation states
  const [backgroundTheme, setBackgroundTheme] = useState('gradient');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState([]);
  const [isNightMode, setIsNightMode] = useState(false);

  // CORRECTION: Récupérer les informations utilisateur depuis localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("Données utilisateur du localStorage:", user);

    if (token && user) {
      try {
        // Utiliser les données du localStorage qui contiennent maintenant les infos
        setFormData(prev => ({
          ...prev,
          provider_name: `${user.lastname} ${user.firstname}`,
          provider_email: user.email || ""
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);

        // Fallback: essayer de décoder le token
        try {
          const decoded = jwtDecode(token);
          setFormData(prev => ({
            ...prev,
            provider_name: decoded.name || "",
            provider_email: decoded.email || ""
          }));
        } catch (decodeError) {
          console.error("Erreur de décodage du token:", decodeError);
        }
      }
    }
  }, []);

  // Effet pour les icônes flottantes
  useEffect(() => {
    const icons = [FiStar, FiHeart, FiGift, FiSun, FiMoon, FiCloud];
    const newFloatingIcons = [];
    for (let i = 0; i < 10; i++) {
      newFloatingIcons.push({
        id: i,
        Icon: icons[Math.floor(Math.random() * icons.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
        size: 20 + Math.random() * 30
      });
    }
    setFloatingIcons(newFloatingIcons);
  }, []);

  // Calculer la progression du formulaire
  useEffect(() => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(value =>
      value && value.toString().trim() !== ''
    ).length;
    const progress = (filledFields / totalFields) * 100;
    setFormProgress(progress);
  }, [formData]);

  // Update form date fields when calendar events change
  useEffect(() => {
    if (availabilityEvents.length > 0) {
      const startDates = availabilityEvents.map(e => e.start);
      const endDates = availabilityEvents.map(e => e.end);

      const minDate = new Date(Math.min(...startDates));
      const maxDate = new Date(Math.max(...endDates));

      setFormData(prev => ({
        ...prev,
        date_deb: moment(minDate).format('YYYY-MM-DD'),
        date_fin: moment(maxDate).format('YYYY-MM-DD')
      }));
    }
  }, [availabilityEvents]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  // Process files
  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    setMediaFiles(prev => [...prev, ...imageFiles]);

    const newPreviews = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove media file
  const removeMedia = (id) => {
    setMediaPreviews(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
        setMediaFiles(current => current.filter(f => f !== file.file));
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Handle calendar range selection
  const handleSelectRange = (range) => {
    setSelectedRange(range);
    setShowSelectionTooltip(true);
    setTimeout(() => setShowSelectionTooltip(false), 2000);
  };

  // Add availability range
  const addAvailabilityRange = (type) => {
    if (!selectedRange) return;

    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: type === 'available' ? 'Disponible' : 'Indisponible',
      start: selectedRange.start,
      end: selectedRange.end,
      type: type,
      allDay: false
    };

    setAvailabilityEvents(prev => [...prev, newEvent]);
    setSelectedEventType(type);
    setTimeout(() => setSelectedEventType(null), 500);
    setSelectedRange(null);
  };

  // Remove availability event
  const removeAvailabilityEvent = (eventId) => {
    setAvailabilityEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Vous devez être connecté pour ajouter une ressource");
      return;
    }

    try {
      setIsSubmitting(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      const resourceData = new FormData();

      // Ajouter les champs du formulaire
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          resourceData.append(key, formData[key]);
        }
      });

      // Ajouter les médias
      mediaFiles.forEach((file) => {
        resourceData.append("media", file);
      });

      // Ajouter les disponibilités
      resourceData.append("availability", JSON.stringify(availabilityEvents));

      const response = await axios.post(
        "http://localhost:5000/api/ressources/add_ressource",
        resourceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Ressource ajoutée :", response.data);
      setMessage("Ressource ajoutée avec succès !");
      setShowSuccessAnimation(true);

      setTimeout(() => {
        setShowSuccessAnimation(false);
        // Reset form
        setFormData({
          name: "",
          description: "",
          type: "salle",
          price: "",
          location: "",
          capacity: "",
          provider_name: formData.provider_name, // Garder le nom du prestataire
          provider_email: formData.provider_email, // Garder l'email
          date_deb: "",
          date_fin: ""
        });
        setAvailabilityEvents([]);
        setMediaPreviews([]);
        setMediaFiles([]);
      }, 3000);

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation for custom toolbar
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Calendar components
  const CalendarComponents = {
    event: AvailabilityEvent,
    timeSlotWrapper: (props) => (
      <TimeSlotWrapper {...props} onSelectSlot={handleSelectRange} />
    ),
    timeGutterWrapper: TimeColumnWrapper,
    dateCellWrapper: DateCellWrapper,
    toolbar: CustomToolbar
  };

  // Calendar messages
  const messages = {
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    allDay: 'Journée',
    week: 'Semaine',
    day: 'Jour',
    previous: 'Précédent',
    next: 'Suivant',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    today: "Aujourd'hui",
    agenda: 'Agenda',
    showMore: total => `+${total} autres`
  };

  // Background themes
  const getBackgroundClass = () => {
    if (isNightMode) {
      return 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900';
    }

    switch (backgroundTheme) {
      case 'gradient':
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50';
      case 'ocean':
        return 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50';
      case 'sunset':
        return 'bg-gradient-to-br from-orange-50 via-rose-50 to-red-50';
      case 'forest':
        return 'bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50';
      default:
        return 'bg-gradient-to-br from-slate-50 to-slate-100';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} p-6 relative overflow-hidden transition-colors duration-1000`}>
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition group"
      >
        <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
        Retour
      </button>

      {/* Icônes flottantes */}
      {floatingIcons.map(({ id, Icon, x, y, duration, delay, size }) => (
        <motion.div
          key={id}
          className="absolute opacity-10 text-purple-300 pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Animation de succès */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500 text-white p-8 rounded-full shadow-2xl"
          >
            <FiCheckCircle className="w-16 h-16" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ y: -100, opacity: 1 }}
            animate={{ y: window.innerHeight, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: 0
                }}
                animate={{
                  y: window.innerHeight + 50,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "linear"
                }}
                className="absolute w-3 h-3"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0%'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre de progression */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 z-50"
        initial={{ width: 0 }}
        animate={{ width: `${formProgress}%` }}
        transition={{ duration: 0.5 }}
      />

      {/* Contrôles de thème */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsNightMode(!isNightMode)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isNightMode ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5 text-indigo-500" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setBackgroundTheme(prev => {
            const themes = ['gradient', 'ocean', 'sunset', 'forest'];
            const currentIndex = themes.indexOf(prev);
            return themes[(currentIndex + 1) % themes.length];
          })}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <FiCloud className="w-5 h-5 text-purple-500" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Ajouter une ressource
          </h1>
          <p className="text-gray-600 mt-2">Remplissez les détails pour ajouter une nouvelle ressource</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resource Name */}
                <motion.div
                  onHoverStart={() => setHoveredField('name')}
                  onHoverEnd={() => setHoveredField(null)}
                  animate={{
                    scale: hoveredField === 'name' ? 1.02 : 1
                  }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la ressource
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    placeholder="Ex: Grande Salle de Bal"
                    required
                  />
                </motion.div>

                {/* Description */}
                <motion.div
                  onHoverStart={() => setHoveredField('description')}
                  onHoverEnd={() => setHoveredField(null)}
                  animate={{
                    scale: hoveredField === 'description' ? 1.02 : 1
                  }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    placeholder="Décrivez la ressource..."
                    required
                  />
                </motion.div>

                {/* Type and Price */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    onHoverStart={() => setHoveredField('type')}
                    onHoverEnd={() => setHoveredField(null)}
                    animate={{
                      scale: hoveredField === 'type' ? 1.02 : 1
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <div className="relative">
                      <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 appearance-none transition-all duration-200"
                      >
                        <option value="salle">Salle</option>
                        <option value="materiel">Matériel</option>
                        <option value="decoration">Décoration</option>
                        <option value="traiteur">Traiteur</option>
                      </select>
                    </div>
                  </motion.div>
                  <motion.div
                    onHoverStart={() => setHoveredField('price')}
                    onHoverEnd={() => setHoveredField(null)}
                    animate={{
                      scale: hoveredField === 'price' ? 1.02 : 1
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (par heure)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Location and Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    onHoverStart={() => setHoveredField('location')}
                    onHoverEnd={() => setHoveredField(null)}
                    animate={{
                      scale: hoveredField === 'location' ? 1.02 : 1
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="Ville, Adresse"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    onHoverStart={() => setHoveredField('capacity')}
                    onHoverEnd={() => setHoveredField(null)}
                    animate={{
                      scale: hoveredField === 'capacity' ? 1.02 : 1
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacité max
                    </label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="Nombre de personnes"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Provider Info - Maintenant pré-rempli avec les données du localStorage */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    onHoverStart={() => setHoveredField('provider_name')}
                    onHoverEnd={() => setHoveredField(null)}
                    animate={{
                      scale: hoveredField === 'provider_name' ? 1.02 : 1
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du prestataire
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="provider_name"
                        value={formData.provider_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="John Doe"
                        required
                        readOnly // Optionnel: rendre readonly car c'est automatique
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    onHoverStart={() => setHoveredField('provider_email')}
                    onHoverEnd={() => setHoveredField(null)}
                    animate={{
                      scale: hoveredField === 'provider_email' ? 1.02 : 1
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="provider_email"
                        value={formData.provider_email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="john@example.com"
                        required
                        readOnly // Optionnel: rendre readonly car c'est automatique
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Date fields - auto-filled from calendar */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date début
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="date_deb"
                        value={formData.date_deb}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date fin
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="date_fin"
                        value={formData.date_fin}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Médias
                  </label>
                  <motion.div
                    animate={{
                      scale: dragActive ? 1.02 : 1,
                      borderColor: dragActive ? '#a78bfa' : '#d1d5db'
                    }}
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${dragActive
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <motion.div
                        animate={{
                          y: dragActive ? -5 : 0,
                          rotate: dragActive ? [0, -10, 10, -10, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                      </motion.div>
                      <p className="text-sm text-gray-600">
                        Glissez-déposez des images ici, ou cliquez pour sélectionner
                      </p>
                    </div>
                  </motion.div>

                  {/* Image Previews */}
                  <AnimatePresence>
                    {mediaPreviews.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 grid grid-cols-3 gap-2"
                      >
                        {mediaPreviews.map((file) => (
                          <motion.div
                            key={file.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            className="relative group"
                          >
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <motion.button
                              type="button"
                              onClick={() => removeMedia(file.id)}
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Display */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className={`p-3 rounded-lg ${message.includes("succès")
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Ajout en cours...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Ajouter la ressource</span>
                      <motion.div
                        initial={{ x: '100%' }}
                        whileHover={{ x: '-100%' }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700"
                      />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              animate={{
                height: isCalendarExpanded ? 'auto' : '60px',
                overflow: isCalendarExpanded ? 'visible' : 'hidden'
              }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  animate={{ x: isCalendarExpanded ? 0 : -10 }}
                  className="text-xl font-semibold text-gray-800"
                >
                  Calendrier de disponibilité
                </motion.h2>
                <div className="flex items-center space-x-2">



                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addAvailabilityRange('unavailable')}
                    disabled={!selectedRange}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <FiXCircle className="w-5 h-5" />
                    {selectedEventType === 'unavailable' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-red-400 rounded-full"
                      />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    <motion.div
                      animate={{ rotate: isCalendarExpanded ? 180 : 0 }}
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>

              {/* Animated Selection Tooltip */}
              <AnimatePresence>
                {showSelectionTooltip && selectedRange && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="mb-4 p-3 bg-purple-100 text-purple-700 rounded-lg flex items-center space-x-2"
                  >
                    <FiInfo className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Plage sélectionnée: {moment(selectedRange.start).format('MMM DD, HH:mm')} - {moment(selectedRange.end).format('HH:mm')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calendar */}
              <motion.div
                className="calendar-container rounded-lg overflow-hidden border border-gray-200"
                animate={{
                  scale: isCalendarExpanded ? 1 : 0.8,
                  opacity: isCalendarExpanded ? 1 : 0
                }}
              >
                <Calendar
                  localizer={localizer}
                  events={availabilityEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  selectable
                  onSelectSlot={handleSelectRange}
                  components={CalendarComponents}
                  className="bg-white"
                  popup
                  tooltipAccessor={(event) =>
                    `${event.type === 'available' ? 'Disponible' : 'Indisponible'}: ${moment(event.start).format('MMM DD, YYYY HH:mm')} - ${moment(event.end).format('HH:mm')}`
                  }
                  views={['week', 'day']}
                  defaultView="week"
                  view={calendarView}
                  onView={setCalendarView}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  step={30}
                  timeslots={2}
                  messages={messages}
                  min={moment().hours(0).minutes(0).toDate()}
                  max={moment().hours(23).minutes(59).toDate()}
                  culture='fr'
                />
              </motion.div>

              {/* Legend and Selected Range Info */}
              <motion.div
                className="mt-4 flex items-center justify-between"
                animate={{
                  y: isCalendarExpanded ? 0 : -20,
                  opacity: isCalendarExpanded ? 1 : 0
                }}
              >
                <div className="flex items-center space-x-6">


                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                      }}
                      className="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded"
                    />
                    <span className="text-sm text-gray-600">Indisponible</span>
                  </motion.div>
                </div>

                {selectedRange && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg"
                  >
                    <FiClock className="text-purple-500 w-4 h-4" />
                    <span className="text-sm text-purple-700 font-medium">
                      {moment(selectedRange.start).format('MMM DD, HH:mm')} - {moment(selectedRange.end).format('HH:mm')}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Active Availability List */}
              <AnimatePresence>
                {availabilityEvents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 border-t border-gray-100 pt-4"
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Plages de disponibilité</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <AnimatePresence>
                        {availabilityEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            whileHover={{ scale: 1.02, x: 5 }}
                            className={`flex items-center justify-between p-2 rounded-lg ${event.type === 'available' ? 'bg-green-50' : 'bg-red-50'
                              }`}
                          >
                            <div className="flex items-center space-x-2">
                              {event.type === 'available' ? (
                                <FiCheckCircle className="text-green-500 w-4 h-4" />
                              ) : (
                                <FiXCircle className="text-red-500 w-4 h-4" />
                              )}
                              <span className="text-xs">
                                {moment(event.start).format('MMM DD, HH:mm')} - {moment(event.end).format('HH:mm')}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeAvailabilityEvent(event.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddResourceForm;
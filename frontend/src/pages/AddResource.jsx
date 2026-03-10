import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiDollarSign, 
  FiMapPin, FiUsers, FiMail, FiUser, FiTag,
  FiInfo, FiCheckCircle, FiXCircle, FiClock,
  FiMousePointer, FiCalendar, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import axios from 'axios';

// Setup calendar localizer with time support
const localizer = momentLocalizer(moment);

// Custom Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
    </div>
  </div>
);

// Custom Toolbar Component with centered date and arrow navigation
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
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
      {/* Left side - Today button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={goToToday}
        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
      >
        Aujourd'hui
      </motion.button>

      {/* Center - Date navigation with arrows */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToBack}
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        >
          <FiChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <span className="text-lg font-semibold text-gray-800 min-w-[200px] text-center">
          {label()}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNext}
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        >
          <FiChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Right side - View selector (only Semaine and Jour) */}
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToWeekView}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            toolbar.view === 'week' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Semaine
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToDayView}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            toolbar.view === 'day' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Jour
        </motion.button>
      </div>
    </div>
  );
};

// Availability Event Component with time display and animations
const AvailabilityEvent = ({ event }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className={`h-full w-full rounded-md px-2 py-1 text-xs font-medium ${
      event.type === 'available' 
        ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
        : 'bg-red-100 text-red-800 border-l-4 border-red-500'
    }`}
  >
    <div className="flex items-center space-x-1">
      <FiClock className="w-3 h-3" />
      <span>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</span>
    </div>
    <div className="font-semibold mt-0.5">
      {event.type === 'available' ? '✓ Disponible' : '✗ Indisponible'}
    </div>
  </motion.div>
);

// Custom Time Slot Component with click animation
const TimeSlotWrapper = ({ children, value, onSelectSlot }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    
    // Create a slot selection for this specific time
    const endTime = moment(value).add(30, 'minutes').toDate();
    onSelectSlot({ start: value, end: endTime });
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{
        scale: isClicked ? 0.95 : 1,
        backgroundColor: isHovered ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.95 }}
    >
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

// Custom Time Column Header with animation
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
          className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-full"
        />
      )}
    </motion.div>
  );
};

// Custom Date Cell with animation
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-purple-200 rounded pointer-events-none"
        />
      )}
    </motion.div>
  );
};

const AddResourceForm = () => {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Form state matching your backend structure
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

  // Calendar state with time support
  const [availabilityEvents, setAvailabilityEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarView, setCalendarView] = useState('week');
  const [showSelectionTooltip, setShowSelectionTooltip] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update form date fields when calendar events change
  useEffect(() => {
    if (availabilityEvents.length > 0) {
      // Find the earliest start date and latest end date
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

  // Handle drag events for media upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event for media
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

  // Process files (your handleMediaChange equivalent)
  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Update mediaFiles for FormData
    setMediaFiles(prev => [...prev, ...imageFiles]);
    
    // Create previews for display
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
        // Also remove from mediaFiles
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

  // Add availability range with time
  const addAvailabilityRange = (type) => {
    if (!selectedRange) return;

    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: type === 'available' ? 'Available' : 'Unavailable',
      start: selectedRange.start,
      end: selectedRange.end,
      type: type,
      allDay: false
    };

    setAvailabilityEvents(prev => [...prev, newEvent]);
    setSelectedRange(null);
  };

  // Remove availability event
  const removeAvailabilityEvent = (eventId) => {
    setAvailabilityEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Handle form submission with your exact backend logic
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    setIsSubmitting(true);

    const resourceData = new FormData();

    Object.keys(formData).forEach((key) => {
      resourceData.append(key, formData[key]);
    });

    for (let i = 0; i < mediaFiles.length; i++) {
      resourceData.append("media", mediaFiles[i]);
    }

    resourceData.append(
      "availability",
      JSON.stringify(availabilityEvents)
    );

    const response = await axios.post(
      "http://localhost:5000/api/ressources/add_ressource",
      resourceData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Ressource ajoutée :", response.data);

    setMessage("Ressource ajoutée avec succès !");

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

  // Calendar components with animations and custom toolbar
  const CalendarComponents = {
    event: AvailabilityEvent,
    timeSlotWrapper: (props) => (
      <TimeSlotWrapper {...props} onSelectSlot={handleSelectRange} />
    ),
    timeGutterWrapper: TimeColumnWrapper,
    dateCellWrapper: DateCellWrapper,
    toolbar: CustomToolbar
  };

  // Custom calendar messages
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ajouter une ressource</h1>
          <p className="text-gray-600 mt-2">Remplissez les détails pour ajouter une nouvelle ressource</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resource Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    placeholder="e.g., Grande Salle de Bal"
                    required
                  />
                </div>

                {/* Description */}
                <div>
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
                </div>

                {/* Type and Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix
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
                  </div>
                </div>

                {/* Location and Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacité
                    </label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="Max personnes"
                      />
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
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
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
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
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
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
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                      dragActive 
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
                      <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Glissez-déposez des images ici, ou cliquez pour sélectionner
                      </p>
                    </div>
                  </div>

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
                            className="relative group"
                          >
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeMedia(file.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Display */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg ${
                      message.includes("succès") 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}

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
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Ajout en cours...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Ajouter la ressource</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Calendrier de disponibilité</h2>
                <div className="flex items-center space-x-2">
                  <Tooltip text="Marquer comme disponible">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addAvailabilityRange('available')}
                      disabled={!selectedRange}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiCheckCircle className="w-5 h-5" />
                    </motion.button>
                  </Tooltip>
                  <Tooltip text="Marquer comme indisponible">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addAvailabilityRange('unavailable')}
                      disabled={!selectedRange}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiXCircle className="w-5 h-5" />
                    </motion.button>
                  </Tooltip>
                </div>
              </div>

              {/* Animated Selection Tooltip */}
              <AnimatePresence>
                {showSelectionTooltip && selectedRange && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 p-3 bg-purple-100 text-purple-700 rounded-lg flex items-center space-x-2"
                  >
                    <FiInfo className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Plage sélectionnée: {moment(selectedRange.start).format('MMM DD, HH:mm')} - {moment(selectedRange.end).format('HH:mm')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Time-based Calendar with Custom Toolbar */}
              <div className="calendar-container rounded-lg overflow-hidden border border-gray-200">
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
              </div>

              {/* Legend and Selected Range Info */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded"></div>
                    <span className="text-sm text-gray-600">Indisponible</span>
                  </div>
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
              </div>

              {/* Active Availability List */}
              {availabilityEvents.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
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
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            event.type === 'available' ? 'bg-green-50' : 'bg-red-50'
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
                            whileHover={{ scale: 1.1 }}
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
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddResourceForm;
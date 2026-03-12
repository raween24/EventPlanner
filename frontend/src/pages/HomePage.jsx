import { Calendar, Clock, Shield, Star, Menu, X, ChevronRight, MapPin, Users, CreditCard, Sparkles, Mail, Phone, MapPinned, Send, ChevronDown, LogOut, User, ShoppingCart, LayoutDashboard, PlusCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import about from "../assets/about.png";
import mariageImg from "../assets/mariage.jpg";
import conferenceImg from "../assets/conference.jpg";
import anniversaireImg from "../assets/anniversaire.jpg";
import seminaireImg from "../assets/seminaire.jpg";
import reunionImg from "../assets/reunion.jpg";
import festivalImg from "../assets/festival.jpg";
import Footer from "../components/footer";
import DomeGallery from '../components/DomeGallery';

const events = [
  { title: "Mariage", image: mariageImg, category: "Célébration" },
  { title: "Conférence", image: conferenceImg, category: "Professionnel" },
  { title: "Anniversaire", image: anniversaireImg, category: "Privé" },
  { title: "Séminaire", image: seminaireImg, category: "Formation" },
  { title: "Réunion d'entreprise", image: reunionImg, category: "Corporate" },
  { title: "Festival", image: festivalImg, category: "Culturel" },
];

const slides = [
  {
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    bg: "from-blue-500 via-purple-500 to-pink-500"
  },
  {
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200",
    bg: "from-blue-500 via-purple-500 to-pink-500"
  },
  {
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200",
    bg: "from-blue-500 via-purple-500 to-pink-500"
  },
  {
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200",
    bg: "from-blue-500 via-purple-500 to-pink-500"
  }
];

const faqData = [
  {
    question: "Comment créer un événement sur Smart Event Planner ?",
    answer: "C'est simple ! Cliquez sur 'Créer un événement', remplissez les informations de base (type d'événement, date, lieu), et notre système vous guidera pas à pas pour ajouter les détails et ressources nécessaires."
  },
  {
    question: "Les paiements sont-ils sécurisés ?",
    answer: "Absolument ! Nous utilisons un système de paiement crypté de niveau bancaire. Toutes vos transactions sont protégées et nous ne stockons jamais vos informations de paiement sensibles."
  },
  {
    question: "Comment devenir prestataire partenaire ?",
    answer: "Pour devenir prestataire, cliquez sur 'Devenir prestataire' dans la section CTA. Vous devrez créer un compte professionnel et fournir vos informations d'identification. Notre équipe validera votre profil sous 48h."
  },
  {
    question: "Puis-je modifier mon événement après l'avoir créé ?",
    answer: "Oui, vous pouvez modifier les détails de votre événement à tout moment depuis votre tableau de bord. Les prestataires seront automatiquement notifiés des changements importants."
  },
  {
    question: "Quels types d'événements puis-je organiser ?",
    answer: "Notre plateforme supporte tous types d'événements : mariages, conférences, séminaires, anniversaires, réunions d'entreprise, festivals, et bien plus encore !"
  },
  {
    question: "Y a-t-il des frais d'utilisation ?",
    answer: "L'inscription est gratuite ! Nous proposons différents forfaits selon vos besoins. Le forfait de base est gratuit avec des fonctionnalités essentielles, et nos forfaits premium offrent des options avancées."
  }
];

const UserAvatar = ({ user, size = "md", showOnlineStatus = true }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl"
  };

  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const hasImage = user?.image && user.image !== null && user.image !== undefined && user.image !== '';

  useEffect(() => {
    if (hasImage) {
      setLoading(true);
      setImageError(false);
    }
  }, [user?.image]);

  if (hasImage && !imageError) {
    const fileName = user.image.split('\\').pop().split('/').pop();
    const imageUrl = `http://localhost:5000/uploads/${fileName}`;

    return (
      <div className="relative">
        {loading && (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg animate-pulse`}>
            {user?.firstname?.charAt(0).toUpperCase()}
            {user?.lastname?.charAt(0).toUpperCase()}
          </div>
        )}
        <img
          key={imageUrl}
          src={imageUrl}
          alt={`${user.firstname} ${user.lastname}`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg ${loading ? 'hidden' : 'block'}`}
          onLoad={() => { setLoading(false); setImageError(false); }}
          onError={() => {
            if (retryCount < 2) {
              setRetryCount(prev => prev + 1);
              setTimeout(() => { setImageError(false); setLoading(true); }, 1000);
            } else {
              setImageError(true);
              setLoading(false);
            }
          }}
        />
        {showOnlineStatus && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg`}>
        {user?.firstname?.charAt(0).toUpperCase()}
        {user?.lastname?.charAt(0).toUpperCase()}
      </div>
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const profileMenuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    }, 1500);
  };

  const features = [
    {
      icon: Calendar,
      title: "Réservation intelligente",
      description: "Réservez vos salles, traiteurs et décorateurs en un clic grâce à notre système intuitif.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "Recommandation AI",
      description: "Notre IA vous suggère les meilleures ressources selon votre budget et localisation.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Agenda interactif",
      description: "Visualisez les disponibilités en temps réel et évitez les conflits de planning.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "Transactions 100% sécurisées avec protection des données et confirmation instantanée.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const getNavLinks = () => [
    { name: "Accueil", path: "/" },
    { name: "Événements", path: "/evenements" },
    { name: "Ressources", path: "/les_ressources" },
    { name: "Contact", path: "#contact" }
  ];

  const ProfileMenu = () => (
    <div className="relative" ref={profileMenuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <UserAvatar user={user} size="md" showOnlineStatus={true} />
        <span className="text-gray-700 font-medium hidden lg:block">{user?.firstname}</span>
        <motion.div
          animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="sm" showOnlineStatus={false} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Connecté en tant que</p>
                  <p className="font-semibold text-gray-900">{user?.firstname} {user?.lastname}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {[
                { label: "Mon Profil", path: "/profil", icon: User, iconColor: "text-blue-600", show: true },
                { label: "Mon Panier", path: "/panier", icon: ShoppingCart, iconColor: "text-purple-600", show: role === "organisateur", badge: "0" },
                { label: "Tableau de bord", path: role === "organisateur" ? "/dashboard-organisateur" : "/dashboard-prestataire", icon: LayoutDashboard, iconColor: "text-green-600", show: true },
                { label: "Publier une ressource", path: "/add-resource", icon: PlusCircle, iconColor: "text-orange-600", show: role === "prestataire" },
              ].filter(item => item.show).map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  whileHover={{ x: 5, backgroundColor: "rgb(239 246 255)" }}
                  onClick={() => { navigate(item.path); setIsProfileMenuOpen(false); setIsOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 transition-colors"
                >
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-1 rounded-full">{item.badge}</span>
                  )}
                </motion.button>
              ))}

              <div className="my-2 border-t border-gray-100"></div>

              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                whileHover={{ x: 5, backgroundColor: "rgb(254 242 242)" }}
                onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                className="w-full px-4 py-3 flex items-center gap-3 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans antialiased">

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-4' : 'bg-white/80 py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventPlanner
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {getNavLinks().map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => {
                  if (item.path.startsWith('#')) {
                    document.getElementById(item.path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(item.path);
                  }
                }}
                className="relative text-gray-700 hover:text-blue-600 font-medium group transition-colors duration-200"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.button>
            ))}

            {!user ? (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(37,99,235,0.35)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
              >
                Connexion
              </motion.button>
            ) : (
              <ProfileMenu />
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen
                ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6 text-gray-700" /></motion.div>
                : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-6 h-6 text-gray-700" /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg"
            >
              <div className="px-6 py-4 space-y-3">
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="lg" showOnlineStatus={true} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user?.firstname} {user?.lastname}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {getNavLinks().map((item, i) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                    whileHover={{ x: 10 }}
                    onClick={() => {
                      if (item.path.startsWith('#')) {
                        document.getElementById(item.path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                      } else { navigate(item.path); }
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}

                {user && (
                  <>
                    <div className="border-t border-gray-100 my-2"></div>
                    {[
                      { label: "Mon Profil", path: "/profil", icon: User, color: "text-blue-600", show: true },
                      { label: "Mon Panier", path: "/panier", icon: ShoppingCart, color: "text-purple-600", show: role === "organisateur" },
                      { label: "Tableau de bord", path: role === "organisateur" ? "/dashboard-organisateur" : "/dashboard-prestataire", icon: LayoutDashboard, color: "text-green-600", show: true },
                      { label: "Publier une ressource", path: "/add-resource", icon: PlusCircle, color: "text-orange-600", show: role === "prestataire" },
                    ].filter(i => i.show).map((item, i) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 + 0.25 }}
                        whileHover={{ x: 10 }}
                        onClick={() => { navigate(item.path); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ x: 10 }}
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </motion.button>
                  </>
                )}

                {!user && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { navigate("/login"); setIsOpen(false); }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
                  >
                    Connexion
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(168,85,247,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Bienvenue, {user.firstname} 👋</span>
                </motion.div>
              )}

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                {["Planifiez vos", "Événements", "en toute simplicité"].map((line, i) => (
                  <motion.span
                    key={line}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                    className={`block ${i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" : ""}`}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                {!user && "Créez, gérez et organisez des événements mémorables avec notre plateforme intelligente."}
                {role === "organisateur" && "Accédez à toutes les ressources nécessaires pour organiser vos événements."}
                {role === "prestataire" && "Publiez vos services et gérez vos réservations facilement."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {!user && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/signup")}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Commencer maintenant
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.span>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                        initial={{ x: "100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/login")}
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-lg transition-all duration-200"
                    >
                      Se connecter
                    </motion.button>
                  </>
                )}

                {role === "organisateur" && (
                  <>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/les_ressources")} className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all">🔍 Voir les ressources</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/dashboard-organisateur")} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg">📊 Mon Dashboard</motion.button>
                  </>
                )}

                {role === "prestataire" && (
                  <>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/les_ressources")} className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all">🔍 Explorer</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/add-resource")} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg">+ Publier une ressource</motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.92, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.92, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                      <img src={slides[currentSlide].image} alt="Event" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  {slides.map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentSlide(index)}
                      animate={{ width: index === currentSlide ? 32 : 10 }}
                      transition={{ duration: 0.3 }}
                      className={`h-2.5 rounded-full transition-colors duration-300 ${index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/30 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* ── À PROPOS ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              À propos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Smart Event Planner</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme intelligente qui révolutionne l'organisation d'événements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Smart Event Planner est une application web intelligente conçue pour simplifier et moderniser l'organisation des événements. Elle offre une plateforme centralisée permettant aux organisateurs de planifier efficacement leurs projets tout en collaborant avec des prestataires qualifiés.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Grâce à une gestion des disponibilités en temps réel et une interface intuitive, notre solution réduit les conflits, optimise les ressources et améliore l'expérience utilisateur.
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4 pt-4 flex-wrap"
                >
                  {["Innovation", "Fiabilité", "Simplicité"].map((tag, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium cursor-default transition-colors hover:bg-blue-100"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-3 scale-105 opacity-10" />
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                src={about}
                alt="Smart Event Planner"
                className="relative rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">EventPlanner ?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des fonctionnalités puissantes pour une organisation sans stress
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group"
              >
                <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <motion.div
                    animate={{ scale: hoveredFeature === index ? 1.15 : 1, rotate: hoveredFeature === index ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉVÉNEMENTS ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Types <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">d'Événements</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez les différents types d'événements que vous pouvez organiser
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredEvent(index)}
                onHoverEnd={() => setHoveredEvent(null)}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-xl cursor-pointer"
              >
                <motion.img
                  src={item.image}
                  alt={item.title}
                  animate={{ scale: hoveredEvent === index ? 1.08 : 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  animate={{ opacity: hoveredEvent === index ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                />
                <motion.div
                  animate={{
                    y: hoveredEvent === index ? 0 : 16,
                    opacity: hoveredEvent === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 p-6"
                >
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm rounded-full mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {role === "organisateur" && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(37,99,235,0.35)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/CreerEvenement")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Créer votre événement
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── DOME GALLERY ──────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ressources</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de ressources pour tous vos événements
            </p>
          </motion.div>
        </div>
        <div style={{ width: '100vw', height: '80vh' }}>
          <DomeGallery fit={0.8} minRadius={600} maxVerticalRotationDeg={0} segments={34} dragDampening={2} grayscale={false} />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {!user && (
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="relative max-w-5xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à commencer ?</h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Rejoignez des centaines d'organisateurs et prestataires satisfaits
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Devenir organisateur
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(29,78,216,0.9)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold text-lg backdrop-blur-md border border-white/20 hover:bg-blue-800 transition-all"
                >
                  Devenir prestataire
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Questions <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fréquentes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur Smart Event Planner
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.45 }}
                viewport={{ once: true, margin: "-40px" }}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <motion.button
                  whileTap={{ scale: 0.995 }}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5 text-blue-600" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contactez-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Nous</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une question ? Notre équipe est là pour vous répondre
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "Nom complet", name: "name", type: "text", placeholder: "Jean Dupont" },
                    { label: "Email", name: "email", type: "email", placeholder: "jean@email.com" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-blue-300"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-blue-300"
                    placeholder="Demande d'information"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none hover:border-blue-300"
                    placeholder="Bonjour, j'aimerais en savoir plus sur..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(37,99,235,0.35)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus === 'sending'}
                  className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${formStatus === 'sending' ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {formStatus === 'sending' && (
                      <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Envoi en cours...</motion.span>
                    )}
                    {formStatus === 'success' && (
                      <motion.span key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        Message envoyé ! <Mail className="w-5 h-5" />
                      </motion.span>
                    )}
                    {!formStatus && (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        Envoyer le message <Send className="w-5 h-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, bg: "bg-blue-100", color: "text-blue-600", label: "Email", value: "contact@smarteventplanner.com", href: "mailto:contact@smarteventplanner.com" },
                    { icon: Phone, bg: "bg-purple-100", color: "text-purple-600", label: "Téléphone", value: "+216 54 809 630", href: "tel:+21654809630" },
                    { icon: MapPinned, bg: "bg-green-100", color: "text-green-600", label: "Adresse", value: "Sousse, Tunisie", href: null },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        {item.href
                          ? <a href={item.href} className={`font-medium hover:${item.color} transition-colors`}>{item.value}</a>
                          : <p className="text-gray-900 font-medium">{item.value}</p>
                        }
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
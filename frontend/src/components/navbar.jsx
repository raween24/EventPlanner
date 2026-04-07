import {
  Shield, Menu, X, ChevronDown, LogOut, User,
  ShoppingCart, LayoutDashboard, PlusCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

// ─── UserAvatar ───────────────────────────────────────────────────────────────
export const UserAvatar = ({ user, size = "md", showOnlineStatus = true }) => {
  const sizeClasses = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-lg", lg: "w-12 h-12 text-xl" };
  const [imgError, setImgError] = useState(false);

  const getImageUrl = () => {
    if (!user?.image) return null;
    if (user.image.startsWith("http")) return user.image;
    const fileName = user.image.replace(/\\/g, "/").split("/").pop();
    return `http://localhost:5000/uploads/${fileName}`;
  };

  const imageUrl = getImageUrl();
  const initials = `${user?.firstname?.charAt(0) ?? ""}${user?.lastname?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <div className="relative">
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={`${user?.firstname} ${user?.lastname}`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg`}>
          {initials}
        </div>
      )}
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

// ─── AdminAvatar ──────────────────────────────────────────────────────────────
export const AdminAvatar = ({ size = "md", showOnlineStatus = true }) => {
  const sizeClasses = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-lg", lg: "w-12 h-12 text-xl" };
  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg`}>
        <Shield className="w-5 h-5" />
      </div>
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const isAdmin = role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
    if (path.startsWith("#")) {
      // Si on n'est pas sur la home, naviguer d'abord
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(path.substring(1))?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document.getElementById(path.substring(1))?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer le menu mobile au changement de route
  useEffect(() => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Ressources", path: "/les_ressources" },
    { name: "Contact", path: "#contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const ProfileMenu = () => (
    <div className="relative" ref={profileMenuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        {isAdmin
          ? <AdminAvatar size="md" showOnlineStatus={true} />
          : <UserAvatar user={user} size="md" showOnlineStatus={true} />
        }
        <span className="text-gray-700 font-medium hidden lg:block">
          {isAdmin ? "Admin" : user?.firstname}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header du menu */}
            <div className={`px-4 py-3 border-b border-gray-100 ${isAdmin ? "bg-gradient-to-r from-red-50 to-orange-50" : "bg-gradient-to-r from-blue-50 to-purple-50"}`}>
              <div className="flex items-center gap-3">
                {isAdmin
                  ? <AdminAvatar size="sm" showOnlineStatus={false} />
                  : <UserAvatar user={user} size="sm" showOnlineStatus={false} />
                }
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Connecté en tant que</p>
                  <p className="font-semibold text-gray-900">
                    {isAdmin ? "Administrateur" : `${user?.firstname} ${user?.lastname}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="py-2">
              {isAdmin && (
                <motion.button whileHover={{ x: 5 }}
                  onClick={() => { navigate("/dashboard-admin"); setIsProfileMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-red-50 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">Panel Administrateur</span>
                  <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                </motion.button>
              )}

              {role === "prestataire" && (
                <motion.button whileHover={{ x: 5 }}
                  onClick={() => { navigate("/profileP"); setIsProfileMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Mon Profil</span>
                </motion.button>
              )}

              {role === "organisateur" && (
                <motion.button whileHover={{ x: 5 }}
                  onClick={() => { navigate("/profileO"); setIsProfileMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Mon Profil</span>
                </motion.button>
              )}

              {role === "organisateur" && (
                <motion.button whileHover={{ x: 5 }}
                  onClick={() => { navigate("/panier"); setIsProfileMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                  <span>Mon Panier</span>
                  <span className="ml-auto bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-1 rounded-full">0</span>
                </motion.button>
              )}

              {role === "prestataire" && (
                <motion.button whileHover={{ x: 5 }}
                  onClick={() => { navigate("/add-resource"); setIsProfileMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 text-orange-600" />
                  <span>Publier une ressource</span>
                </motion.button>
              )}

              <div className="my-2 border-t border-gray-100" />

              <motion.button whileHover={{ x: 5 }}
                onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-lg shadow-lg py-4" : "bg-white/80 py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            YallaEvents
          </span>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNavClick(item.path)}
              className={`relative font-medium group transition-colors ${
                isActive(item.path) && !item.path.startsWith("#")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                isActive(item.path) && !item.path.startsWith("#") ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </motion.button>
          ))}

          {!user ? (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                Se connecter
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
              >
                S'inscrire
              </motion.button>
            </div>
          ) : (
            <ProfileMenu />
          )}
        </div>

        {/* Burger mobile */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen
            ? <X className="w-6 h-6 text-gray-700" />
            : <Menu className="w-6 h-6 text-gray-700" />
          }
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg"
          >
            <div className="px-6 py-4 space-y-3">

              {/* Profil mobile */}
              {user && (
                <div className={`mb-4 p-4 rounded-xl ${isAdmin ? "bg-gradient-to-r from-red-50 to-orange-50" : "bg-gradient-to-r from-blue-50 to-purple-50"}`}>
                  <div className="flex items-center gap-3">
                    {isAdmin
                      ? <AdminAvatar size="lg" showOnlineStatus={true} />
                      : <UserAvatar user={user} size="lg" showOnlineStatus={true} />
                    }
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {isAdmin ? "Administrateur" : `${user?.firstname} ${user?.lastname}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Liens */}
              {navLinks.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 10 }}
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full text-left py-2 px-4 rounded-lg transition ${
                    isActive(item.path) && !item.path.startsWith("#")
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}

              {/* Actions utilisateur connecté */}
              {user && (
                <>
                  <div className="border-t border-gray-100 my-2" />

                  {isAdmin && (
                    <motion.button whileHover={{ x: 10 }}
                      onClick={() => { navigate("/dashboard-admin"); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg"
                    >
                      <LayoutDashboard className="w-5 h-5 text-red-500" />
                      <span className="font-semibold">Panel Administrateur</span>
                      <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                    </motion.button>
                  )}

                  {role === "prestataire" && (
                    <motion.button whileHover={{ x: 10 }}
                      onClick={() => { navigate("/profileP"); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                    >
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Mon Profil</span>
                    </motion.button>
                  )}

                  {role === "organisateur" && (
                    <motion.button whileHover={{ x: 10 }}
                      onClick={() => { navigate("/profileO"); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                    >
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Mon Profil</span>
                    </motion.button>
                  )}

                  {role === "organisateur" && (
                    <motion.button whileHover={{ x: 10 }}
                      onClick={() => { navigate("/panier"); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                    >
                      <ShoppingCart className="w-5 h-5 text-purple-600" />
                      <span>Mon Panier</span>
                    </motion.button>
                  )}

                  {role === "prestataire" && (
                    <motion.button whileHover={{ x: 10 }}
                      onClick={() => { navigate("/add-resource"); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                    >
                      <PlusCircle className="w-5 h-5 text-orange-600" />
                      <span>Publier une ressource</span>
                    </motion.button>
                  )}

                  <motion.button whileHover={{ x: 10 }}
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </motion.button>
                </>
              )}

              {/* Non connecté */}
              {!user && (
                <div className="flex flex-col gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { navigate("/login"); setIsOpen(false); }}
                    className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  >
                    Se connecter
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { navigate("/signup"); setIsOpen(false); }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
                  >
                    S'inscrire
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
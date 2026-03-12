import { Calendar, Clock, MessageCircle, Shield, Star, Menu, X, ChevronRight, MapPin, Users, CreditCard, Sparkles, Mail, Phone, MapPinned, Send, ChevronDown, LogOut, User, ShoppingCart, LayoutDashboard, PlusCircle } from "lucide-react";
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
  { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200" },
  { image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200" },
  { image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200" },
  { image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200" },
];

export default function HomePage() {

const navigate = useNavigate();
const [isOpen, setIsOpen] = useState(false);
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

const ProfileMenu = () => (

<div className="relative" ref={profileMenuRef}>

<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
className="flex items-center gap-2"
>

<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
{isAdmin ? <Shield /> : user?.firstname?.charAt(0)}
</div>

<span className="hidden lg:block">{isAdmin ? "Admin" : user?.firstname}</span>

<ChevronDown className={`w-4 h-4 ${isProfileMenuOpen ? "rotate-180" : ""}`} />

</motion.button>

<AnimatePresence>

{isProfileMenuOpen && (

<motion.div
initial={{ opacity:0, y:-10 }}
animate={{ opacity:1, y:0 }}
exit={{ opacity:0, y:-10 }}
className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border overflow-hidden z-50"
>

<div className="py-2">

{/* Admin */}

{isAdmin && (

<motion.button
whileHover={{ x:5 }}
onClick={()=>{navigate("/dashboard-admin");setIsProfileMenuOpen(false);}}
className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50"
>

<LayoutDashboard className="w-5 h-5 text-red-500"/>

<span>Panel Administrateur</span>

</motion.button>

)}

{/* Messenger */}

{!isAdmin && (

<motion.button
whileHover={{x:5}}
onClick={()=>{navigate("/message");setIsProfileMenuOpen(false);}}
className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50"
>

<MessageCircle className="w-5 h-5 text-blue-600"/>

<span>Messanger</span>

</motion.button>

)}

{/* Profile */}

{!isAdmin && (

<motion.button
whileHover={{x:5}}
onClick={()=>{navigate("/profil");setIsProfileMenuOpen(false);}}
className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50"
>

<User className="w-5 h-5 text-blue-600"/>

<span>Mon Profil</span>

</motion.button>

)}

{/* Panier */}

{role==="organisateur" && (

<motion.button
whileHover={{x:5}}
onClick={()=>{navigate("/panier");setIsProfileMenuOpen(false);}}
className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50"
>

<ShoppingCart className="w-5 h-5 text-purple-600"/>

<span>Mon Panier</span>

</motion.button>

)}

{/* Dashboard */}

{(role==="organisateur"||role==="prestataire") && (

<motion.button
whileHover={{x:5}}
onClick={()=>{

navigate(role==="organisateur"?"/dashboard-organisateur":"/dashboard-prestataire");

setIsProfileMenuOpen(false);

}}

className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50"
>

<LayoutDashboard className="w-5 h-5 text-green-600"/>

<span>Tableau de bord</span>

</motion.button>

)}

{/* Publier */}

{role==="prestataire" && (

<motion.button
whileHover={{x:5}}
onClick={()=>{navigate("/add-resource");setIsProfileMenuOpen(false);}}
className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50"
>

<PlusCircle className="w-5 h-5 text-orange-600"/>

<span>Publier une ressource</span>

</motion.button>

)}

<div className="border-t my-2"></div>

<motion.button
whileHover={{x:5}}
onClick={()=>{handleLogout();setIsProfileMenuOpen(false);}}
className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50"
>

<LogOut className="w-5 h-5"/>

<span>Déconnexion</span>

</motion.button>

</div>

</motion.div>

)}

</AnimatePresence>

</div>

);

return (

<div>

<nav className="fixed w-full bg-white shadow flex justify-between items-center px-6 py-4">

<div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate("/")}>
<Sparkles/>
<span className="font-bold text-xl">EventPlanner</span>
</div>

<div className="hidden md:flex gap-6">

<button onClick={()=>navigate("/")}>Accueil</button>

<button onClick={()=>navigate("/evenements")}>Événements</button>

<button onClick={()=>navigate("/les_ressources")}>Ressources</button>

</div>

{user ? <ProfileMenu/> :

<button onClick={()=>navigate("/login")} className="bg-blue-600 text-white px-4 py-2 rounded">
Connexion
</button>

}

</nav>

<div className="pt-32 text-center">

<h1 className="text-5xl font-bold">Smart Event Planner</h1>

<p className="mt-4 text-gray-600">Organisez vos événements facilement</p>

</div>

<Footer/>

</div>

);

}
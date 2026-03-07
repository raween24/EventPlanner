import { Calendar, Clock, Shield, Star, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularEvents from "../components/CircularCards";
import Footer from "../components/footer";
import backg from "../assets/backgrouand.mp4";
import about from "../assets/about.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; // "organisateur" | "prestataire" | undefined

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // reload complet pour reset l'état
  };

  const features = [
    {
      icon: Calendar,
      title: "Réservation intelligente",
      description: "Réservez vos salles, traiteurs, décorateurs et autres ressources facilement grâce à un système rapide et intuitif.",
    },
    {
      icon: Star,
      title: "Recommandation intelligente (AI)",
      description: "Notre système intelligent vous propose les meilleures ressources selon votre type d'événement, budget et localisation.",
    },
    {
      icon: Clock,
      title: "Agenda interactif",
      description: "Visualisez les disponibilités en temps réel et évitez les conflits de planning grâce au calendrier dynamique.",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "Effectuez vos paiements en ligne en toute sécurité avec protection des données et confirmation instantanée.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">

      {/* ============================= NAVBAR ============================= */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1
            className="text-3xl font-bold text-blue-600 cursor-pointer"
            onClick={() => window.location.href = "/"}
          >
            EventPlanner
          </h1>

          {/* ── DESKTOP ── */}
          <div className="hidden md:flex gap-8 items-center">

            {/* Lien Accueil visible par tous */}
            <button
              onClick={() => window.location.href = "/"}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Accueil
            </button>

            {/* ── NON CONNECTÉ : aucun bouton d'action, juste "Se connecter" ── */}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Connexion
              </button>
            )}

            {/* ── ORGANISATEUR ── */}
            {role === "organisateur" && (
              <>
                <button onClick={() => navigate("/les_ressources")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Ressources
                </button>
                <button onClick={() => navigate("/panier")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Panier
                </button>
                <button onClick={() => navigate("/dashboard-organisateur")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </button>
                <button onClick={() => navigate("/profil")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Profil
                </button>
                <span className="text-gray-500 text-sm">👤 {user.firstname}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            )}

            {/* ── PRESTATAIRE ── */}
            {role === "prestataire" && (
              <>
                <button onClick={() => navigate("/les_ressources")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Ressources
                </button>
                <button onClick={() => navigate("/dashboard-prestataire")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Mes ressources
                </button>
                <button onClick={() => navigate("/add-resource")} className="text-gray-700 hover:text-blue-600 font-medium">
                  Publier
                </button>
                <span className="text-gray-500 text-sm">👤 {user.firstname}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            )}
          </div>

          {/* MOBILE burger */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {isOpen && (
          <div className="md:hidden bg-white px-4 pb-4 space-y-3 shadow-md">
            <button onClick={() => window.location.href = "/"} className="block w-full text-left text-gray-700 hover:text-blue-600">
              Accueil
            </button>

            {!user && (
              <button onClick={() => navigate("/login")} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
                Connexion
              </button>
            )}

            {role === "organisateur" && (
              <>
                <button onClick={() => navigate("/les_ressources")} className="block w-full text-left text-gray-700 hover:text-blue-600">Ressources</button>
                <button onClick={() => navigate("/panier")} className="block w-full text-left text-gray-700 hover:text-blue-600">Panier</button>
                <button onClick={() => navigate("/dashboard-organisateur")} className="block w-full text-left text-gray-700 hover:text-blue-600">Dashboard</button>
                <button onClick={() => navigate("/profil")} className="block w-full text-left text-gray-700 hover:text-blue-600">Profil</button>
                <button onClick={handleLogout} className="w-full px-4 py-2 border border-red-400 text-red-500 rounded-lg">Déconnexion</button>
              </>
            )}

            {role === "prestataire" && (
              <>
                <button onClick={() => navigate("/les_ressources")} className="block w-full text-left text-gray-700 hover:text-blue-600">Ressources</button>
                <button onClick={() => navigate("/dashboard-prestataire")} className="block w-full text-left text-gray-700 hover:text-blue-600">Mes ressources</button>
                <button onClick={() => navigate("/add-resource")} className="block w-full text-left text-gray-700 hover:text-blue-600">Publier</button>
                <button onClick={handleLogout} className="w-full px-4 py-2 border border-red-400 text-red-500 rounded-lg">Déconnexion</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ============================= HERO ============================= */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
          <source src={backg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 max-w-4xl px-4 text-white">

          {user && (
            <p className="text-blue-300 text-lg mb-2 font-medium">Bienvenue, {user.firstname} 👋</p>
          )}

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Planifiez Vos Événements
            <span className="block text-blue-400 mt-2">En Toute Simplicité</span>
          </h1>

          <p className="text-xl mb-10 opacity-90">
            La plateforme complète pour connecter organisateurs et prestataires d'événements.
          </p>

          {/* ── Hero CTA : AUCUN bouton si non connecté ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            {/* NON CONNECTÉ : rien, juste un message */}
            {!user && (
              <p className="text-blue-200 text-lg italic">
                Connectez-vous pour accéder aux fonctionnalités
              </p>
            )}

            {/* ORGANISATEUR */}
            {role === "organisateur" && (
              <>
                <button
                  onClick={() => navigate("/les_ressources")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  🔍 Voir les ressources
                </button>
                <button
                  onClick={() => navigate("/dashboard-organisateur")}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg"
                >
                  📊 Mon Dashboard
                </button>
              </>
            )}

            {/* PRESTATAIRE */}
            {role === "prestataire" && (
              <>
                <button
                  onClick={() => navigate("/les_ressources")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  🔍 Voir les ressources
                </button>
                <button
                  onClick={() => navigate("/add-resource")}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg"
                >
                  + Publier une ressource
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ============================= ABOUT ============================= */}
      <section className="py-20 bg-slate-50">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-6">
          À propos de Smart Event Planner
        </h2>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-slate-600 leading-relaxed mb-4">
              Smart Event Planner est une application web intelligente conçue pour simplifier et moderniser l'organisation des événements.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Grâce à une gestion des disponibilités en temps réel et une interface intuitive, notre solution réduit les conflits et optimise les ressources.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Que ce soit pour des mariages, conférences, séminaires ou événements privés, Smart Event Planner transforme vos idées en expériences réussies.
            </p>
          </div>
          <div>
            <img src={about} alt="Smart Event Planner" className="rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* ============================= FEATURES ============================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">Tout ce dont vous avez besoin</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-blue-50 hover:shadow-md transition">
                <f.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CircularEvents />
      <Footer />
    </div>
  );
}
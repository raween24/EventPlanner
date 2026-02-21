import { Calendar, Clock, Shield, Star, Menu } from "lucide-react";
import { useState,useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import backg from "../assets/backgrouand.mp4";
import about from "../assets/about.png";
import mariageImg from "../assets/mariage.jpg";
import conferenceImg from "../assets/conference.jpg";
import anniversaireImg from "../assets/anniversaire.jpg";
import seminaireImg from "../assets/seminaire.jpg";
import reunionImg from "../assets/reunion.jpg";
import festivalImg from "../assets/festival.jpg";
import CircularEvents from "../components/CircularCards";
import Footer from "../components/footer"

const events = [
  { title: "Mariage", image: mariageImg },
  { title: "Conférence", image: conferenceImg },
  { title: "Anniversaire", image: anniversaireImg },
  { title: "Séminaire", image: seminaireImg },
  { title: "Réunion d’entreprise", image: reunionImg },
  { title: "Festival", image: festivalImg },
];


export default function HomePage({ onNavigate }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const features = [
    {
      icon: Calendar,
      title: "Réservation intelligente",
      description:
        "Réservez vos salles, traiteurs, décorateurs et autres ressources facilement grâce à un système rapide et intuitif.",
    },
    {
      icon: Star,
      title: "Recommandation intelligente (AI)",
      description:
        "Notre système intelligent vous propose les meilleures ressources selon votre type d’événement, budget et localisation.",
    },
    {
      icon: Clock,
      title: "Agenda interactif",
      description:
        "Visualisez les disponibilités en temps réel et évitez les conflits de planning grâce au calendrier dynamique.",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description:
        "Effectuez vos paiements en ligne en toute sécurité avec protection des données et confirmation instantanée.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
     <nav className="bg-white shadow-md fixed w-full z-50">
     <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-blue-600 cursor-pointer">
            EventPlanner
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <button
              onClick={() =>  navigate("/")}
              className="text-gray-700  hover:text-blue-600 font-medium"
            >
              Acceuil
            </button>
            <button
              onClick={() =>  navigate("/")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              evenement
            </button>
            <button
              onClick={() =>  navigate("/")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Ressources
            </button>
            <button
              onClick={() =>  navigate("/")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              contacter
            </button>
            <button
            onClick={() =>  navigate("/login")}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
              Connexion
            </button>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white px-4 pb-4 space-y-3 shadow-md">
            <button
              onClick={() => navigate("/")}
              className="block w-full text-left text-gray-700 hover:text-blue-600"
            >
              accueil
            </button>
            <button
              onClick={() => navigate("/")}
              className="block w-full text-left text-gray-700 hover:text-blue-600"
            >
              evenement
            </button>
            <button
              onClick={() => navigate("/")}
              className="block w-full text-left text-gray-700 hover:text-blue-600"
            >
              ressources
            </button>
            <button
              onClick={() => navigate("/")}
              className="block w-full text-left text-gray-700 hover:text-blue-600"
            >
              contacter
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Connexion
            </button>
          </div>
        )}
      </nav>
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

        <video
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="absolute top-0 left-0 w-full h-full object-cover"
>
  <source src={backg} type="video/mp4" />
</video>

        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 max-w-4xl px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Planifiez Vos Événements
            <span className="block text-blue-400 mt-2">
              En Toute Simplicité
            </span>
          </h1>

          <p className="text-xl mb-10 opacity-90">
            La plateforme complète pour connecter organisateurs et prestataires
            d'événements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>  navigate("/CreerEvenement")}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg"
            >
              cree un evenement
            </button>

            <button
              onClick={() =>  navigate("/les_ressources")}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg"
            >
              voir les ressources
            </button>
          </div>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
      <h2 className="text-4xl font-bold text-center text-slate-800 mb-6">
        À propos de Smart Event Planner
      </h2>
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">


   
    <div>
     

      <p className="text-slate-600 leading-relaxed mb-4">
        Smart Event Planner est une application web intelligente conçue
        pour simplifier et moderniser l’organisation des événements.
        Elle offre une plateforme centralisée permettant aux organisateurs
        de planifier efficacement leurs projets tout en collaborant
        avec des prestataires qualifiés.
      </p>

      <p className="text-slate-600 leading-relaxed mb-4">
        Grâce à une gestion des disponibilités en temps réel et une
        interface intuitive, notre solution réduit les conflits,
        optimise les ressources et améliore l’expérience utilisateur.
      </p>

      <p className="text-slate-600 leading-relaxed">
        Que ce soit pour des mariages, conférences, séminaires ou
        événements privés, Smart Event Planner transforme vos idées
        en expériences réussies.
      </p>
    </div>
    <div>
      <img
        src={about}
        alt="Smart Event Planner"
        className="rounded-2xl shadow-lg"
      />
    </div>

  </div>
  
</section>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir EventPlanner ?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            les evenement assurer par nous </h2>
            <div className="py-20 bg-slate-50">
  

    {/* Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

      {events.map((item, index) => (
        <div 
          key={index}
          className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
        >

          {/* Image */}
          <img
            src={item.image}
            alt="event"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>

          {/* Text */}
          <div className="absolute bottom-6 left-6 right-6 translate-y-10 opacity-0 
                          group-hover:translate-y-0 group-hover:opacity-100 
                          transition-all duration-500">
            <h3 className="text-white text-xl font-semibold">
              {item.title}
            </h3>
            </div>

        </div>
      ))}

    </div>

  </div>
  <button
  onClick={() => navigate("/CreerEvenement")}
  className="block mx-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg"
>
  Créer un événement
</button>

</div>
      
      </section>
      <CircularEvents />
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h2>

          <p className="text-xl mb-8 opacity-90">
            Rejoignez des centaines d'organisateurs et prestataires satisfaits
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("organizer")}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Explorer les ressources
            </button>

            <button
              onClick={() => onNavigate("provider")}
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all"
            >
              Devenir prestataire
            </button>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
}
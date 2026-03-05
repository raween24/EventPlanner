import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, ShoppingBag, Heart, Edit2 } from "lucide-react";

const PanierRessources = () => {
  const [ressources, setRessources] = useState([]);
  const [suppressionAnimation, setSuppressionAnimation] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= GET FAVORIS ================= */
  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/panier/69a8c52f6569c98c92277acb"
        );

        console.log("DATA:", response.data);
        setRessources(response.data);
      } catch (error) {
        console.error("Erreur chargement panier:", error);
      }
    };

    fetchRessources();
  }, []);

  /* ================= CALCUL TOTAL ================= */
  const totalRessources = ressources.length;

  const prixTotal = ressources
    .reduce((acc, res) => acc + Number(res.price || 0), 0)
    .toFixed(2);

  /* ================= SUPPRESSION ================= */
  const handleSuppression = async (id) => {
    try {
      setSuppressionAnimation(id);

      await axios.delete("http://localhost:5000/api/users/remove", {
        data: {
          userId: "69a8c52f6569c98c92277acb",
          resourceId: id,
        },
      });

      setTimeout(() => {
        setRessources((prev) => prev.filter((res) => res._id !== id));
        setSuppressionAnimation(null);
      }, 300);
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    alert("Commande validée ✅");
    setRessources([]);
  };

  /* ================= GET IMAGE ================= */
  const getImage = (ressource) => {
    if (
      ressource.media &&
      ressource.media.length > 0 &&
      ressource.media[0].img_vd &&
      ressource.media[0].img_vd.length > 0
    ) {
     return ressource.media[0].img_vd[0];
    }

    return "https://via.placeholder.com/400x300?text=No+Image";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <h1 className="text-3xl font-bold text-gray-800">
            Mes Ressources Adorées
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          {totalRessources} ressource(s) dans votre panier
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LISTE */}
          <div className="flex-1 space-y-4">
            {ressources.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Votre panier est vide
                </h3>
              </div>
            )}

            {ressources.map((ressource) => (
              <div
                key={ressource._id}
                className={`bg-white rounded-xl shadow-md transition-all duration-300 ${
                  suppressionAnimation === ressource._id
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row">

                  {/* IMAGE */}
                  <div className="sm:w-60 h-48 bg-gray-100">
                    <img
                      src={getImage(ressource)}
                      alt={ressource.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENU */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {ressource.name}
                        </h3>

                        <p className="text-gray-600 text-sm mt-2">
                          {ressource.description}
                        </p>

                        <p className="text-sm text-indigo-600 mt-2">
                          Type : {ressource.type}
                        </p>

                        <p className="text-sm text-gray-500">
                          Localisation : {ressource.location}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSuppression(ressource._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X />
                      </button>
                    </div>

                    <div className="mt-4 border-t pt-4 flex justify-between items-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {Number(ressource.price).toFixed(2)} €
                      </div>

                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                        Modifier
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* RÉCAP */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">
                Récapitulatif
              </h2>

              <div className="flex justify-between mb-3">
                <span>Nombre</span>
                <span>{totalRessources}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span>Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {prixTotal} €
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                Valider l'achat total
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PanierRessources;
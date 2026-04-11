// recommendationController.js
import {
  getPopularResources,
  getPersonalizedResources,
  getEventBasedResources,
} from "../recommandations/recommendationService.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id; // ← "id" et non "_id" (selon ton middleware)

    if (!userId) {
      // CAS 1 : Non connecté
      const data = await getPopularResources(10);
      return res.json({ case: "popular", data });
    }

    // CAS 2 : Connecté
    const data = await getPersonalizedResources(userId, 10);
    return res.json({ case: "personalized", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur recommandation", error: err.message });
  }
};

export const getEventRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id; // ← "id"
    const eventData = req.body;

    if (!eventData.category) {
      return res.status(400).json({ message: "category est requis" });
    }

    const data = await getEventBasedResources(eventData, userId, 15);
    return res.json({ case: "event", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur recommandation événement", error: err.message });
  }
};
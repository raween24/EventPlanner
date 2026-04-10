import { getRecommendations } from "../services/recommendationService.js";

export const recommend = async (req, res) => {
    try {
        const { userId, eventId } = req.params;

        const recommendations = await getRecommendations(
            userId || null,
            eventId || null
        );
        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });

    } catch (error) {
        console.error("Erreur recommandation:", error);

        res.status(500).json({
            success: false,
            message: "Erreur lors de la recommandation",
            error: error.message
        });
    }
};
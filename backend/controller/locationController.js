import Location from "../model/location.js";
import Event from "../model/event.js";
import Resource from "../model/ressources.js";
import mongoose from "mongoose";


export const createLocation = async (req, res) => {
    try {
        const { event, resource, dateDebut, dateFin } = req.body;

        if (!event || !resource || !dateDebut || !dateFin) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        // ✅ vérifier que l'événement appartient à l'utilisateur
        const eventExists = await Event.findOne({
            _id: event,
            organisateur_id: new mongoose.Types.ObjectId(req.user.id)
        });

        if (!eventExists) {
            return res.status(404).json({
                message: "Événement non trouvé ou non autorisé"
            });
        }

        // ✅ vérifier ressource
        const resourceExists = await Resource.findById(resource);
        if (!resourceExists) {
            return res.status(404).json({
                message: "Ressource non trouvée"
            });
        }


        const conflict = await Location.findOne({
            resource,
            status: "acceptée",
            $or: [
                {
                    dateDebut: { $lte: new Date(dateFin) },
                    dateFin: { $gte: new Date(dateDebut) }
                }
            ]
        });

        if (conflict) {
            return res.status(400).json({
                message: "Ressource déjà réservée pour cette période"
            });
        }

        const newLocation = new Location({
            event,
            resource,
            organisateur: req.user.id,
            dateDebut: new Date(dateDebut),
            dateFin: new Date(dateFin)
        });

        await newLocation.save();

        res.status(201).json({
            message: "Demande envoyée avec succès",
            location: newLocation
        });

    } catch (error) {
        console.error("ERREUR createLocation:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * 📌 2. Voir mes demandes (organisateur)
 */
export const getMyLocations = async (req, res) => {
    try {
        const locations = await Location.find({
            organisateur: req.user.id
        })
            .populate("event")
            .populate("resource");

        res.status(200).json(locations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// backend/controller/locationController.js

export const updateLocationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, dateDebut, dateFin } = req.body;

        // Récupérer la demande
        const location = await Location.findById(id).populate("resource");
        if (["acceptée", "refusée"].includes(location.status)) {
    return res.status(400).json({
        message: "Impossible de modifier une demande déjà traitée"
    });
}
        if (!location) {
            return res.status(404).json({ message: "Demande non trouvée" });
        }

        // Vérifier que l'utilisateur est le prestataire de la ressource
        if (location.organisateur.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Non autorisé" });
        }

        // Si un nouveau statut est fourni, le valider et vérifier les conflits
        if (status && ["acceptée", "refusée"].includes(status)) {
            // Vérifier conflit si acceptée
            if (status === "acceptée") {
                const conflict = await Location.findOne({
                    resource: location.resource._id,
                    status: "acceptée",
                    _id: { $ne: location._id },
                    $or: [
                        {
                            dateDebut: { $lte: location.dateFin },
                            dateFin: { $gte: location.dateDebut }
                        }
                    ]
                });

                if (conflict) {
                    return res.status(400).json({
                        message: "Conflit avec une autre réservation"
                    });
                }
            }
            location.status = status;
        }

        // Si de nouvelles dates sont fournies, les mettre à jour avec vérification
        if (dateDebut && dateFin) {
            const newStart = new Date(dateDebut);
            const newEnd = new Date(dateFin);

            if (newEnd <= newStart) {
                return res.status(400).json({
                    message: "La date de fin doit être après la date de début"
                });
            }

            // Vérifier conflit avec d'autres demandes acceptées (hors celle-ci)
            const conflict = await Location.findOne({
                resource: location.resource._id,
                status: "acceptée",
                _id: { $ne: location._id },
                $or: [
                    {
                        dateDebut: { $lte: newEnd },
                        dateFin: { $gte: newStart }
                    }
                ]
            });

            if (conflict) {
                return res.status(400).json({
                    message: "Ces nouvelles dates entrent en conflit avec une réservation existante"
                });
            }

            location.dateDebut = newStart;
            location.dateFin = newEnd;
        }

        await location.save();

        // Renvoyer la demande mise à jour
        const updatedLocation = await Location.findById(id)
            .populate("event")
            .populate({
                path: "resource",
                populate: ["media", "availability"]
            });

        res.status(200).json({
            message: status ? `Demande ${status}` : "Dates mises à jour",
            location: updatedLocation
        });

    } catch (error) {
        console.error("ERREUR updateLocation:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await Location.findById(id);
        console.log("organisateur DB:", location.organisateur.toString());
        console.log("user token:", req.user.id);
        if (!location) {
            return res.status(404).json({
                message: "Demande non trouvée"
            });
        }

        if (location.organisateur.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "Non autorisé"
            });
        }

        await location.deleteOne();

        res.status(200).json({
            message: "Demande supprimée"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
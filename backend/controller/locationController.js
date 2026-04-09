import Location from "../model/location.js";
import Event from "../model/event.js";
import Resource from "../model/ressources.js";
import mongoose from "mongoose";

// ============================
// ✅ CRÉER UNE DEMANDE (organisateur)
// ============================
export const createLocation = async (req, res) => {
    try {
        const { event, resource, dateDebut, dateFin } = req.body;

        if (!event || !resource || !dateDebut || !dateFin) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        const eventExists = await Event.findOne({
            _id: event,
            organisateur_id: new mongoose.Types.ObjectId(req.user.id)
        });

        if (!eventExists) {
            return res.status(404).json({
                message: "Événement non trouvé ou non autorisé"
            });
        }

        const resourceExists = await Resource.findById(resource);
        if (!resourceExists) {
            return res.status(404).json({
                message: "Ressource non trouvée"
            });
        }

        const existingRequest = await Location.findOne({
            resource: resource,
            organisateur: req.user.id,
            status: { $in: ["en attente", "acceptée"] },
            $or: [
                {
                    dateDebut: { $lte: new Date(dateFin) },
                    dateFin: { $gte: new Date(dateDebut) }
                }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Vous avez déjà une demande pour cette ressource dans cette période"
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

// ============================
// ✅ VOIR MES DEMANDES (organisateur)
// ============================
export const getMyLocations = async (req, res) => {
    try {
        const locations = await Location.find({
            organisateur: req.user.id
        })
            .populate("event")
            .populate("resource");

        res.status(200).json(locations);
    } catch (error) {
        console.error("ERREUR getMyLocations:", error);
        res.status(500).json({ message: error.message });
    }
};

// ============================
// ✅ VOIR LES DEMANDES REÇUES (prestataire)
// ============================
export const getLocationsForProvider = async (req, res) => {
    try {
        const locations = await Location.find()
            .populate({
                path: "resource",
                match: { prestataire: req.user.id }
            })
            .populate("event")
            .populate("organisateur");

        const filtered = locations.filter(loc => loc.resource);
        res.status(200).json(filtered);
    } catch (error) {
        console.error("ERREUR getLocationsForProvider:", error);
        res.status(500).json({ message: error.message });
    }
};

// ============================
// ✅ METTRE À JOUR LE STATUT (prestataire)
// ============================
export const updateStatusByProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const location = await Location.findById(id).populate("resource");

        if (!location) {
            return res.status(404).json({ message: "Demande non trouvée" });
        }

        if (["acceptée", "refusée"].includes(location.status)) {
            return res.status(400).json({
                message: "Demande déjà traitée"
            });
        }

        if (location.resource.prestataire.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Non autorisé (prestataire)" });
        }

        if (!["acceptée", "refusée"].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

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
        await location.save();

        if (status === "acceptée") {
            await Location.updateMany(
                {
                    resource: location.resource._id,
                    _id: { $ne: location._id },
                    status: "en attente",
                    $or: [
                        {
                            dateDebut: { $lte: location.dateFin },
                            dateFin: { $gte: location.dateDebut }
                        }
                    ]
                },
                { $set: { status: "refusée" } }
            );
        }

        res.status(200).json({
            message: `Demande ${status}`,
            location
        });

    } catch (error) {
        console.error("ERREUR updateStatusByProvider:", error);
        res.status(500).json({ message: error.message });
    }
};

// ============================
// ✅ ANNULER UNE DEMANDE (organisateur)
// ============================
export const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findOne({
            _id: req.params.id,
            organisateur: req.user.id,
            status: "en attente"
        });

        if (!location) {
            return res.status(404).json({ message: "Demande non trouvée ou déjà traitée" });
        }

        await location.deleteOne();
        res.status(200).json({ message: "Demande annulée" });
    } catch (error) {
        console.error("ERREUR deleteLocation:", error);
        res.status(500).json({ message: error.message });
    }
};
import Event from "../model/event.js";


// ============================
// ✅ CREATE EVENT
// ============================
const addEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      dateDebut,
      dateFin,
      nombreParticipants,
      ressources_utiliser
    } = req.body;

    const event = new Event({
      title,
      description,
      category,
      type,
      dateDebut,
      dateFin,
      nombreParticipants,
      ressources_utiliser
    });

    await event.save();

    // Populate avant retour
    const populatedEvent = await Event.findById(event._id)
      .populate({
        path: "ressources_utiliser",
        populate: ["media", "availability"]
      });

    res.status(201).json(populatedEvent);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// ============================
// ✅ GET ALL EVENTS
// ============================
const get_all_Event = async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: "ressources_utiliser",
        populate: ["media", "availability"]
      });

    res.status(200).json(events);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// ============================
// ✅ GET EVENT BY ID
// ============================
const get_event_by_id = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: "ressources_utiliser",
        populate: ["media", "availability"]
      });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json(event);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// ============================
// ✅ UPDATE EVENT
// ============================
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    event.title = req.body.title ?? event.title;
    event.description = req.body.description ?? event.description;
    event.category = req.body.category ?? event.category;
    event.type = req.body.type ?? event.type;
    event.dateDebut = req.body.dateDebut ?? event.dateDebut;
    event.dateFin = req.body.dateFin ?? event.dateFin;
    event.nombreParticipants = req.body.nombreParticipants ?? event.nombreParticipants;
    event.ressources_utiliser = req.body.ressources_utiliser ?? event.ressources_utiliser;

    await event.save();

    const updatedEvent = await Event.findById(id)
      .populate({
        path: "ressources_utiliser",
        populate: ["media", "availability"]
      });

    res.status(200).json(updatedEvent);

  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};


// ============================
// ✅ DELETE EVENT
// ============================
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json({ message: "Événement supprimé avec succès" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export {
  addEvent,
  get_all_Event,
  get_event_by_id,
  updateEvent,
  deleteEvent
};
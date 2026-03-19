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
      ressources_utiliser,
      organisateur_id: req.user.id
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate({
        path: "ressources_utiliser",
        populate: ["media", "availability"]
      });


    res.status(201).json(populatedEvent);

  } catch (error) {
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
    const event = await Event.findOne({
      _id: req.params.id,
      organisateur_id: req.user._id
    }).populate({
      path: "ressources_utiliser",
      populate: ["media", "availability"]
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json(event);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ============================
// ✅ UPDATE EVENT
// ============================
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      organisateur_id: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    Object.assign(event, req.body);

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
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organisateur_id: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json({ message: "Événement supprimé" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const get_Event_by_user = async (req, res) => {
  try {
    const events = await Event.find({ organisateur_id: req.params.id }).populate({
      path: "ressources_utiliser",
      populate: ["media", "availability"]
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addEvent,
  get_all_Event,
  get_event_by_id,
  updateEvent, get_Event_by_user,
  deleteEvent
};
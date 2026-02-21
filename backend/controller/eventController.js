import Event from "../model/event.js";

const addEvent = async (req, res) => {
    try {
        const {
            title, description, category, type ,dateDebut,dateFin,nombreParticipants} = req.body;
        const event = new Event({ title, description, category, type,dateDebut,dateFin,nombreParticipants });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.log(error); // affiche l’erreur dans le terminal
        res.status(500).json({ message: error.message });
    }
};
const get_all_Event = async (req, res) => {
    try {
        const event = await Event.find();
        res.status(200).json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
const get_event_by_id = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.status(200).json(event);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Événement non trouvé" });
        }
        event.title = req.body.title || event.title;
        event.description = req.body.description || event.description;
        event.category = req.body.category || event.category;
        event.type = req.body.type || event.type;
        event.dateDebut=req.body.type || event.dateDebut;
        
        event.dateFin=req.body.dateFin || event.dateFin;
        
        event.nombreParticipants=req.body.nombreParticipants || event.nombreParticipants;
        await event.save();

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);
        res.status(200).json(event);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export { addEvent, get_all_Event, get_event_by_id, updateEvent, deleteEvent };
import Conversation from "../model/conversationModel.js";

/* CREATE OR GET CONVERSATION */
export const createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;

        // Vérifier si conversation existe déjà
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, receiverId],
            });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* GET USER CONVERSATIONS */
export const getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id,
        }).populate("participants", "firstname lastname email image");

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
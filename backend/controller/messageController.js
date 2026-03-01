import Message from "../model/messageModel.js";

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user.id,
            text,
        });

        const populatedMessage = await message.populate(
            "sender",
            "firstname lastname email image"
        );

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* GET MESSAGES BY CONVERSATION */
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversation: req.params.conversationId,
        })
            .populate("sender", "firstname lastname email image")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
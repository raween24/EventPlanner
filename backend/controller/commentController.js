import Comment from "../model/commantaire.js";


// CREATE
export const createComment = async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// READ ALL
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate("C_user", "name")
            .populate("C_res", "name");

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// READ BY ID
export const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate("C_user")
            .populate("C_res");

        if (!comment)
            return res.status(404).json({ message: "Comment not found" });

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommentsByResource = async (req, res) => {
    try {
        const comments = await Comment.find({
            C_res: req.params.id,
        })
            .populate("C_user", "name ")
            .populate("C_res", "name")
            .sort({ createdAt: -1 }); // les plus récents en premier

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!comment)
            return res.status(404).json({ message: "Comment not found" });

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment)
            return res.status(404).json({ message: "Comment not found" });

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
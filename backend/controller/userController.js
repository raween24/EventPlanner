import User from "../model/user.js";

const registerUser = async (req, res) => {
    try {
        const {
            identifiant, lastname, firstname, date_de_naissance, email, password, numTel, region, gender, image, role } = req.body;

        const user = new User({ identifiant, lastname, firstname, date_de_naissance, email, password, numTel, region, gender, image, role });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error); // affiche l’erreur dans le terminal
        res.status(500).json({ message: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }
        res.status(200).json(user);
        return res.status(200).json({ message: "Login réussi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }


        user.lastname = req.body.lastname || user.lastname;
        user.firstname = req.body.firstname || user.firstname;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.numTel = req.body.numTel || user.numTel;
        user.region = req.body.region || user.region;
        user.gender = req.body.gender || user.gender;

        await user.save();

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
export { registerUser, getUser, loginUser, updateUser };
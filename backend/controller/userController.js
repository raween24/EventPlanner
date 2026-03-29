import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";


/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
  try {
    const {
      passportOrCid,
      lastname,
      firstname,
      date_de_naissance,
      email,
      password,
      numTel,
      region,
      gender,
      image,
      role
    } = req.body;

    // verifier email existant
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 définir le status automatiquement
    let status = "en_attente";

    if (role === "organisateur") {
      status = "valide";
    }

    if (role === "prestataire") {
      status = "en_attente";
    }

    const user = new User({
      passportOrCid,
      lastname,
      firstname,
      date_de_naissance,
      email,
      password: hashedPassword,
      numTel,
      region,
      gender,
      image: req.file ? req.file.path : image || null,
      role,
      status
    });

    await user.save();
    if (role === "prestataire") {
      try {
        await axios.post("http://localhost:5678/webhook/signup-provider", {
          email: user.email,
          name: user.firstname
        });
      } catch (err) {
        console.log("Erreur envoi email n8n:", err.message);
      }
    }

    res.status(201).json({
      message: "Utilisateur créé",
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // comparer hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // 🚨 Vérification prestataire en attente
    if (user.role === "prestataire" && user.status === "en_attente") {
      return res.status(403).json({
        message: "Votre compte est en attente de validation par l'administrateur",
        status: "pending"
      });
    }

    // JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login réussi",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        status: user.status
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USERS ================= */
const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE USER ================= */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 🔹 éviter écrasement image/password
    const { password, image, ...otherFields } = req.body;

    Object.assign(user, otherFields);

    // 🔐 password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 🖼️ image (🔥 LA PARTIE MANQUANTE)
    if (req.file) {
      user.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      user.image = image;
    }

    await user.save();

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToAdore = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ depuis token
    const { resourceId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // éviter doublon
    if (user.adore.some(id => id.toString() === resourceId)) {
      return res.status(400).json({ message: "Déjà dans les favoris" });
    }

    user.adore.push(resourceId);
    await user.save();

    res.status(200).json({
      message: "Ajouté aux favoris",
      adore: user.adore
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAdore = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({
        path: "adore",
        populate: {
          path: "media"
        }
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user.adore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};const removeFromAdore = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIX
    const { resourceId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.adore = user.adore.filter(
      (id) => id.toString() !== resourceId
    );

    await user.save();

    res.status(200).json({
      message: "Supprimé des favoris",
      adore: user.adore
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  addToAdore,
  removeFromAdore,
  getAdore, getUserById
};
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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
      role,
    } = req.body;

    // verifier email existant
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      image: req.file ? req.file.path : null,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "Utilisateur créé",
      user,
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

    // JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login réussi",
      token,
      user,
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
    const { identifiant } = req.params;

    const user = await User.findById(identifiant);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // update champs
    Object.assign(user, req.body);

    // si password changé → rehash
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, getUser, updateUser };
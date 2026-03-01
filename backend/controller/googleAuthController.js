<<<<<<< HEAD
// backend/controller/googleAuthController.js
=======
>>>>>>> 876a8be65fac73266cbd7234cca327a70b25f6da
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Vérifie le token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    // Cherche l'utilisateur
    let user = await User.findOne({ email });

    if (!user) {
      // Crée un utilisateur Google
      user = await User.create({
        firstname: name?.split(" ")[0] || "Utilisateur",
        lastname: name?.split(" ")[1] || "",
        email,
        googleId: sub,
        image: picture || "",
        password: "", // pas de mot de passe
<<<<<<< HEAD
        role: "user",
=======
        role: undefined ,
>>>>>>> 876a8be65fac73266cbd7234cca327a70b25f6da
      });
    }

    // Génère un JWT
    const appToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token: appToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google auth failed" });
  }
};
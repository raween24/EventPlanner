
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../model/user.js"; // Ton modèle User Mongoose

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // token envoyé par le frontend

    // Vérifie le token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    // Cherche l'utilisateur existant
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstname: name, // ou name.split(" ")[0] si tu veux juste prénom
        email,
        googleId: sub,
        avatar: picture,
        role: "user", // par défaut
      });
    }

    // Génère JWT pour ton app
    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token: appToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Google auth failed" });
  }
};
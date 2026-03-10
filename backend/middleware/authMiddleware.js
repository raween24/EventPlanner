// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la DB
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      // Ajouter info utilisateur à req.user
      req.user = {
        id: user._id,
        role: user.role,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        image_user:user.image,
        provider_name: `${user.firstname} ${user.lastname}`
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  } else {
    return res.status(401).json({ message: "Non autorisé, pas de token" });
  }
};
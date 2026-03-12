// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      req.user = {
        id: user._id,
        role: user.role,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        image_user: user.image,
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

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé — Admin uniquement" });
  }
  next();
};
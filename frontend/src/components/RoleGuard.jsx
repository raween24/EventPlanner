import { Navigate } from "react-router-dom";

export default function RoleGuard({ roles, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // si pas connecté
  if (!user) return <Navigate to="/login" />;

  // si le rôle n'est pas autorisé
  if (!roles.includes(user.role)) return <Navigate to="/" />;

  // sinon, affiche la page
  return children;
}
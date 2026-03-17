import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreerEvenement from "./pages/CreeEvent";
import OrganizerPage from "./pages/OrganizerPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RessourceDetail from "./pages/RessourceDetail";
import AddResource from "./pages/AddResource";
import RoleGuard from "./components/RoleGuard";
import PanierRessources from "./pages/panier";
import AdminDashboard from "./pages/Admindashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/panier" element={<PanierRessources />} />

        {/* ── Admin ── */}
        <Route
          path="/dashboard-admin"
          element={
            <RoleGuard roles={["admin"]}>
              <AdminDashboard />
            </RoleGuard>
          }
        />

        {/* pages organisateur uniquement */}
        <Route
          path="/CreerEvenement"
          element={
            <RoleGuard roles={["organisateur"]}>
              <CreerEvenement />
            </RoleGuard>
          }
        />
      

        {/* ajout de la page AddResource */}
        <Route
          path="/add-resource"
          element={
            <RoleGuard roles={["prestataire"]}>
              <AddResource />
            </RoleGuard>
          }
        />

        {/* pages organisateur + prestataire */}
        <Route
          path="/les_ressources"
          element={
            <RoleGuard roles={["organisateur", "prestataire"]}>
              <OrganizerPage />
            </RoleGuard>
          }
        />
        <Route
          path="/RessourceDetail/:id"
          element={
            <RoleGuard roles={["organisateur", "prestataire"]}>
              <RessourceDetail />
            </RoleGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
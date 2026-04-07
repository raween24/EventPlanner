import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreerEvenement from "./pages/CreeEvent";
import OrganizerPage from "./pages/OrganizerPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RessourceDetail from "./pages/RessourceDetail";
import AddResource from "./pages/AddResource";
import RoleGuard from "./components/RoleGuard";    // ⚠️ ton RoleGuard existant, pas touché
import PanierRessources from "./pages/panier";
import AdminDashboard from "./pages/Admindashboard";
import ProfileOrg from "./pages/ProfilOrganisateur";
import ProfilPres from "./pages/ProfilPrestataire";
import CreatePassword from "./pages/CreatePassword";
import MesDemandes from "./pages/demmandes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/panier" element={<PanierRessources />} />

        {/* Admin */}
        <Route path="/dashboard-admin" element={<RoleGuard roles={["admin"]}><AdminDashboard /></RoleGuard>} />

        {/* Organisateur */}
        <Route path="/CreerEvenement" element={<RoleGuard roles={["organisateur"]}><CreerEvenement /></RoleGuard>} />
        <Route path="/profileO" element={<RoleGuard roles={["organisateur"]}><ProfileOrg /></RoleGuard>} />

        {/* Prestataire */}
        <Route path="/profileP" element={<RoleGuard roles={["prestataire"]}><ProfilPres /></RoleGuard>} />
        <Route path="/add-resource" element={<RoleGuard roles={["prestataire"]}><AddResource /></RoleGuard>} />

        <Route path="/mes-demandes" element={<RoleGuard roles={["prestataire"]}><MesDemandes /></RoleGuard>} />

        {/* Organisateur + Prestataire */}
        <Route path="/les_ressources" element={<OrganizerPage />} />
        <Route path="/RessourceDetail/:id" element={<RessourceDetail />} />
        <Route path="/create-password" element={<CreatePassword />} />
      </Routes>
    </BrowserRouter>
  );

}
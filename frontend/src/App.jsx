import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreerEvenement from "./pages/CreeEvent";
import OrganizerPage from "./pages/OrganizerPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RessourceDetail from "./pages/RessourceDetail";
import PanierRessources from "./pages/panier";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/CreerEvenement" element={<CreerEvenement />} />
        <Route path="/les_ressources" element={<OrganizerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/RessourceDetail/:id" element={<RessourceDetail />} />
                <Route path="/panier" element={<PanierRessources />} />


      </Routes>
    </BrowserRouter>
  );
}
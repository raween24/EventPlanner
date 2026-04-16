import React, { useState } from "react";
import { X, Calendar, ChevronRight, Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import axios from "axios";

/* ═══════════════════════════════════════════
   Normalise une chaîne pour comparaison :
   minuscules + sans accents + sans tirets
═══════════════════════════════════════════ */
const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // supprime accents
    .replace(/[-_\s]+/g, " ")          // tirets/underscores → espace
    .trim();

/* ═══════════════════════════════════════════
   Récupère l'utilisateur depuis localStorage
═══════════════════════════════════════════ */
const getLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

/* ═══════════════════════════════════════════
   STATUTS DE VÉRIFICATION CIN
═══════════════════════════════════════════ */
const CIN_STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",   // envoi vers n8n
  VERIFYING: "verifying",   // attente /api/cin
  SUCCESS: "success",
  ERROR: "error",
};

/* ═══════════════════════════════════════════
   CHAMP CIN — upload + vérification
═══════════════════════════════════════════ */
function CINVerifier({ onVerified }) {
  const [cinFile, setCinFile] = useState(null);
  const [cinError, setCinError] = useState("");
  const [status, setStatus] = useState(CIN_STATUS.IDLE);
  const [mismatch, setMismatch] = useState([]);   // champs qui ne correspondent pas
  const [cinData, setCinData] = useState(null);  // données extraites

  /* ── Sélection fichier ── */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5_000_000) {
      setCinError("Fichier trop lourd (max 5 Mo)");
      return;
    }
    setCinError("");
    setStatus(CIN_STATUS.IDLE);
    setMismatch([]);
    setCinData(null);
    setCinFile(f);
    onVerified(false); // reset validation parente
  };

  const removeFile = () => {
    setCinFile(null);
    setCinError("");
    setStatus(CIN_STATUS.IDLE);
    setMismatch([]);
    setCinData(null);
    onVerified(false);
  };

  /* ── Vérification CIN ── */
  const verifyCIN = async () => {
    if (!cinFile) return;

    const user = getLocalUser();
    console.log(user);
    if (!user) {
      setCinError("Impossible de récupérer les données utilisateur.");
      return;
    }

    try {
      /* ÉTAPE 1 — Envoyer l'image vers n8n */
      setStatus(CIN_STATUS.UPLOADING);
      const formData = new FormData();
      formData.append("file", cinFile);

      await axios.post("http://localhost:5678/webhook/transfer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      /* ÉTAPE 2 — Récupérer les données extraites */
      setStatus(CIN_STATUS.VERIFYING);

      // Petite attente pour laisser n8n traiter l'image
      await new Promise((r) => setTimeout(r, 3000));

      const { data } = await axios.get("http://localhost:5000/api/cin");

      // L'API renvoie un tableau, on prend le premier élément
      const cinInfo = Array.isArray(data) ? data[0] : data;
      setCinData(cinInfo);

      /* ÉTAPE 3 — Comparer avec les données du user */
      const errors = [];

      // Nom
      const cinSurname = normalize(cinInfo?.surname?.latin_transliteration || "");
      const userLastname = normalize(user.lastname || user.name || "");
      if (cinSurname && userLastname && cinSurname !== userLastname) {
        errors.push({
          field: "Nom",
          cin: cinInfo.surname.latin_transliteration,
          user: user.lastname || user.name,
        });
      }

      // Prénom
      const cinGiven = normalize(cinInfo?.given_name?.latin_transliteration || "");
      const userFirstname = normalize(user.firstname || user.prenom || "");
      if (cinGiven && userFirstname && cinGiven !== userFirstname) {
        errors.push({
          field: "Prénom",
          cin: cinInfo.given_name.latin_transliteration,
          user: user.firstname || user.prenom,
        });
      }

      // Numéro CIN
      const cinNumber = (cinInfo?.id_number || "").replace(/\s/g, "");
      const userCIN = (user.cin || user.numCIN || user.id_number || "").replace(/\s/g, "");
      if (cinNumber && userCIN && cinNumber !== userCIN) {
        errors.push({
          field: "Numéro CIN",
          cin: cinInfo.id_number,
          user: user.cin || user.numCIN || user.id_number,
        });
      }

      // Région / ville de naissance
      const cinPlace = normalize(cinInfo?.place_of_birth?.latin_transliteration || "");
      const userRegion = normalize(user.region || user.city || user.ville || "");
      if (cinPlace && userRegion && cinPlace !== userRegion) {
        errors.push({
          field: "Région / Ville",
          cin: cinInfo.place_of_birth.latin_transliteration,
          user: user.region || user.city || user.ville,
        });
      }

      /* ÉTAPE 4 — Résultat */
      if (errors.length === 0) {
        setStatus(CIN_STATUS.SUCCESS);
        onVerified(true);
      } else {
        setStatus(CIN_STATUS.ERROR);
        setMismatch(errors);
        onVerified(false);
      }
    } catch (err) {
      console.error("Erreur vérification CIN:", err);
      setCinError(
        err.response?.data?.message ||
        "Erreur lors de la vérification. Réessayez."
      );
      setStatus(CIN_STATUS.ERROR);
      onVerified(false);
    }
  };

  const isLoading = status === CIN_STATUS.UPLOADING || status === CIN_STATUS.VERIFYING;

  return (
    <div className="border-t pt-4 space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Photo de la CIN <span className="text-rose-500">*</span>
      </label>

      {/* Zone d'upload */}
      {!cinFile ? (
        <label
          className={`flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition
            ${cinError ? "border-rose-300 bg-rose-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"}`}
        >
          <Upload className="w-6 h-6 text-gray-300" />
          <span className="text-sm text-gray-400">Cliquez pour importer votre CIN</span>
          <span className="text-xs text-gray-300">JPG · PNG · PDF — max 5 Mo</span>
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
          ${status === CIN_STATUS.SUCCESS
            ? "bg-emerald-50 border-emerald-200"
            : status === CIN_STATUS.ERROR
              ? "bg-rose-50 border-rose-200"
              : "bg-gray-50 border-gray-200"}`}
        >
          {status === CIN_STATUS.SUCCESS
            ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            : status === CIN_STATUS.ERROR
              ? <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              : <Upload className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          <span className={`text-sm flex-1 truncate font-medium
            ${status === CIN_STATUS.SUCCESS ? "text-emerald-700"
              : status === CIN_STATUS.ERROR ? "text-rose-700"
                : "text-gray-700"}`}>
            {cinFile.name}
          </span>
          {!isLoading && (
            <button type="button" onClick={removeFile}
              className="text-gray-400 hover:text-gray-700 transition flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Erreur générale */}
      {cinError && (
        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {cinError}
        </p>
      )}

      {/* Détail des champs non concordants */}
      {mismatch.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2">
          <p className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Les informations suivantes ne correspondent pas à votre compte :
          </p>
          <div className="space-y-1.5">
            {mismatch.map((m) => (
              <div key={m.field} className="rounded-lg bg-white border border-rose-100 px-3 py-2">
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wide mb-1">{m.field}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">CIN : </span>
                    <span className="font-semibold text-gray-700">{m.cin || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Compte : </span>
                    <span className="font-semibold text-gray-700">{m.user || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-rose-500">
            Veuillez utiliser la CIN correspondant à votre compte, ou contacter le support.
          </p>
        </div>
      )}

      {/* Succès */}
      {status === CIN_STATUS.SUCCESS && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            CIN vérifiée avec succès — identité confirmée
          </p>
          {cinData && (
            <p className="text-[11px] text-emerald-600 mt-1">
              {cinData.given_name?.latin_transliteration} {cinData.surname?.latin_transliteration}
              {cinData.id_number ? ` · ${cinData.id_number}` : ""}
            </p>
          )}
        </div>
      )}

      {/* Bouton vérifier */}
      {cinFile && status !== CIN_STATUS.SUCCESS && (
        <button
          type="button"
          onClick={verifyCIN}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition
            border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              {status === CIN_STATUS.UPLOADING ? "Envoi en cours..." : "Vérification..."}
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              {status === CIN_STATUS.ERROR ? "Réessayer la vérification" : "Vérifier ma CIN"}
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════ */
const SelectEventModal = ({ isOpen, onClose, onConfirm, events, onCreateNew }) => {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [cinVerified, setCinVerified] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedEventId) return;
    if (!cinVerified) return;
    onConfirm(selectedEventId);
  };

  const canConfirm = selectedEventId && cinVerified;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Associer à un événement
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Liste des événements */}
          {events.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-400">
              Aucun événement disponible.
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">Sélectionnez un événement existant :</p>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {events.map((event) => (
                  <button
                    key={event._id}
                    onClick={() => setSelectedEventId(event._id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedEventId === event._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(event.dateDebut), "dd MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-xs text-gray-400">{event.category}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Vérificateur CIN */}
          <CINVerifier onVerified={setCinVerified} />

          {/* Bouton confirmer */}
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm
              ${canConfirm
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {!selectedEventId
              ? "Sélectionnez un événement"
              : !cinVerified
                ? "Vérifiez votre CIN d'abord"
                : <>Confirmer <ChevronRight className="w-4 h-4" /></>}
          </button>

          <button
            onClick={onCreateNew}
            className="w-full text-blue-600 text-sm py-2 hover:underline"
          >
            + Créer un nouvel événement
          </button>

        </div>
      </div>
    </div>
  );
};

export default SelectEventModal;
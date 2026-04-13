import React, { useState } from "react";
import { X, Calendar, ChevronRight, Upload, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SelectEventModal = ({ isOpen, onClose, onConfirm, events, onCreateNew }) => {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [cinFile, setCinFile] = useState(null);
  const [cinError, setCinError] = useState("");

  if (!isOpen) return null;

  const handleCINChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5e6) {
      setCinError("Fichier trop lourd (max 5 Mo)");
      return;
    }
    setCinError("");
    setCinFile(f);
  };

  const removeCIN = () => {
    setCinFile(null);
    setCinError("");
  };

  const handleConfirm = () => {
    if (!cinFile) {
      setCinError("Veuillez importer votre CIN");
      return;
    }
    onConfirm(selectedEventId, cinFile);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Associer à un événement
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Liste des événements */}
          <p className="text-sm text-gray-600">Sélectionnez un événement existant :</p>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {events.map((event) => (
              <button
                key={event._id}
                onClick={() => setSelectedEventId(event._id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedEventId === event._id
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

          {/* ── Champ CIN ── */}
          <div className="border-t pt-4 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Photo de la CIN <span className="text-rose-500">*</span>
            </label>

            {!cinFile ? (
              <label className={`flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition
                ${cinError ? "border-rose-300 bg-rose-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"}`}>
                <Upload className="w-6 h-6 text-gray-300" />
                <span className="text-sm text-gray-400">Cliquez pour importer votre CIN</span>
                <span className="text-xs text-gray-300">JPG · PNG · PDF — max 5 Mo</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleCINChange}
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-emerald-700 flex-1 truncate">{cinFile.name}</span>
                <button
                  type="button"
                  onClick={removeCIN}
                  className="text-emerald-400 hover:text-emerald-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {cinError && <p className="text-xs text-rose-500">{cinError}</p>}
          </div>

          {/* Boutons */}
          <button
            onClick={handleConfirm}
            disabled={!selectedEventId || !cinFile}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Confirmer <ChevronRight className="w-4 h-4" />
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
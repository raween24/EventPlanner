import React, { useState } from "react";
import { X, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SelectEventModal = ({ isOpen, onClose, onConfirm, events, onCreateNew }) => {
  const [selectedEventId, setSelectedEventId] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Associer à un événement
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-600 mb-3">Sélectionnez un événement existant :</p>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
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

          <button
            onClick={() => onConfirm(selectedEventId)}
            disabled={!selectedEventId}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Confirmer <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onCreateNew}
            className="w-full mt-3 text-blue-600 text-sm py-2 hover:underline"
          >
            + Créer un nouvel événement
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectEventModal;  
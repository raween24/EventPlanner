export const resourceFields = {
    salle: [
        { name: "capacity", label: "Capacité (personnes)", type: "number", required: true },
        { name: "surface", label: "Surface (m²)", type: "number" },
        { name: "parking", label: "Parking", type: "boolean" },
        { name: "wifi", label: "Wi-Fi", type: "boolean" },
        { name: "climatisation", label: "Climatisation", type: "boolean" },
        { name: "nombreChaises", label: "Nombre de chaises", type: "number" },
        { name: "nombreTables", label: "Nombre de tables", type: "number" }
    ],
    materiel: [
        { name: "quantite", label: "Quantité", type: "number", required: true },
        { name: "etat", label: "État", type: "text" },
        { name: "couleur", label: "Couleur", type: "text" },
        { name: "matiere", label: "Matière", type: "text" },
        { name: "dimensions", label: "Dimensions", type: "text" }
    ],
    decoration: [
        { name: "type", label: "Type", type: "text" },
        { name: "couleur", label: "Couleur", type: "text" },
        { name: "quantite", label: "Quantité", type: "number" },
        { name: "matiere", label: "Matière", type: "text" }
    ],
    traiteur: [
        { name: "typeCuisine", label: "Type de cuisine", type: "text", required: true },
        { name: "nombrePersonnes", label: "Nombre de personnes", type: "number", required: true },
        { name: "serveursInclus", label: "Serveurs inclus", type: "boolean" }
    ]
};
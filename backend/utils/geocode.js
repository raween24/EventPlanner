import fetch from "node-fetch";

const delay = (ms) => new Promise(res => setTimeout(res, ms));
const cache = new Map();

export const getLocationName = async (lat, lng) => {
  const key = `${lat}-${lng}`;

  if (cache.has(key)) return cache.get(key);

  try {
    await delay(1000); // 🔥 IMPORTANT (anti blocage)

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "dawini-app (contact@dawini.com)", // 🔥 IMPORTANT
          "Accept": "application/json"
        }
      }
    );

    const text = await res.text(); // 🔥 lire en TEXT d'abord

    // ❌ si ce n'est pas JSON → erreur API
    if (!text.startsWith("{")) {
      console.error("❌ Réponse non JSON:", text.substring(0, 200));
      return "Inconnu";
    }

    const data = JSON.parse(text);

    const name =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      data.address?.county ||
      data.address?.state ||
      data.address?.region ||
      data.address?.country ||
      data.display_name?.split(",")[0] ||
      "Inconnu";

    cache.set(key, name);

    return name;

  } catch (err) {
    console.error("Erreur geocoding:", err);
    return "Inconnu";
  }
};
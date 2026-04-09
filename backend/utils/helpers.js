export function resourceToVector(r) {
  return {
    price: r.price || 0,
    capacity: r.attributes?.get("capacity") || 0,
    category: r.category,
    location: r.location || ""
  };
}

export function eventToVector(e) {
  return {
    price: e.budget || 0,
    capacity: e.nombreParticipants || 0,
    category: e.category,
    location: e.lieu || ""
  };
}
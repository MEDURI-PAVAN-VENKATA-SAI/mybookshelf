export const ddMonYYYY = (date) => {
  if (!date) return "--------";

  // Firestore Timestamp support
  if (date.seconds) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date.seconds * 1000));
  }

  // Normal Date / ISO string
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

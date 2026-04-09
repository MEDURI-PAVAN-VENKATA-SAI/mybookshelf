import { createContext, useContext, useState, useMemo } from "react";

const ReadingsContext = createContext();

export function ReadingsProvider({ children }) {
  const [readings, setReadings] = useState([]);
  const [readingsLoaded, setReadingsLoaded] = useState(false);

  const addReading = (book) => {
    setReadings((prev) => {
      if (prev.find((b) => b.bookId === book.bookId)) return prev;
      return [...prev, book];
    });
  };

  const updateReading = (book) => {
    setReadings((prev) => {
      const index = prev.findIndex((b) => b.bookId === book.bookId);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...book };
        return updated;
      }

      return [...prev, book];
    });
  };

  const removeReading = (bookId) => {
    setReadings((prev) =>
      prev.filter((book) => book.bookId !== bookId)
    );
  };

  const value = useMemo(() => ({
    readings,
    setReadings,
    readingsLoaded,
    setReadingsLoaded,
    addReading,
    updateReading,
    removeReading
  }), [readings, readingsLoaded]);

  return (
    <ReadingsContext.Provider value={value}>
      {children}
    </ReadingsContext.Provider>
  );
}

export const useReadings = () => useContext(ReadingsContext);
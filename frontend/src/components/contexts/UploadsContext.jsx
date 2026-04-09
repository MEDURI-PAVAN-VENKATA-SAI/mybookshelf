import { createContext, useContext, useState, useMemo } from "react";

const UploadsContext = createContext();

export function UploadsProvider({ children }) {
  const [uploads, setUploads] = useState([]);
  const [uploadsLoaded, setUploadsLoaded] = useState(false);

  const addUpload = (book) => {
    setUploads((prev) => {
      if (prev.find((b) => b.bookId === book.bookId)) return prev;
      return [...prev, book];
    });
  };

  const removeUpload = (bookId) => {
    setUploads((prev) =>
      prev.filter((book) => book.bookId !== bookId)
    );
  };

  const value = useMemo(() => ({
    uploads,
    setUploads,
    uploadsLoaded,
    setUploadsLoaded,
    addUpload,
    removeUpload
  }), [uploads, uploadsLoaded]);

  return (
    <UploadsContext.Provider value={value}>
      {children}
    </UploadsContext.Provider>
  );
}

export const useUploads = () => useContext(UploadsContext);
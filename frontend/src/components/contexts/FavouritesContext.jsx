import { createContext, useContext, useState, useMemo } from "react";

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoaded, setFavouritesLoaded] = useState(false);

  const addFavourite = (book) => {
    setFavourites((prev) => {
      if (prev.find((b) => b.bookId === book.bookId)) return prev;
      return [...prev, book];
    });
  };

  const removeFavourite = (bookId) => {
    setFavourites((prev) =>
      prev.filter((book) => book.bookId !== bookId)
    );
  };

  const value = useMemo(() => ({
    favourites,
    setFavourites,
    favouritesLoaded,
    setFavouritesLoaded,
    addFavourite,
    removeFavourite
  }), [favourites, favouritesLoaded]);

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export const useFavourites = () => useContext(FavouritesContext);
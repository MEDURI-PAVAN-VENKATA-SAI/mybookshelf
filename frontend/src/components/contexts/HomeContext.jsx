import { createContext, useContext, useState, useMemo } from "react";

const HomeContext = createContext();

export function HomeProvider({ children }) {
  const [homeBooks, setHomeBooks] = useState([]);
  const [homeBooksLoaded, setHomeBooksLoaded] = useState(false);

  const value = useMemo(() => ({
    homeBooks,
    setHomeBooks,
    homeBooksLoaded,
    setHomeBooksLoaded
  }), [homeBooks, homeBooksLoaded]);

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
}

export const useHomeBooks = () => useContext(HomeContext);
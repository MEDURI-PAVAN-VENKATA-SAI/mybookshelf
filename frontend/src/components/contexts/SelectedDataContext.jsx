import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SelectedDataContext = createContext();

export function SelectedDataProvider({ children }) {

  const location = useLocation();

  const [ selectedBook, setSelectedBook ] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);

  useEffect(() => {
    setSelectedBook(null);
    setOpenPopUp(false);
  }, [location]);

  return (
    <SelectedDataContext.Provider value={{selectedBook, setSelectedBook, openPopUp, setOpenPopUp}}>
      {children}
    </SelectedDataContext.Provider>
  );
}

export const useSelectedData = () => useContext(SelectedDataContext);

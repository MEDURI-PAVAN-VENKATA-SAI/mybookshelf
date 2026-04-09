import { createContext, useContext, useState } from "react";

const NavbarContext = createContext(null);

export const NavbarProvider = ({ children }) => {
  const [openNav, setOpenNav] = useState(window.innerWidth >= 1024);

  return (
    <NavbarContext.Provider value={{ openNav, setOpenNav }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
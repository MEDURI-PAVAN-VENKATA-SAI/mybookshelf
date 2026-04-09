import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const DEFAULT_USER = {
  userId: null,
  email: null,
  username: null,
  displayName: null,
  picture: null,
  role: null,
  hasPassword: false
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_USER);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let timeoutId;

    const restoreSession = async () => {
      const token = localStorage.getItem("access_token");

      timeoutId = setTimeout(() => {
        console.warn("Auth restore timeout");
        setUser(DEFAULT_USER);
        setAuthLoading(false);
      }, 10000);

      if (!token) {
        clearTimeout(timeoutId);
        setUser(DEFAULT_USER);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/session`, { headers: { Authorization: `Bearer ${token}` }});
        setUser(res.data.user);
      } 
      catch {
        localStorage.removeItem("access_token");
        setUser(DEFAULT_USER);
      } 
      finally {
        clearTimeout(timeoutId);
        setAuthLoading(false);
      }
    };

    restoreSession();
    return () => clearTimeout(timeoutId);
  }, []);

  // Memoized value
  const value = useMemo(() => {
    return { user, setUser, authLoading };
  }, [ user, authLoading ]);

  return (
    <UserContext.Provider value={ value }>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
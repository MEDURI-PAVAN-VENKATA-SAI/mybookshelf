import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { DEFAULT_USER } from "@/constants/defaultUser";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(DEFAULT_USER);
  const [authLoading, setAuthLoading] = useState(true);

  const calledRef = useRef(false);        // prevent double API in StrictMode

  const setUser = (data) => {
    setUserState(data);
    if (data?.userId) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    let timeoutId;

    const restoreSession = async () => {

      const token = localStorage.getItem("access_token");
      const cachedUser = localStorage.getItem("user");        // Load cached user first (instant UI)

      if (cachedUser) {
        setUserState(JSON.parse(cachedUser));
        setAuthLoading(false);
      }

      if (!token) {
        setUser(DEFAULT_USER);
        setAuthLoading(false);
        return;
      }

      timeoutId = setTimeout(() => { setAuthLoading(false);}, 10000);      // when Auth timeout — uses cached user

      try {
        const res = await axios.get(`${API_URL}/auth/session`, { headers: { Authorization: `Bearer ${token}` }});
        setUser(res.data.user); // update + cache
      } 
      catch (err) {                                   // network issue → DO NOT logout (only if invalid token → logout)
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          setUser(DEFAULT_USER);
        } 
      } 
      finally {
        clearTimeout(timeoutId);
        setAuthLoading(false);
      }
    };

    restoreSession();
    return () => clearTimeout(timeoutId);
  }, []);

  const value = useMemo(() => {
    return { user, setUser, authLoading };
  }, [user, authLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { fetchLanguages } from "../../api/config";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [allLanguages, setAllLanguages] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const { allLangs, availLangs } = await fetchLanguages();
        setAllLanguages(allLangs);
        setAvailableLanguages(availLangs);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  const value = useMemo(() => {
    return {
      allLanguages,
      availableLanguages,
      loading,
      setAllLanguages,
      setAvailableLanguages
    };
  }, [allLanguages, availableLanguages, loading]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguages = () => useContext(LanguageContext);
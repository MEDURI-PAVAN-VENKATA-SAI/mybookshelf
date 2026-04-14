import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { fetchLanguages } from "../../api/config";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [allLanguages, setAllLanguages] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("languages");

    if (cached) {
      const parsed = JSON.parse(cached);
      setAllLanguages(parsed.allLanguages || []);
      setAvailableLanguages(parsed.availableLanguages || []);
      setLoading(false);
    }

    const loadLanguages = async () => {
      try {
        const { allLangs, availLangs } = await fetchLanguages();

        setAllLanguages(allLangs);
        setAvailableLanguages(availLangs);

        localStorage.setItem(
          "languages",
          JSON.stringify({
            allLanguages: allLangs,
            availableLanguages: availLangs,
          })
        );
      } catch {}
      finally {
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
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { fetchCategories } from "../../api/config";

const CategoriesContext = createContext({ categories: [], loading: true });

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  // Memoized value
  const value = useMemo(() => {
    return { categories, loading };
  }, [categories, loading]);

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => useContext(CategoriesContext);
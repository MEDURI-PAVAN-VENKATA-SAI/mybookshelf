import { useState } from "react";

export function useFilters() {

  const [filters, setFilters] = useState({ sort: null, categories: [] });

  const toggleValue = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      };
    });
  };

  const setValue = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clear = () => setFilters({ sort: null, categories: [] });

  return { filters, toggleValue, setValue, clear };
}
import { useRef, useState, useEffect } from "react";
import { buildCategoryFilter } from "./normalizeCategories";
import Button from "./Button";
import { useLanguages } from "../contexts/LanguageContext";
import { useLocation } from "react-router-dom";

export default function UniversalFilter({ open, setOpen, categories = [], config, onApply, className = "" }) {
  const { allLanguages=[], availableLanguages=[] } = useLanguages();
  const {pathname} = useLocation();

  const [sort, setSort] = useState({});
  const [languages, setLanguages] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);

  const filterRef = useRef(null);

  /* -------------------- GET ALL IDS -------------------- */
  const allCatIds = categories.map((c) => c.id);

  const allSubIds = categories.flatMap((c) =>
    (c.subcategories || []).map((s) => s.id)
  );

  /* -------------------- ALL TOGGLE -------------------- */
  function toggleAll() {
    const isAllSelected =
      selectedCats.length === allCatIds.length &&
      selectedSubs.length === allSubIds.length;

    if (isAllSelected) {
      setSelectedCats([]);
      setSelectedSubs([]);
    } else {
      setSelectedCats(allCatIds);
      setSelectedSubs(allSubIds);
    }
  }

  /* -------------------- CATEGORY TOGGLE -------------------- */
  function toggleCategory(cat) {
    const hasSubs = cat.subcategories?.length > 0;
    const isSelected = selectedCats.includes(cat.id);

    if (isSelected) {
      setSelectedCats((prev) => prev.filter((id) => id !== cat.id));

      if (hasSubs) {
        const subIds = cat.subcategories.map((s) => s.id);
        setSelectedSubs((prev) =>
          prev.filter((id) => !subIds.includes(id))
        );
      }
    } else {
      setSelectedCats((prev) => [...prev, cat.id]);

      if (hasSubs) {
        const subIds = cat.subcategories.map((s) => s.id);
        setSelectedSubs((prev) => [...new Set([...prev, ...subIds])]);
      }
    }
  }

  /* -------------------- SUBCATEGORY TOGGLE -------------------- */
  function toggleSub(cat, subId) {
    const isSelected = selectedSubs.includes(subId);

    let updatedSubs;
    if (isSelected) {
      updatedSubs = selectedSubs.filter((id) => id !== subId);
    } else {
      updatedSubs = [...selectedSubs, subId];
    }

    setSelectedSubs(updatedSubs);

    if (cat.subcategories?.length) {
      const subIds = cat.subcategories.map((s) => s.id);
      const allSelected = subIds.every((id) =>
        updatedSubs.includes(id)
      );

      if (allSelected) {
        setSelectedCats((prev) =>
          prev.includes(cat.id) ? prev : [...prev, cat.id]
        );
      } else {
        setSelectedCats((prev) =>
          prev.filter((id) => id !== cat.id)
        );
      }
    }
  }

  /* -------------------- Languages -------------------- */
  const handleSelectLanguage = (e) => {
    const code = e.target.value;
    if (!code) return;

    if (!languages.includes(code)) {
      setLanguages((prev) => [...prev, code]);
    }

    e.target.value = "";
  };

  const removeLanguage = (code) => {
    setLanguages((prev) =>
      prev.filter((lang) => lang !== code)
    );
  };

  /* -------------------- APPLY -------------------- */
  function applyFilters() {
    const categoryFilter = isAllChecked ? [] : buildCategoryFilter( categories, selectedCats, selectedSubs );
    onApply({ sort, languages: languages, categories: categoryFilter });
    setOpen(false);
  }

  /* -------------------- OUTSIDE CLICK -------------------- */
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target)) { setOpen(false); }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, setOpen]);

  const onClear = () => {
    setSort({});
    setLanguages([]);
    setSelectedCats([]);
    setSelectedSubs([]);
  };

  /* -------------------- ALL CHECK -------------------- */
  const isAllChecked = selectedCats.length === allCatIds.length && selectedSubs.length === allSubIds.length;

  return (
    <div ref={filterRef} onMouseDown={(e) => e.stopPropagation()} className={`absolute top-16 max-sm:right-1 rounded h-fit z-50
        max-h-[calc(100dvh-70px)] shadow-md max-w-fit text-[var(--list-text)] text-[16px] flex flex-col ${className}`} >
      <div className="flex flex-row justify-between px-2">
        <div className="flex px-2 text-left items-center">In {pathname}</div>
        <button className="rounded-full p-1 w-10 h-10 cursor-pointer" onClick={()=>{onClear();setOpen(false);}}> ✕ </button>
      </div>
      <div className="grid grid-cols-2 gap-2 bg-transparent p-4">
        <Button onClick={applyFilters} size="sm"> Apply </Button>
        <Button variant="outline" onClick={onClear} size="sm"> Clear </Button>
      </div>

      <div className="mb-4 px-4 pb-4 max-w-fit scrollbar-auto overflow-y-auto overflow-x-hidden gap-y-2">

        {/* -------------------- SORT SECTION -------------------- */}
        {config.sort && (
          <div className="flex flex-col text-left gap-y-2">
            <strong>Sort by</strong>

            {/* Published Year */}
            {config.sort.publishedYear && (
              <div className="flex flex-col">
                <h4 className="ml-4 font-semibold">
                  Published Year
                </h4>
                <div className="flex flex-col ml-4">
                  <label className="block ml-4">
                    <input
                      type="radio"
                      name="publishedYear"
                      checked={sort.publishedYear === "asc"}
                      onChange={() => setSort((prev) => ({ ...prev, publishedYear: "asc" })) }
                      className="mr-1"
                    />
                    Oldest on top
                  </label>

                  <label className="block ml-4">
                    <input
                      type="radio"
                      name="publishedYear"
                      checked={sort.publishedYear === "desc"}
                      onChange={() => setSort((prev) => ({ ...prev, publishedYear: "desc" })) }
                      className="mr-1"
                    />
                    Latest on top
                  </label>
                </div>
              </div>
            )}

            {/* Ratings */}
            {config.sort.rating && (
              <div className="flex flex-col gap-y-2">
                <h4 className="ml-4 font-semibold">Ratings</h4>
                <div className="flex flex-col ml-4">
                  <label className="block ml-4">
                    <input
                      type="radio"
                      name="rating"
                      checked={sort.rating === "desc"}
                      onChange={() => setSort((prev) => ({ ...prev, rating: "desc" })) }
                      className="mr-1"
                    />
                    High to Low
                  </label>

                  <label className="block ml-4">
                    <input
                      type="radio"
                      name="rating"
                      checked={sort.rating === "asc"}
                      onChange={() => setSort((prev) => ({ ...prev, rating: "asc" })) }
                      className="mr-1"
                    />
                    Low to High
                  </label>

                  <label className="block ml-4">
                    <input
                      type="radio"
                      name="rating"
                      checked={sort.rating === "gte4"}
                      onChange={() => setSort((prev) => ({ ...prev, rating: "gte4" })) }
                      className="mr-1"
                    />
                    Rating ≥ 4
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- LANGUAGES -------------------- */}
        {config.languages && (
          <div className="flex flex-col max-w-60 gap-y-2 my-4">
            <div className="flex flex-row gap-2 justify-between">
            <strong className="mt-2"> Languages </strong>
            <select
              name="language"
              onChange={handleSelectLanguage}
              className="input text-sm bg-[var(--secondary)] p-2 rounded max-w-fit scrollbar-hide"
            >
              <option value="">{languages.length === 0 ? "All" : "Select more"}</option>
              {allLanguages.map(lan => (
                <option key={lan.code} value={lan.code}>{lan.label}</option>
              ))}
            </select>
            </div>
            <div className="ml-4 flex flex-wrap gap-2">
              {languages.map((code) => {
                const language = allLanguages.find((l) => l.code === code);

                return (
                  <div key={code} className="p-2 bg-[var(--muted)] border rounded-xl flex align-middle gap-2">
                    {language?.label}
                    <button className="border-0 bg-transparent cursor-pointer font-bold" onClick={() => removeLanguage(code)}>
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------- CATEGORY SECTION -------------------- */}
        {config.categories && (
          <div className="flex flex-col text-left gap-y-2">
            <strong className="mt-2">Categories</strong>

            <label className="font-semibold ml-4">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={toggleAll}
                className="mr-1"
              />
              All
            </label>

            {categories.map((cat) => {
              const hasSubs = cat.subcategories?.length > 0;

              return (
                <div
                  key={cat.id}
                  className="flex flex-col ml-4 gap-y-2"
                >
                  <label className="font-semibold">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat.id)}
                      onChange={() => toggleCategory(cat) }
                      className="mr-1"
                    />
                    {cat.label}
                  </label>

                  {hasSubs &&
                    cat.subcategories.map((sub) => (
                      <label key={sub.id} className="ml-4 block" >
                        <input
                          type="checkbox"
                          checked={selectedSubs.includes(sub.id)}
                          onChange={() => toggleSub(cat, sub.id)}
                          className="mr-1"
                        />
                        {sub.label}
                      </label>
                    ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* 
normalizeCategories() method returns array of objects like which are stored in CategoriesContext

categories = [
  {
    id: "FIC",
    label: "Fiction",
    bookCount: 0,
    subcategories: [
      { id: "DRAMA", label: "Drama", parent: "FIC", bookCount:0 },
      { id: "SCIFI", label: "Science Fiction", parent: "FIC", bookCount:0 }
    ]
  }
]
*/
export function normalizeCategories(categories) {
  return Object.entries(categories)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([catKey, cat]) => ({
      id: catKey,
      label: cat.label,
      icon: cat.icon,
      bookCount: cat.bookCount,
      subcategories: Object.entries(cat.subcategories || {}).map(
        ([subKey, sub]) => ({
          id: subKey,
          label: sub.label,
          bookCount: sub.bookCount,
          parent: catKey
        })
      )
    }));
}



/*Languages 
normalizeLanguages returns label based alphabetically sorted
[
  { code: "en", label: "English", bookCount: 10 },
   ..
]
*/
export function normalizeLanguages(languages) {
  
  const allLangs = Object.entries(languages)
  .map(([code, value]) => ({
    code,
    label: value.label,
    bookCount: value.bookCount
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

  const availLangs = allLangs.filter( lang => lang.bookCount > 0 );

  return { allLangs, availLangs };
}



// category filters
export function buildCategoryFilter(
  categories,
  selectedCats,
  selectedSubs
) {
  const result = [];

  categories.forEach((cat) => {
    const subs = (cat.subcategories || []).map((s) => s.id);

    /* ---------------- CATEGORY WITHOUT SUBS ---------------- */
    if (subs.length === 0) {
      if (selectedCats.includes(cat.id)) {
        result.push(cat.id);
      }
      return;
    }

    /* ---------------- CATEGORY WITH SUBS ---------------- */
    const selectedSubIds = subs.filter((id) =>
      selectedSubs.includes(id)
    );

    const isCategoryFullySelected =
      selectedSubIds.length === subs.length &&
      selectedCats.includes(cat.id);

    if (isCategoryFullySelected) {
      // Whole category selected
      result.push(cat.id);
    } else if (selectedSubIds.length > 0) {
      // Partial subcategory selection
      result.push(...selectedSubIds);
    }
  });

  return result;
}



//build Query to get data 
export function buildBooksQuery(filters) {
  const query = {
    isVisible: true
  };

  // CATEGORY FILTER
  if (filters.categories.length) {
    query.categories = { $in: filters.categories };
  }

  // CATEGORY FILTER
  if (filters.languages.length) {
    query.languages = { $lang: filters.languages };
  }

  // SORT LOGIC
  let sort = {};

  if (filters.sort.publishedYear) {
    sort.publishedYear = filters.sort.publishedYear === "asc" ? 1 : -1;
  }

  if (filters.sort.rating === "gte4") {
    query.ratingAvg = { $gte: 4 };
  } else if (filters.sort.rating) {
    sort.ratingAvg = filters.sort.rating === "asc" ? 1 : -1;
  }

  return { query, sort };
}
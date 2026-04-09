export const Report_options = [ "Broken file", "Copy right", "Wrong content", "Wrong information", "others" ];

export const uploads_filters = ["pending", "published", "rejected"];

export const readings_filters = ["reading", "completed"];

export const FILTER_CONFIGS = {
  home: {
    sort: {
      publishedYear: true,
      rating: true,
    },
    languages: true,
    categories: true
  },

  readings: {
    sort: false,
    languages: false,
    categories: false
  },

  uploads: {
    sort: false,
    languages: false,
    categories: false
  }
};

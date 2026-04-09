export const DEFAULT_USER = {
  userId: null,
  email: null,
  username: null,
  displayName: null,
  picture: null,
  role: null,
  hasPassword: false
};

export const DEFAULT_BOOK_UPLOAD_FORM = {
  title: "",
  ISBN: "",
  language: "",
  description: "",
  authors: "",
  category: "",
  subcategory: "",
  language: "",
  publisher: "",
  publishedYear: "",
  totalPages: "",
  privacy: "public"
};

export function defaultBook() {
  return {
    bookId: "",
    ISBN: "",
    title: "",
    description: "",
    authors: [],
    publisher:"",
    publishedYear: null,
    categories: [],
    language: "",
    totalPages: 0,
    coverUrl: "",
    coverDriveFileId: "",
    previewUrl: "",
    downloadUrl: "",
    driveFileId: "",
    bookExt: "",
    coverExt: "",
    bookFileType: "",
    coverFileType: "",
    ratingCount: 0,
    ratingSum: 0,
    ratingAvg: 0,
    addedBy: "",
    uploaderId: "",
    privacy: "public",
    createdAt: null,
    searchKeywords: [],
    isVisible: false,
    isFavourite: false
  };
}

export function defaultReadingBook() {
  return {
    ...defaultBook(),
    readingStatus: {
      bookId:"",
      status: "",
      repetitionCount: 0,
      currentPage: 0,
      totalPages: 0,
      startedAt: null,
      lastReadAt: null,
      completedAt: null
    }
  };
}

export function defaultUploadedBook() {
  return {
    ...defaultBook(),
    uploadStatus: {
      bookId: "",
      status: "",  // "pending" | "in_review" | "published" | "rejected"
      reason: "",
      createdAt: null
    }
  };
}

export function defaultReport() {
  return {
    ...defaultBook(),
    reportStatus:{
      reportId: "",
      reporterId: "",
      targetId: "",
      issues: [],
      details: "",
      status: "",  // "pending" | "in_review" | "resolved" | "rejected"
      reason: "",
      createdAt: null
    }
  };
}
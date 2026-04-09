import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("access_token")}` });


/*---------------------------------------------------Home page / General----------------------------------------------------*/


export async function fetchHomeBooks(cursor = null) {
  const res = await axios.get(`${API_URL}/books`, { params: { cursor, limit: 20 }, headers: authHeaders() });
  return res.data; // { books, nextCursor }
};


export async function rateBook(bookId, rating) {
  const res = await axios.post( `${API_URL}/books/${bookId}/rate`, null, { params: { rating }, headers: authHeaders() });
  return res.data;
};


export async function getUserRating(bookId) {
  const res = await axios.get(`${API_URL}/books/${bookId}/rating`, { headers: authHeaders() });
  return res.data.rating;
};


/*-------------------------------------------------------favourites---------------------------------------------------------*/


export async function fetchFavouriteBooks(cursor = null) {
  const res = await axios.get(`${API_URL}/books/my-favourites`, { params: { cursor, limit: 20 }, headers: authHeaders() });
  return res.data; // { books, nextCursor }
};


export const addToFavourites = (bookId) => axios.post(`${API_URL}/books/${bookId}/favourite`, null, { headers: authHeaders() });


export const removeFromFavourites = (bookId) => axios.delete(`${API_URL}/books/${bookId}/favourite`, { headers: authHeaders() });


export const checkFavourite = async (bookId) => {
  const res = await axios.get(`${API_URL}/books/${bookId}/is-favourite`, { headers: authHeaders() });
  return res.data.isFavourite;
};


/*-------------------------------------------------------uploads---------------------------------------------------------*/


export async function fetchUploads(cursor = null) {
  const res = await axios.get(`${API_URL}/books/my-uploads`, { params: { cursor, limit: 20 }, headers: authHeaders() });
  return res.data; // { books, nextCursor }
};


export async function uploadBook(formData) {
  const res = await axios.post(`${API_URL}/books/upload`, formData, { headers: {...authHeaders(), "Content-Type": "multipart/form-data" } });
  return res.data; // { message, book } //book with uploadStatus
};


export async function editBook(bookId, editedBook) {
  const res = await axios.put( `${API_URL}/books/${bookId}/edit`, { editedBook }, { headers: authHeaders() });
  return res.data;
};


export const removeFromUploads = (bookId) => axios.delete(`${API_URL}/books/${bookId}/upload`, { headers: authHeaders() });


/*-------------------------------------------------------readings---------------------------------------------------------*/


export async function fetchReadings(cursor = null) {
  const res = await axios.get(`${API_URL}/books/my-readings`, { params: { cursor, limit: 20 }, headers: authHeaders() });
  return res.data; // { books, nextCursor }
};


export const getReadingStatus = async (bookId) =>{ 
  const res = await axios.get(`${API_URL}/books/${bookId}/reading/status`, { headers: authHeaders() });
  return res.data.readingStatus;
};


export const startReading =(bookId, totalPages)=> axios.post(`${API_URL}/books/${bookId}/reading/start`, {totalPages}, {headers: authHeaders()});


export const updateReadingStatus=(bookId, currentPage)=> axios.post(`${API_URL}/books/${bookId}/reading/update`, {currentPage}, {headers: authHeaders()});


export const rereadBook = (bookId) => axios.post(`${API_URL}/books/${bookId}/reading/reread`, null, { headers: authHeaders() });


export const removeFromReadings = (bookId) => axios.delete(`${API_URL}/books/${bookId}/reading`, { headers: authHeaders() });


/*-------------------------------------------------------reports---------------------------------------------------------*/


export async function createReport({ bookId, issues, details }) {
  const res = await axios.post(`${API_URL}/reports/`, { targetId: bookId, issues, details }, { headers: authHeaders() } );
  return res.data; // { message, report }
};


export async function fetchMyReports(cursor = null) {
  const res = await axios.get(`${API_URL}/reports/my`, { headers: authHeaders(), params: { cursor, limit: 20 } });
  return res.data; // { books, nextCursor }
};


export const deleteReport = (reportId) => axios.delete( `${API_URL}/reports/${reportId}`, { headers: authHeaders() } );


/*-------------------------------------------------------Admin actions---------------------------------------------------------*/


export async function fetchPendingUploads(cursor = null) {
  const res = await axios.get(`${API_URL}/admin/books/pending`, { params: { cursor, limit: 20 }, headers: authHeaders() });
  return res.data;
};


export async function approveBook(bookId, editedBook = {}, reason = "") {
  const res = await axios.post( `${API_URL}/admin/books/${bookId}/approve`, { editedBook, reason }, { headers: authHeaders() });
  return res.data;
};


export async function rejectBook(bookId, reason = "", deleteFiles = false) {
  const res = await axios.post(`${API_URL}/admin/books/${bookId}/reject`,null,{params:{reason,delete_files:deleteFiles},headers:authHeaders()});
  return res.data;
};


export async function batchApprove(items) {
  const res = await axios.post( `${API_URL}/admin/books/batch-approve`, { items }, { headers: authHeaders() });
  return res.data;
};


export const deleteBook = (bookId, reason) => axios.delete(`${API_URL}/admin/books/${bookId}/delete`, {headers:authHeaders(), params:{reason}});


export async function fetchAllReports(cursor = null) {
  const res = await axios.get(`${API_URL}/reports/admin`, { headers: authHeaders(), params: { cursor, limit: 20 } });
  return res.data; // { books, nextCursor }
};


export async function updateReportStatus( reportId, status, reason = "" ) {
  const res = await axios.put( `${API_URL}/reports/admin/${reportId}`, { status, reason }, { headers: authHeaders() });
  return res.data;
};
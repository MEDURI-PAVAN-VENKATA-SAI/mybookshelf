import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("access_token")}` });



/*------------------------------------------------------- Config ---------------------------------------------------------*/

export async function fetchFolders() {
  const res = await axios.get(`${API_URL}/config/folders`, { headers: authHeaders() } );
  return res.data;
}

export const refreshCategoriesBackendCache = async () => {
  const res = await axios.post( `${API_URL}/config/refresh/categories`, {}, { headers: authHeaders() });
  return res.data;
};

export const refreshLanguagesBackendCache = async () => {
  const res = await axios.post( `${API_URL}/config/refresh/languages`, {}, { headers: authHeaders() });
  return res.data;
};

export const refreshFoldersBackendCache = async () => {
  const res = await axios.post( `${API_URL}/config/refresh/folders`, {}, { headers: authHeaders() });
  return res.data;
};



/*------------------------------------------------------- Edit Books ---------------------------------------------------------*/


export const deleteBook = (bookId, reason) => axios.delete(`${API_URL}/admin/books/${bookId}/delete`, {headers:authHeaders(), params:{reason}});



/*------------------------------------------------------- Uploads ---------------------------------------------------------*/

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



/*------------------------------------------------------- Reports ---------------------------------------------------------*/

export async function fetchAllReports(cursor = null) {
  const res = await axios.get(`${API_URL}/reports/admin`, { headers: authHeaders(), params: { cursor, limit: 20 } });
  return res.data; // { books, nextCursor }
};


export async function updateReportStatus( reportId, status, reason = "" ) {
  const res = await axios.put( `${API_URL}/reports/admin/${reportId}`, { status, reason }, { headers: authHeaders() });
  return res.data;
};
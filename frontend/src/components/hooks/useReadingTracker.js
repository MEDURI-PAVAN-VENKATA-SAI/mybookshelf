import { useEffect, useRef } from "react";
import { updateReadingStatus } from "@/api/books";
import { useLocation } from "react-router-dom";

export const useReadingTracker = ({ bookId, currentPage }) => {
  const lastSavedPage = useRef(currentPage || 0);
  const location = useLocation();

  // MAIN SAVE FUNCTION
  const saveProgress = async (force = false) => {
    if (!bookId) return;
    if (currentPage === lastSavedPage.current) return;
    if (!force && Math.abs(currentPage - lastSavedPage.current) < 2) return; // skip small updates (same as backend logic)

    try {
      await updateReadingStatus(bookId, currentPage);
      lastSavedPage.current = currentPage;
    } 
    catch (e) {
      console.error("Save failed");
    }
  };

  // INTERVAL SAVE (every 10 sec)
  useEffect(() => {
    const interval = setInterval(() => { if (!document.hidden) { saveProgress(); }}, 10000);
    return () => clearInterval(interval);
  }, [currentPage]);

  // SAVE ON ROUTE CHANGE ( force save )
  useEffect(() => { return () => { saveProgress(true);}; }, [location]);

  // SAVE ON TAB CLOSE / REFRESH
  useEffect(() => {
    const handleUnload = () => {
      if (!bookId) return;
      const payload = JSON.stringify({ currentPage });
      navigator.sendBeacon( `${import.meta.env.VITE_API_URL}/books/${bookId}/reading/update`, payload );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [currentPage]);

  return { saveProgress };
};
import { createContext, useContext, useState, useMemo } from "react";

const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [reportsLoaded, setReportsLoaded] = useState(false);

  const addReport = (newReportingBook) => {
    setReports((prev) => { 
      if (prev.find((book) => book.reportStatus.reportId === newReportingBook.reportStatus.reportId)) return prev;
      return [...prev, newReportingBook]; 
    });
  };

  const removeReport = (reportId) => {
    setReports((prev) =>
      prev.filter((book) => book.reportStatus.reportId !== reportId)
    );
  };

  const value = useMemo(() => ({
    reports,
    setReports,
    reportsLoaded,
    setReportsLoaded,
    addReport,
    removeReport
  }), [reports, reportsLoaded]);

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
}

export const useReports = () => useContext(ReportsContext);
import './App.css'
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from './components/contexts/ThemeContext';
import { useUser } from './components/contexts/UserContext';

import Home from "./components/pages/Home.jsx";
import Login from "./components/pages/Login.jsx";
import BookDetails from "./components/pages/BookDetails.jsx";
import Reader from "./components/pages/Reader.jsx";
import Admin from "./components/pages/Admin.jsx";
import NotFound from "./components/pages/NotFound.jsx";
import Favourites from "./components/pages/Favourites";
import TopLoader from './components/utils/TopLoader';
import Landing from './components/pages/Landing';
import Profile from './components/pages/Profile';
import Main from './components/pages/Main';
import ProtectedRoute from './components/contexts/ProtectedRoute';
import AdminRoute from './components/contexts/AdminRoute';
import Readings from './components/pages/Readings';
import Uploads from './components/pages/Uploads';
import Report from './components/pages/Report';
import AboutUs from './components/pages/AboutUs';
import Account from './components/pages/Account';
import Loading from './components/utils/Loading';

function App() {

  const { darkMode } = useTheme();
  const { user, authLoading } = useUser();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMsg, setShowOnlineMsg] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);

      // Show "Back Online" for 2 sec
      setShowOnlineMsg(true);
      setTimeout(() => setShowOnlineMsg(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineMsg(false); // remove online msg if any
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (authLoading) return <Loading />;

  const isLoggedIn = !!user.userId;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--secondary)]">

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} newestOnTop closeOnClick rtl={false}
            pauseOnFocusLoss draggable pauseOnHover theme={darkMode ? 'dark' : 'light'} 
      />

      <TopLoader />

      {!isOnline && (
        <div className="fixed bottom-0 z-100 w-full h-5 text-center text-sm bg-red-600 text-white">
          You are offline
        </div>
      )}

      {/* Offline Message */}
      {!isOnline && (
        <div className={`fixed bottom-0 z-100 w-full h-5 text-center text-sm bg-red-600 text-white
              transition-all duration-500 ease-in-out ${!isOnline ? "translate-y-0 bg-red-600 opacity-100" : "translate-y-full opacity-0"}`}>
          You are offline
        </div>
      )}

      {/* Back Online Message */}
      {isOnline && showOnlineMsg && (
        <div className={`fixed bottom-0 z-100 w-full h-5 text-center text-sm an bg-green-600 text-white transition-all duration-500
              ease-in-out ${isOnline && showOnlineMsg ? "translate-y-0 bg-green-600 opacity-100" : "translate-y-full opacity-0"}`}>
          Back online
        </div>
      )}

      <main className="flex-1 text-[var(--text)]">
        <Routes>

          <Route path="/" element={ isLoggedIn ? <Navigate to="/app/home" replace /> : <Landing /> } />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Main />} >
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="book/:id" element={<BookDetails />} />
              <Route path="favourites" element={<Favourites />} />
              <Route path="readings" element={<Readings />} />
              <Route path="uploads" element={<Uploads />} />
              <Route path="report" element={<Report />} />
              <Route path="info" element={<AboutUs />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/reader/:id" element={<Reader />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="/unauthorized" element={<NotFound message='Unauthorized Access' />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;
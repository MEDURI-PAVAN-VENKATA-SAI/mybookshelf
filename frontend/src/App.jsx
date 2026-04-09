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

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const {darkMode} = useTheme();
  const {user, authLoading} = useUser();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!',{ hideProgressBar: true, position: "top-center"});
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No Internet Connection. Please check your network!', { hideProgressBar: true, position: "top-center"});
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if( authLoading ){
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[var(--secondary)]">
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} newestOnTop closeOnClick rtl={false}
            pauseOnFocusLoss draggable pauseOnHover theme={darkMode ? 'dark' : 'light'} 
        />

        <TopLoader />

        <div className="flex flex-1">
          <main className="flex-1 text-[var(--text)]">
            <Routes>

              <Route path="/" element={ user.userId ? <Navigate to={"/app/home"} replace/> : <Landing />} />
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<Main />} >
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="book/:id" element={<BookDetails />} />
                  <Route path="favourites" element={<Favourites/>} />
                  <Route path="readings" element={<Readings/>} />
                  <Route path="uploads" element={<Uploads/>} />
                  <Route path="report" element={<Report/>} />
                  <Route path="info" element={<AboutUs/>} />
                  <Route path="account" element={<Account/>} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/reader/:id" element={<Reader />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="/unauthorized" element={<NotFound message='Unauthorized Access'/>} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
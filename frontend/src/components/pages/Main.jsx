import React, { useState } from "react";
import Header from "../utils/Header.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../utils/Navbar";
import Loading from "../utils/Loading.jsx";
import { useLoader } from "../contexts/LoaderContext.jsx";
import { useNavbar } from "../contexts/NavbarContext.jsx";

function Main() {
  
  const { openNav } = useNavbar();
  const { loading } = useLoader();
  
  return (
      <div className="bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
        <div className="overflow-hidden"></div>
        <Header searchBarVisibility={true} />
        <div className="flex flex-row flex-2">
          <Navbar />
          <main className={`absolute h-[calc(100dvh-66px)] top-16.5 right-0 bottom-0 bg-transparent border-0 
             transform transition-all duration-300 ease-in-out p-0 m-0 overflow-hidden
             ${loading ? "blur-sm pointer-events-none" : ""}
            ${openNav ? "w-[calc(100dvw-184px)] sm:translate-x-0 max-sm:w-[100dvw] max-sm:blur-sm max-sm:pointer-events-none" : "w-[100dvw] -translate-x-0"}`}
          > 
            <Outlet />
          </main>
          { 
            loading && (
              <div className={`absolute h-[calc(100dvh-66px)] top-16.5 right-0 bottom-0 bg-transparent border-0 
                transform transition-all duration-300 ease-in-out p-0 m-0 overflow-hidden
                ${ openNav ? "w-[calc(100dvw-184px)] sm:translate-x-0 max-sm:w-[100dvw] max-sm:blur-sm max-sm:pointer-events-none" : 
                "w-[100dvw] -translate-x-0"}`}>
                  <Loading />
              </div>
          )}
        </div>         
      </div>
  );
}

export default Main;
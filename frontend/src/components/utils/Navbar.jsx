import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { logout } from "../../firebasesetup/authService";
import { Flag, Heart, History, Home, Info, LogOut, Settings, SunMoon, Upload, User, UserCircle2 } from "lucide-react";
import { useNavbar } from "../contexts/NavbarContext";

function MenuItem({ icon, label, name, active, onClick, danger, extramr=false, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-[calc(100%-16px)] text-left px-4 py-2 m-2 text-sm hover:bg-[var(--border)] transition flex flex-row items-center 
        rounded-lg ${className} cursor-pointer ${name === active ? "bg-[var(--border)]" : "bg-transparent" }`}
    >
      <div className={`mr-3 ${danger ? "text-red-500 font-bold" : "font-semibold text-[var(--list-text)]"}`}> {icon} </div>
      <div className={`${extramr ? "ml-1" : ""} ${danger ? "text-red-500 font-bold" : "font-semibold text-[var(--list-text)]"}`}> {label} </div>
    </button>
  );
}

export default function Navbar() {
  const { setUser } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const { openNav, setOpenNav } = useNavbar();
  const navigate = useNavigate();
  const ref = useRef(null);

  /* ---------- Outside click (ONLY small screens) ---------- */
  useEffect(() => {
    const handler = (e) => {
        if (window.innerWidth < 1024 && ref.current && !ref.current.contains(e.target)) 
        {
            setOpenNav(false);
        }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setOpenNav]);

  /* ---------- Resize behavior ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpenNav(true);   // always open on large
      } else {
        setOpenNav(false);  // default closed on small
      }
    };

    handleResize(); // important: run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setOpenNav]);

  /* ---------- Helper for navigation ---------- */
  const [active, setActive] = useState("home");

  const handleNavigate = ({path, label}) => {
    setActive(label);
    navigate(path);
    if (window.innerWidth < 1024) {
      setOpenNav(false);
    }
  };

  return(
        <div className={`absolute left-0 p-0 top-16.5 bottom-0 w-46 h-[calc(100dvh-68px)] border-r-2 border-[var(--border)]
                transform transition-all duration-300 ease-in-out rounded-br-[5px] text-[var(--secondary-text)] bg-[var(--background)]
                shadow-md z-50 ${ openNav ? "sm:translate-x-0" : "-translate-x-full" } `} ref={ref}
        >
            
            <div className="flex flex-row-reverse px-4 py-2 border-b-4 border-[var(--secondary)] bg-[url('/rack.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="w-7 h-7 items-center justify-center rounded-full bg-[var(--background)]" onClick={()=>setOpenNav(false)}>
                    <img src={ "/back.png" } className={`icon w-7 h-7 p-1 cursor-pointer rounded-full text-[var(--text)]
                        hover:transform hover:scale-90 ${darkMode ? "invert" : ""} `} alt="X"/>
                </div>
            </div>
            <div className="w-full h-[calc(100%-60px)] bg-transparent rounded-br-[5px] flex-col-2">
                <div className="w-full h-[calc(100%-224px)] py-2 overflow-x-hidden overflow-y-auto scrollbar-auto">
                    <MenuItem label="Home" icon={<Home size={22}/>} name={"home"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/home", label:"home"})} />
                    <MenuItem label="Profile" icon={<UserCircle2 size={22}/>} name={"profile"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/profile",label:"profile"})}/>
                    <MenuItem label="Favourites" icon={<Heart size={22}/>} name={"favourites"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/favourites",label:"favourites"})}/>
                    <MenuItem label="My Readings" icon={<History size={22}/>} name={"readings"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/readings",label:"readings"})}/>
                    <MenuItem label="My Uploads" icon={<Upload size={22}/>} name={"uploads"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/uploads",label:"uploads"})}/>
                    <MenuItem label="Report" icon={<Flag size={22}/>} name={"report"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/report",label:"report"})}/>
                    <MenuItem label="About Us" icon={<Info size={22}/>} name={"info"} active={active} extramr 
                              onClick={() => handleNavigate({path:"/app/info",label:"info"})} />
                </div>
                <div className="absolute w-full h-fit bottom-1 flex flex-col px-0 py-1 border-t-4 border-[var(--border)] bg-[var(--background)] rounded-br-[5px] overflow-hidden">
                    <MenuItem label={<Settings size={22}/>} icon={<div className="w-25 font-bold items-center"> Settings </div>} 
                              name={"settings"} active={active} className="hover:bg-transparent"/>
                    <div className="w-full h-fit p-0 border-b-3 border-[var(--border)]"/>
                    <MenuItem label="Account" icon={<User size={22} />} name={"account"} active={active}
                              onClick={() => handleNavigate({path:"/app/account",label:"account"})} />
                    <MenuItem label= {
                        <div className="flex flex-row flex-2 items-center justify-between"> 
                            <div >Darkmode</div>
                            <div className="ml-2">
                                <div
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`w-10 h-5 flex items-center flex-row justify-between rounded-full border-2 border-[var(--hover)] 
                                    transition-colors duration-300 ${ darkMode ? "bg-[var(--accent)]" : "glass p-0"} `}
                                >
                                    <span
                                        className={`w-4 h-4 absolute flex flex-row border-3 items-center text-[var(--text)] rounded-full
                                            transform transition-transform duration-300 shadow-md hover:w-4.25 hover:h-4.25 bg-black
                                            ${ darkMode ? "translate-x-[20px] border-[var(--accent)]" : "translate-x-0 border-gray-300" }`}
                                    >
                                    </span>
                                </div>
                            </div>
                        </div> } name={"theme"} active={active} icon={<SunMoon size={22}/>} className="hover:bg-transparent"/>
                    <MenuItem label="Logout" icon={<LogOut size={22}/>} danger name={"logout"} active={active} 
                              onClick={() => logout(setUser, navigate, toast)} />
                </div>
            </div>
        </div>
    );
}

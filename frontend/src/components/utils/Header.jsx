import React, { useRef, useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, SearchIcon, FilterIcon, FilterXIcon, ArrowLeft, X, Menu, LogOut, User } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SafeImage from "./SafeImage";
import { logout } from "../../firebasesetup/authService";
import NotificationDot from "./NotificationDot";
import { useNavbar } from "../contexts/NavbarContext";
import { useCategories } from "../contexts/CategoriesContext";
import { FILTER_CONFIGS } from "@/constants/filters";
import UniversalFilter from "./UniversalFilter";

function MenuItem({ icon, label, onClick, danger, show=false, className=""}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-[calc(100%-8px)] text-left px-1 py-2 mx-0 my-2 text-sm hover:bg-[var(--border)] transition flex flex-row 
        items-center rounded-lg ${className} ${ show ? "border-[1px] border-[var(--border)]" : "" }`}
    >
        <NotificationDot show={show}/>
        <div className={`mr-2 font-bold ${danger ? "text-red-500" : "text-[var(--text)]"} `}>{icon}</div>
        <div className={`${danger ? "text-red-500 font-semibold" : "text-[var(--text)]"} `}>{label}</div>
    </button>
  );
}

function Header({ searchBarVisibility }) {
  const { darkMode, setDarkMode } = useTheme();
  const { user, setUser } = useUser();
  const { openNav, setOpenNav } = useNavbar();
  const { categories } = useCategories();

  const navigate = useNavigate();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchBarShow, setSearchBarShow] = useState(false);
  const [showProfileDot, setShowProfileDot] = useState(!user?.hasPassword);
  const [showDot, setShowDot] = useState(!user?.hasPassword);
  const [openFilter, setOpenFilter] = useState(false);


  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getBooks = async( search ) => {

  };

  const fetchBooks=(filters)=>{
    console.log(JSON.stringify(filters));
  };

  return (
    <header className="w-[100dvw] bg-[var(--background)] h-15 shadow-md fixed top-[3px] left-0 z-100">
      { searchBarShow ? 
        
        <div className={`${searchBarShow ? '' : 'hidden'} w-fit h-[40px] bg-[var(--muted)] rounded-[1rem] m-2 items-center flex flex-row sm:hidden`}>
          <button className="btn glass w-12 h-full rounded-l-2xl rounded-bl-2xl rounded-r-0 rounded-br-0 m-0.5 p-2 border-none" onClick={()=>setSearchBarShow(!searchBarShow)}>
              <ArrowLeft className="icon w-[24px] h-[24px]"/>
          </button>
          <div className="glass w-[calc(100vw-120px)] h-full border-none text-[var(--text)] m-0 p-0 flex flex-row flex-2 items-center justify-between">
            <input
              name="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent w-full h-full border-none text-[var(--text)] pr-0"
            />
            <X onClick={() => setSearch("")} className={`icon w-[28px] h-[28px] cursor-pointer m-0 bg-transparent
                ${search.length > 0 ? "" : "hidden pointer-events-none"} `}
            />
          </div>
          <button onClick={()=>getBooks(search)} className="btn glass w-12 h-full rounded-l-0 rounded-bl-0 rounded-r-2xl rounded-br-2xl m-0.5 p-2 border-none">
              <SearchIcon className="icon w-[24px] h-[24px]"/>
          </button>
        </div>
        :
        <div className="w-full h-full pl-1 pr-4 py-2 mx-auto flex items-center justify-between">
          {/* Logo + Site name 360px 428px 572px 656px 792px 960px */}
          <div className="flex w-fit items-center space-x-2 select-none bg-transparent lg:w-fit">
            { searchBarVisibility ? 
                <button
                  onClick={() => setOpenNav(!openNav)}
                  className="p-2 rounded-lg hover:bg-[var(--border)] transition ml-0 cursor-pointer"
                >
                  <Menu className="w-6 h-6" />
                </button> 
              : "" 
            }
            <SafeImage src="/logo.png" alt="Logo" className={`h-7 w-7 ml-${ searchBarVisibility ? 0 : 2}`}/>
            <div className={`h-5 w-fit max-w-30 max-[389px]:w-[calc(100%-40px)] min-[640px]:w-[calc(100%-40px)]
                max-[720px]:w-[calc(100%-40px)]`}
                ><SafeImage src="/title.svg" alt="" className={`h-full w-fit items-start ${darkMode ? 'invert' : ''}`}/>
            </div>
          </div>

          {/* Search bar (hidden on very small screens) */}
          <div className={`${searchBarVisibility ? 'sm:flex sm:flex-row' : 'hidden'} hidden items-center justify-between w-full 
            sm:w-[400px] md:w-[500px] lg:w-[600px] h-[40px] bg-[var(--muted)] rounded-[20px] my-1 mx-3`}>
            <button className="relative btn glass h-full rounded-l-2xl rounded-r-none m-0.5 border-none" onClick={()=>setOpenFilter(true)}>
              <FilterIcon className={`icon ${openFilter ? "text-[var(--accent)]" : ""}`} />
            </button>

            { openFilter && 
                <UniversalFilter
                    open={openFilter}
                    setOpen={setOpenFilter}
                    className="bg-[var(--background)]"
                    categories={categories}
                    config={FILTER_CONFIGS.home}
                    onApply={(filters) => {fetchBooks(filters);}}
                />
            }

            <div className="glass w-[calc(100vw-120px)] h-full border-none text-[var(--text)] m-0 p-0 flex flex-row flex-2 items-center justify-between">
              <input
                name="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent w-full h-full border-none text-[var(--text)] pr-0"
              />
              <X onClick={() => setSearch("")} className={`icon w-[28px] h-[28px] cursor-pointer m-0 bg-transparent
                  ${search.length > 0 ? "" : "hidden pointer-events-none"} `}
              />
            </div>

            <button onClick={()=>getBooks(search)} className="btn glass h-full rounded-r-2xl rounded-l-none m-0.5 border-none">
              <SearchIcon className="icon w-[24px] h-[24px]" />
            </button>
            
          </div>

          

          {/* Right side buttons */}
          <div className="flex flex-row items-center space-x-3">
            {/* Dark / Light Mode Toggle */}
            { searchBarVisibility ? "" : <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-6 flex items-center flex-row justify-between rounded-full border-1 border-[var(--hover)] transition-colors duration-300 bg-[var(--accent)]"
            >
              {/* Sun icon on left */}
              <Sun size={14} className="text-gray-50 m-1 bg-transparent rounded-full" />

              {/* Moon icon on right */}
              <Moon size={14} className="text-gray-50 m-1 bg-transparent rounded-full" />

              {/* Toggle circle */}
              <span
                className={`w-4.5 h-4.5 absolute flex flex-row border-3 border-[var(--accent)] items-center bg-[var(--background)]
                  text-[var(--text)] rounded-full transform transition-transform duration-300 shadow-md hover:w-5 hover:h-5
                  ${ darkMode ? "translate-x-[25px]" : "translate-x-0.5" }`}
              >
              </span>
            </button> }

            {/* Login / Profile */}
            {!user.userId ? (  
              <button
                onClick={() => { navigate("/login") }}
                className="btn w-fit h-[40px] text-[var(--text)] px-3 font-semibold rounded-lg text-sm border-[var(--accent)] border-2 
                    hover:scale-95 hover:shadow-2xl hover:bg-[var(--muted)] xl:w-50 xl:rounded-full select-none"
                >Sign&nbsp;In/Up&nbsp;<SafeImage src="/google.png" alt="" className="icon bg-transparent select-none"/>
              </button>            
            ) : (
              <div className="flex flex-row gap-1 items-center">
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent hover:bg-[var(--hover)] sm:hidden" 
                        onClick={()=>setSearchBarShow(!searchBarShow)}>
                  <SearchIcon size={20}/>
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent hover:bg-[var(--hover)] sm:hidden"
                        onClick={()=>setOpenFilter(true)}>
                  <FilterIcon size={18} className={`${openFilter ? "text-[var(--accent)]" : ""}`}/>
                </button>
                { openFilter && 
                    <UniversalFilter
                        open={openFilter}
                        setOpen={setOpenFilter}
                        className="sm:hidden bg-[var(--background)]"
                        categories={categories}
                        config={FILTER_CONFIGS.home}
                        onApply={(filters) => {fetchBooks(filters);}}
                    />
                }
                <div className="relative" ref={ref}>
                  <div onClick={() =>{setShowProfileDot(showDot); setOpen(!open);}} className="relative">
                    <NotificationDot show = {showProfileDot} />
                    <SafeImage alt="Profile" className="w-8 h-8 ml-1 rounded-full border-2 border-[var(--hover)] cursor-pointer text-[var(--text)]"
                              src={user.picture} fallback="/profile.png" />
                  </div>
                  { open && (
                  <div className="absolute right-3 md:right-5 mt-5 w-44 z-52 p-2 h-fit bg-[var(--background)] text-sm text-[var(--text)] items-start rounded-lg shadow-lg">
                    <button onClick={()=>{navigate("/app/profile"); setOpen(!open);}} className="w-full my-2 px-0 py-1 flex flex-row items-center justify-around cursor-pointer">      
                      <SafeImage alt="Profile" className="w-8 h-8 m-1 rounded-full border-2 border-[var(--hover)] cursor-pointer
                                  text-[var(--text)]" src={user.picture} fallback="/profile.png"/>
                      
                      <div className="w-[calc(100%-40px)] flex flex-col place-items-start p-0 mr-1 text-left">
                        <div className="w-full text-sm line-clamp-1 px-1 py-0">{user.username}</div>
                        <div className="w-full text-[13px] line-clamp-1 px-1 py-0 text-[var(--muted-text)]">
                          {user.email.toString().substring(0,15) + "..."}
                        </div>
                      </div>
                    </button>
                    <MenuItem label="Update Profile" icon={<User size={20}/>} show={showDot} onClick={() =>{setShowDot(false); setShowProfileDot(false); navigate("/app/account"); setOpen(!open);}} />
                    <MenuItem label="Logout" icon={<LogOut size={20}/>} danger onClick={() =>{setOpen(!open); logout(setUser, navigate, toast);}} />
                  </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </header>
  );
}

export default Header;
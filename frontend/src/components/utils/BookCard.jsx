import { Heart, Flag, Star, Download, MoreVertical } from "lucide-react";
import SafeImage from "./SafeImage";
import { useState, useRef, useEffect, useMemo } from "react";
import { defaultBook } from "@/constants/defaultUser";
import { useActions } from "../hooks/useActions";


function MenuItem({ icon, label, onClick, danger, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-fit text-left p-2 text-sm transition flex flex-row items-center cursor-pointer
        rounded-full ${className} bg-[var(--secondary)] shadow hover:bg-[var(--card)]`}
    >
      <div className={`${label ? "mr-3":""} ${danger ? "text-red-500" : "text-[var(--list-text)]"}`}> {icon} </div>
      {label && <div className={`${danger ? "text-red-500" : "text-[var(--list-text)]"}`}> {label} </div>}
    </button>
  );
}


export default function BookCard({ book, onClick, secondaryCategory=false, showActions = false, scrollRef, className="" }) 
{
  const { toggleFavourite, goToBookDetails, reportTheBook, download } = useActions();
  const safeBook = useMemo(() => ({ ...defaultBook(), ...(book || {}) }), [book] );

  const authors = safeBook.authors.length ? safeBook.authors.join(", ") : "Unknown author";
  
  const [isFavourite, setIsFavourite] = useState(safeBook.isFavourite || false);
  const [show, setShow] = useState(false);

  const menuRef = useRef(null);

  // Menu hide on click + scroll
  useEffect(() => {
      if (!show) return;
      const handleOutsideClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) { setShow(false); } };
      const handleScroll = () => { setShow(false); };
      document.addEventListener("mousedown", handleOutsideClick);
      scrollRef?.current?.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        scrollRef?.current?.removeEventListener("scroll", handleScroll);
      };
  }, [show, scrollRef]);

  return (
    <div onClick={onClick ? onClick : () => goToBookDetails(safeBook)} className={`w-40 bg-[var(--background)] rounded-xl shadow-md
                 cursor-pointer transition-all duration-300 border-2 border-[var(--border)]
                 hover:shadow-xl hover:-translate-y-1 ${className} text-sm`}>

      {/* Cover */}
      <div className="relative w-full h-60 rounded-t-xl overflow-hidden">
        <SafeImage src={safeBook.coverUrl} fallback="/no-book.svg" className="w-full h-full object-cover"/>

        {/* Floating actions */}
        { (show && showActions) && (
          <div ref={menuRef} className="absolute z-50 top-1.5 right-1.5 flex flex-col gap-2 transition duration-200" onClick={(e)=>{e.stopPropagation();}}>
            <MenuItem icon={<Heart size={16} className={`${isFavourite ? "fill-red-500 text-red-500" : ""}`}/>} 
                      onClick={() => {toggleFavourite(safeBook, setIsFavourite);}}/>
            <MenuItem icon={<Download size={16}/>} onClick={() => {download(safeBook);}}/>
            <MenuItem icon={<Flag size={16}/>} onClick={() => {reportTheBook(safeBook);}}/>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="py-2 space-y-1">
        <div className="flex flex-row items-start">
          {showActions && 
          (<div className="block items-start w-6 max-h-fit text-sm" onClick={(e)=>{e.stopPropagation(); setShow(!show);}} >
            <MoreVertical className="w-6 h-6 rounded-full p-1 cursor-pointer hover:bg-[var(--border)]" /> 
          </div>)}
          <div className={`flex flex-col ${ showActions ? "w-[calc(100%-24px)] pr-2":"w-full px-2"}`}>
            <h3 className="text-sm font-semibold text-[var(--text)] line-clamp-1"> {safeBook.title} </h3>
            <p className="text-xs text-[var(--muted-text)] line-clamp-1"> {authors} </p>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between gap-1 mx-2 mt-2">
          <span className="flex flex-row items-center justify-center text-xs gap-1">
            <Star size={14} className="text-amber-400 fill-amber-300" /> 
            <div>{safeBook.ratingAvg.toFixed(1)}</div> 
          </span>
          <span className="w-fit max-w-[calc(100%-36px)] text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--text)] line-clamp-1">
            { (secondaryCategory ? safeBook.categories[1] : safeBook.categories[0]) || safeBook.categories[0] }
          </span>
        </div>
      </div>
    </div>
  );
}

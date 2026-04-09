import { Heart, Flag, Trash2, Play, MoreVertical, HeartOff, SkipBack, Repeat, Download, X } from "lucide-react";
import Button from "./Button";
import SafeImage from "./SafeImage";
import { useState, useEffect, useRef, useMemo } from "react";
import { defaultReadingBook } from "@/constants/defaultUser";
import { useActions } from "../hooks/useActions";
import MenuItem from "./MenuItem";

export default function ReadingBookCard({ book, onClick, scrollRef }) {

  const { toggleFavourite, goToBookDetails, reportTheBook, download, rereadTheBook, removeTheReading } = useActions();

  const menuRef = useRef(null);
  const safeBook = useMemo(() => ({ ...defaultReadingBook(), ...(book || {}) }), [book] );
  
  const authors = safeBook.authors.length ? safeBook.authors.join(", ") : "Unknown author";
  const progress = safeBook.readingStatus.totalPages > 0 ? Math.round((safeBook.readingStatus.currentPage / safeBook.readingStatus.totalPages) * 100) : 0;

  const [isFavourite, setIsFavourite] = useState(safeBook.isFavourite || false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div onClick={onClick ? onClick : () => goToBookDetails(safeBook)} className="relative w-full max-h-max flex flex-row gap-3 p-3 rounded-xl bg-[var(--background)] 
          transform hover:scale-98 shadow-sm border border-[var(--border)]">
      {/* COVER */}
      <div className="w-30 max-h-max min-h-40 items-center">
        <SafeImage src={safeBook.coverUrl} alt={safeBook.title} fallback="/no-book.svg" className="w-30 h-full object-cover rounded-md shadow" />
      </div>

      {/* DETAILS */}
      <div className="w-[calc(100%-144px)] flex flex-col flex-1 justify-between text-start">
        <div>
          <h3 className="mr-5 font-semibold text-base line-clamp-2">{safeBook.title}</h3>
          <p className="text-sm opacity-70">{authors}</p>
          <p className="text-sm mt-1 opacity-80"> ⭐ {safeBook.ratingAvg.toFixed(1)} </p>
        </div>

        {/* PROGRESS */}
        <div className="mt-2">
          <div className="relative">
            <div className="relative w-full h-1 bg-[var(--progressbar)] rounded-full overflow-hidden">
              <div className={`h-full ${safeBook.readingStatus.status !== "completed" ? "bg-[var(--accent)]" : "bg-[var(--success)]"} transition-all`} 
                   style={{ width: `${progress}%` }} />
            </div>
            { safeBook.readingStatus.status==="completed" && 
            (<span className="absolute z-10 -top-[calc(50%+4px)] right-0 bg-[var(--success)] font-medium 
                flex items-center min-w-4 max-w-fit h-4 justify-center rounded-full border-2 border-[var(--success)] text-[10px] text-white">
                 { safeBook.readingStatus.repetitionCount > 1 ? safeBook.readingStatus.repetitionCount : "✓" }
            </span>
            )}
          </div>
          <div className="text-xs mt-2 opacity-70 flex flex-row justify-between">
            <div>Page {safeBook.readingStatus.currentPage} / {safeBook.readingStatus.totalPages}</div>
            { (safeBook.readingStatus.repetitionCount > 0 && safeBook.readingStatus.status!=="completed" ) && 
              (<div className="flex mx-1 justify-center items-center">
                <Repeat size={15}/>&nbsp;
                <div className="text-center align-middle">{safeBook.readingStatus.repetitionCount+1}</div>
            </div>)}
            <div>{progress}%</div>
          </div>
        </div>
        
        {/* ACTIONS */}
        <div className="w-full mt-2 flex flex-row-reverse items-center justify-between">
          {/* CONTINUE BUTTON */}
          {safeBook.readingStatus.status === "completed" ? (
            <Button variant="outline" size="sm" className="text-sm flex items-center gap-2 shrink-0 rounded-lg border border-[var(--border)]"
                    onClick={(e)=>{e.stopPropagation(); rereadTheBook(safeBook);}}>
              <SkipBack size={16} className="fill-[var(--accent)]"/>
              Re-Read
            </Button>
          ) : (
            <Button size="sm" className="text-sm flex items-center gap-2 shrink-0 rounded-lg opacity-90" onClick={(e)=>{e.stopPropagation();}}>
              <Play size={16}/>
              Continue
            </Button>
          )}
        </div>
      </div>

      {/* ICON ACTIONS */}
      {show ? <X className="w-8 h-8 absolute top-2 right-1 p-2 rounded-full cursor-pointer hover:bg-[var(--border)]" 
                    onClick={(e)=>{e.stopPropagation(); setShow(!show);}} /> 
            : <MoreVertical className="w-8 h-8 absolute top-2 right-1 p-2 rounded-full cursor-pointer hover:bg-[var(--border)]" 
                    onClick={(e)=>{e.stopPropagation(); setShow(!show);}} />
      }

      { show && (
        <div ref={menuRef} className={`absolute top-10 right-1 z-10 rounded-2xl flex flex-col w-fit hit-fit bg-[var(--card)]
               p-2 border border-[var(--border)] shadow-md`} onClick={(e) => {e.stopPropagation();}}>
          <MenuItem icon={ isFavourite ? <HeartOff size={20}/> : <Heart size={20}/> } label={ isFavourite ? "UnLike" : "Like" } 
                    onClick={() => {toggleFavourite(safeBook, setIsFavourite);}} />
          <MenuItem icon={<Download size={16}/>} label={"Download"} onClick={() => {download(safeBook);}}/>
          <MenuItem icon={<Flag size={20}/>} label={"Report"} onClick={()=>{reportTheBook(safeBook);}}/>
          <MenuItem icon={<Trash2 size={20}/>} label={"Remove from here"} loading={loading}
                    onClick={()=>{removeTheReading({bookId: safeBook.bookId, setLoading: setLoading}); setShow(false);}} danger />
        </div>
      )}

    </div>
  );
}

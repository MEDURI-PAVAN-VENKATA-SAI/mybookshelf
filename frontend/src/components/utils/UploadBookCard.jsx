import { Heart, Flag, Trash2, MoreVertical, HeartOff, Download, Edit, X } from "lucide-react";
import SafeImage from "./SafeImage";
import { useState, useEffect, useRef, useMemo } from "react";
import { defaultUploadedBook } from "@/constants/defaultUser";
import ReadMore from "./ReadMore";
import CommonProgress from "./CommonProgress";
import MenuItem from "./MenuItem";
import { useActions } from "../hooks/useActions";


export default function UploadBookCard({ book, onClick, scrollRef }) {

    const { toggleFavourite, goToBookDetails, reportTheBook, download, removeTheUpload } = useActions();

    const menuRef = useRef(null);
    const safeBook = useMemo(() => ({ ...defaultUploadedBook(), ...(book || {}) }), [book] );

    const title = safeBook.title ? safeBook.title : safeBook.uploadStatus?.title ;
    const authors = safeBook.authors.length ? safeBook.authors.join(", ") : safeBook.uploadStatus?.authors.join(", ") ; 
    const enableAction = (safeBook.uploadStatus.status === "published") ? true : false ;

    const [show, setShow] = useState(false);
    const [isFavourite, setIsFavourite] = useState(safeBook.isFavourite || false);
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
        <div onClick={onClick ? onClick : () => goToBookDetails(safeBook)} className="relative w-full max-h-max flex flex-col gap-3 p-3 rounded-xl bg-[var(--background)] 
            transform hover:scale-98 shadow-sm border border-[var(--border)]">
            {/* COVER */}
            <div className="w-full max-h-max flex flex-row gap-3">
                <div className="w-30 h-45 items-center">
                    <SafeImage src={safeBook.coverUrl} alt={title ? title : "Book image"} fallback="/no-book.svg" className="w-30 h-45 object-cover rounded-md shadow" />
                </div>

                {/* DETAILS */}
                <div className="w-[calc(100%-144px)] flex flex-col flex-1 justify-between text-start">
                    <div className="h-25">
                        <h3 className="mr-5 font-semibold text-base line-clamp-2">{title ? title : "Title"}</h3>
                        <p className="text-sm opacity-70">{authors ? authors : "Unknown author"}</p>
                        <p className="text-sm mt-1 opacity-80"> ⭐ {safeBook.ratingAvg.toFixed(1)} </p>
                    </div>

                    {/* PROGRESS */}
                    <div className="h-20">
                        <CommonProgress cardStatus={safeBook.uploadStatus} type={"upload"}/>
                    </div>
                </div>
            </div>

            {safeBook.uploadStatus.reason && 
                (<div className="m-2 justify-center text-sm flex" onClick={(e)=>e.stopPropagation()}>
                    <strong className="font-semibold">Remarks:&nbsp;</strong>
                    <ReadMore text={safeBook.uploadStatus.reason} />
                </div>
            )}

            {/* ICON ACTIONS */}
            { show ? <X className="w-8 h-8 absolute top-2 right-1 p-2 rounded-full cursor-pointer hover:bg-[var(--border)]" 
                            onClick={(e)=>{e.stopPropagation(); setShow(!show);}}/> 
                   : <MoreVertical className="w-8 h-8 absolute top-2 right-1 p-2 rounded-full cursor-pointer hover:bg-[var(--border)]" 
                            onClick={(e)=>{e.stopPropagation(); setShow(!show);}}/> 
            }

            { show && 
                (<div ref={menuRef} className={`absolute top-10 right-1 z-10 rounded-2xl flex flex-col w-fit hit-fit bg-[var(--card)] p-2 border
                        border-[var(--border)] shadow-md`} onClick={(e)=>{e.stopPropagation();}}>
                    { enableAction && <MenuItem icon={ isFavourite ? <HeartOff size={20}/> : <Heart size={20}/> } 
                        label={ isFavourite ? "UnLike" : "Like" } onClick={() => {toggleFavourite(safeBook, setIsFavourite);}} />}
                    { enableAction && <MenuItem icon={<Download size={20}/>} label={"Download"} onClick={() => {download(safeBook);}} />}
                    { safeBook.uploadStatus.status !== "removed" && <MenuItem icon={<Flag size={20}/>} label={"Report"} 
                        onClick={()=>{reportTheBook(safeBook);}} />}
                    { /* enableAction && <MenuItem icon={<Edit size={20}/>} label={"Edit"} onClick={()=>{}}/> */}
                    <MenuItem icon={<Trash2 size={20}/>} label={"Delete"} loading={loading} danger
                                 onClick={()=>{removeTheUpload({bookId: safeBook.bookId, setLoading: setLoading}); setShow(false);}} />
                </div>
            )}

        </div>
    );
}

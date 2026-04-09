import { useState, useMemo } from "react";
import SafeImage from "../utils/SafeImage";
import Button from "../utils/Button";
import { startReading , rereadBook, getReadingStatus, getUserRating } from "@/api/books";
import { defaultBook } from "@/constants/defaultUser";
import { useLocation } from "react-router-dom";
import StarRating from "../utils/StarRating";
import { useActions } from "../hooks/useActions";
import { useSelectedData } from "../contexts/SelectedDataContext";
import ReportCard from "../utils/ReportCard";

function Detail({ title, description }) {
  return (
    <div className="bg-[var(--card)] flex items-center gap-3 mb-3">
        <div><h3 className="font-semibold text-lg text-[var(--card-text)]">{title}</h3></div>
        <div className="text-sm text-[var(--muted-text)]">{description}</div>
    </div>
  );
}

function BookDetails(){

    const { toggleFavourite, download, reportTheBook, goToBookReader } = useActions();
    const { openPopUp } = useSelectedData();
    const location = useLocation();

    const { book } = location.state || {};
    const safeBook = useMemo(() => ({ ...defaultBook(), ...(book || {}) }), [book] );
    const authors = safeBook.authors.length ? safeBook.authors.join(", ") : "Unknown author";

    const [loading, setLoading] = useState(false);
    const [isFavourite, setIsFavourite] = useState(safeBook.isFavourite || false);

    const rating = async () => await getUserRating(safeBook.bookId);
    const readingStatus = async () => await getReadingStatus(safeBook.bookId);

    const getAction = (readingStatus) => {
        if (!readingStatus) return "start";
        if (readingStatus.status === "completed") return "reread";
        return "continue";
    };

    const action = getAction(readingStatus);

    const handleClick = async () => {
        if (action === "start") { setLoading(true); await startReading(safeBook.bookId, safeBook.totalPages); setLoading(false); }
        if (action === "reread") { setLoading(true); await rereadBook(safeBook.bookId); setLoading(false); }
        goToBookReader(safeBook);
    };

    return(
        <div className={`${ openPopUp ? "pointer-events-none" : "" } relative w-full h-full items-center flex flex-col justify-center overflow-hidden`}>
        
            <div className={`${ openPopUp ? "pointer-events-none blur-xl select-none" : ""} w-full h-[calc(100%-44px)] pt-8 flex flex-col justify-center overflow-hidden`}>
            
                <div className={`w-full h-full relative bg-[var(--secondary)] px-1 min-[364px]:px-4 overflow-x-hidden 
                      overflow-y-auto scrollbar-auto`}>
            
                    <div className="flex flex-wrap justify-center gap-3 min-[578px]:gap-6">
                        <div className="w-[30%] h-full">
                            <SafeImage src={safeBook.coverUrl} fallback="/no-book.svg" className="w-full h-[90%]"/>
                            <StarRating bookId={safeBook.bookId} title={safeBook.title} initialRating={rating}/>
                        </div>
                        <div className="w-[30%] h-full">
                            <Detail title={"Title : "} description={safeBook.title} />
                            <Detail title={safeBook.authors.length > 1 ? "Authors : " : "Author : "} description={authors} />
                            <Button onClick={handleClick} disabled={loading}>
                                {action === "start" && "Start Reading"}
                                {action === "continue" && "Continue Reading"}
                                {action === "reread" && "Re-Read"}
                            </Button>
                        </div>
                        <div className="w-[30%] h-full">

                        </div>
                    </div>
        
                </div>
        
            </div>
            
            <div className={`${ openPopUp ? "pointer-events-auto" : "hidden"} fixed z-50 max-h-[calc(100%-56px)] align-middle mx-4 py-8 
                              bg-[var(--background)] justify-center shadow-md rounded-xl items-center overflow-auto scrollbar-auto`}>
                <div className={`align-middle w-full h-full justify-center items-center overflow-x-hidden overflow-y-auto scrollbar-auto`}>
                    <ReportCard />
                </div>
            </div>
            
        </div>

    );
}

export default BookDetails;
import { useState, useMemo } from "react";
import SafeImage from "../utils/SafeImage";
import Button from "../utils/Button";
import { startReading , rereadBook, getReadingStatus } from "@/api/books";
import { defaultBook } from "@/constants/defaultUser";
import { useLocation } from "react-router-dom";
import StarRating from "../utils/StarRating";
import { useActions } from "../hooks/useActions";
import { useSelectedData } from "../contexts/SelectedDataContext";
import ReportCard from "../utils/ReportCard";
import { Heart, Flag, Star, Download } from "lucide-react";

function Detail({ title, description }) {
  return (
    <div className="flex items-start gap-3 mb-3">
        <div className="flex items-start justify-between">
            <div className="h-full font-semibold text-sm text-[var(--card-text)] shrink-0 w-20 min-w-max text-start">{title}</div>
            <div className="h-full font-semibold text-sm text-[var(--card-text)] shrink-0 mx-1 text-start">:</div>
        </div>
        <div className="font-semibold text-sm text-[var(--muted-text)]">{description}</div>
    </div>  
  );
}

function MenuItem({ icon, onClick, danger, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-fit text-left p-2 text-sm transition flex flex-row items-center cursor-pointer
        rounded-full ${className} bg-[var(--background)] shadow hover:bg-[var(--secondary)] transform hover:scale-[0.95]`}
    >
      <div className={`${danger ? "text-red-500" : "text-[var(--list-text)]"}`}> {icon} </div>
    </button>
  );
}

function BookDetails(){

    const { toggleFavourite, download, reportTheBook, goToBookReader, getCategoryLabels, getLanguageLabel } = useActions();
    const { openPopUp } = useSelectedData();
    const location = useLocation();

    const { book } = location.state || {};
    const safeBook = useMemo(() => ({ ...defaultBook(), ...(book || {}) }), [book] );
    const authors = safeBook.authors.length ? safeBook.authors.join(", ") : "Unknown author";
    const language = getLanguageLabel(safeBook.language);
    const categoriesArray = getCategoryLabels(safeBook.categories);
    const categories = categoriesArray.length ? categoriesArray.join(", ") : "-";

    const [loading, setLoading] = useState(false);
    const [isFavourite, setIsFavourite] = useState(safeBook.isFavourite || false);
    
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
        
            <div className={`${ openPopUp ? "pointer-events-none blur-xl select-none" : ""} w-full h-[calc(100%-44px)] flex flex-col justify-center overflow-hidden`}>
            
                <div className={`w-full h-full bg-[var(--secondary)] overflow-x-hidden overflow-y-auto scrollbar-auto
                    flex flex-col min-[578px]:flex-row gap-3 min-[578px]:gap-6 px-2 min-[578px]:px-4`}>

                        <div className="w-full min-[578px]:w-[30%] h-full">
                            <div className="relative w-full h-[calc(100%-75px)] rounded overflow-hidden"> {/**h-[calc(100%-75px)] */}
                                <SafeImage src={safeBook.coverUrl} fallback="/no-book.svg" className="aspect-[9/16] w-full object-cover rounded"/>

                                {/* Floating actions */}
                                <div className="absolute z-50 top-1.5 right-1.5 flex flex-col gap-2 transition duration-200">
                                    <MenuItem icon={<Heart size={20} className={`${isFavourite ? "fill-red-500 text-red-500" : ""}`}/>} 
                                            onClick={() => {toggleFavourite(safeBook, setIsFavourite);}}/>
                                    <MenuItem icon={<Download size={20}/>} onClick={() => {download(safeBook);}}/>
                                    <MenuItem icon={<Flag size={20}/>} onClick={() => {reportTheBook(safeBook);}}/>
                                </div>
                            </div>
                            <StarRating bookId={safeBook.bookId} title={safeBook.title} />
                        </div>

                        <div className="w-full min-[578px]:w-[70%] h-full bg-[var(--background)] p-4 rounded">
                            <Detail title={"Title"} description={safeBook.title} />
                            <Detail title={safeBook.authors.length > 1 ? "Authors" : "Author"} description={authors} />
                            <Detail title={"Publisher"} description={safeBook.publisher} />
                            <Detail title={"Release Year"} description={safeBook.publishedYear} />
                            <Detail title={"Category"} description={categories} />
                            <Detail title={"Language"} description={language} />
                            <Detail title={"Ratings"} description={
                                <div className="flex items-center text-center">
                                    <Star size={16} className="fill-yellow-500 text-yellow-600 text-center mr-1"/>
                                    <div className="h-full text-center">{safeBook.ratingAvg}</div>
                                </div>
                            } />
                            <Detail title={"Description"} description={safeBook.description} />

                            <div className="w-full h-fit items-center justify-center flex flex-row">
                                <Button onClick={handleClick} disabled={loading}>
                                    {action === "start" && "Start Reading"}
                                    {action === "continue" && "Continue Reading"}
                                    {action === "reread" && "Re-Read"}
                                </Button>
                            </div>
                        </div>
                </div>
            </div>
            
            <div className={`${ openPopUp ? "pointer-events-auto" : "hidden"} fixed z-50 max-h-[calc(100%-56px)] align-middle mx-4 py-8 
                 bg-[var(--background)] justify-center shadow-md rounded-xl items-center overflow-auto scrollbar-auto border border-[var(--border)]`}>
                <div className={`align-middle w-full h-full justify-center items-center overflow-x-hidden overflow-y-auto scrollbar-auto`}>
                    <ReportCard />
                </div>
            </div>
            
        </div>

    );
}

export default BookDetails;
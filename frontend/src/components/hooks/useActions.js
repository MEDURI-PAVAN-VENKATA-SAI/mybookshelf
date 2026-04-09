import { useNavigate } from "react-router-dom";
import { useFavourites } from "../contexts/FavouritesContext";
import { useUploads } from "../contexts/UploadsContext";
import { useReadings } from "../contexts/ReadingsContext";
import { useReports } from "../contexts/ReportsContext";
import { useSelectedData } from "../contexts/SelectedDataContext";
import { downloadWithToast } from "../utils/Download";
import { 
    addToFavourites, removeFromFavourites, deleteReport, removeFromUploads, 
    startReading, updateReadingStatus, rereadBook, removeFromReadings
} from "@/api/books";

export function useActions() {

    const navigate = useNavigate();

    const { addFavourite, removeFavourite } = useFavourites();
    const { removeUpload } = useUploads();
    const { addReading, updateReading, removeReading } = useReadings();
    const { removeReport } = useReports();
    const { setSelectedBook, setOpenPopUp } = useSelectedData();

    //--------------------------------------------- common ---------------------------------------------

    const goToBookDetails = (book) => {navigate(`/app/book/${book.bookId}`, { state: { book: book }});};

    const goToBookReader = (book) => {navigate(`/reader/${book.bookId}`, { state: { book: book }});};

    const download = (book) => {downloadWithToast(book);};

    //------------------------------------------- favourites ---------------------------------------------

    const toggleFavourite = async (book, setIsFavourite) => {
        if(!book.bookId) return
        if(book.isFavourite){
            setIsFavourite(false);
            await removeFromFavourites(book.bookId);
            removeFavourite(book.bookId);
            setIsFavourite(false);
        }
        else {
            setIsFavourite(true);
            await addToFavourites(book.bookId);
            const updatedBook = {...book, isFavourite:true};
            addFavourite(updatedBook);
            setIsFavourite(true);
        }
    };


    //--------------------------------------------- uploads---------------------------------------------

    const removeTheUpload = async ({bookId, setLoading}) => {
        if(bookId){
            setLoading(true);
            await removeFromUploads(bookId);
            removeUpload(bookId);
            setLoading(false);
        }
    };


    //--------------------------------------------- readings---------------------------------------------

    const addTheReading = async (book) => {
        if(book.bookId){
            await startReading(book.bookId, book.totalPages);
            addReading(book);
            goToBookReader(book);
        }
    };

    const updateTheReading = async (book, currentPage) => {
        if(book.bookId){
            await updateReadingStatus(book.bookId, currentPage);
            updateReading(book);
        }
    };

    const removeTheReading = async ({bookId, setLoading}) => {
        if(bookId){
            setLoading(true);
            await removeFromReadings(bookId);
            removeReading(bookId);
            setLoading(false);
        }
    };

    const rereadTheBook = async (book) => {
        if(book.bookId){
            await rereadBook(book.bookId);
            updateReading(book);
            goToBookReader(book);
        }
    };


    //--------------------------------------------- reports---------------------------------------------

    const reportTheBook = async (book) => {
        setSelectedBook(book); 
        setOpenPopUp(true);
    };

    const removeTheReport = async ({reportId, setLoading}) => {
        if(reportId){
            setLoading(true);
            await deleteReport(reportId);
            removeReport(reportId);
            setLoading(false);
        }
    };

    return { 
        goToBookDetails, goToBookReader, toggleFavourite, download,
        addTheReading, updateTheReading, removeTheReading, rereadTheBook, 
        reportTheBook, removeTheReport, removeTheUpload
    };
};
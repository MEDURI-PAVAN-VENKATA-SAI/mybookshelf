import { refreshCategoriesBackendCache, refreshLanguagesBackendCache, refreshFoldersBackendCache, fetchFolders, deleteBook,
     approveBook, rejectBook, batchApprove, updateReportStatus } from "@/api/admin";
import { fetchCategories, fetchLanguages } from "@/api/config";


export function useAdminActions(){


    //------------------------------------------- config ---------------------------------------------

    const refreshTheCategoriesCache = async (toast, setLoading) => {
        setLoading(true);
        try {
            await refreshCategoriesBackendCache();
            const updated = await fetchCategories(); // get fresh data
            localStorage.setItem("categories", JSON.stringify(updated));
            toast.success("Categories updated");
        }
        catch (err) { toast.error("Failed to refresh categories"); }
        finally{ setLoading(false); }
    };

    const refreshTheLanguagesCache = async (toast, setLoading) => {
        setLoading(true);
        try {
            await refreshLanguagesBackendCache();
            const updated = await fetchLanguages(); // get fresh data
            localStorage.setItem("languages", JSON.stringify(updated));
            toast.success("Languages updated");
        }
        catch (err) { toast.error("Failed to refresh languages"); }
        finally{ setLoading(false); }
    };

    const refreshTheFoldersCache = async (toast, setLoading) => {
        setLoading(true);
        try {
            await refreshFoldersBackendCache();
            const updated = await fetchFolders(); // get fresh data
            toast.success("Folders updated");
        }
        catch (err) { toast.error("Failed to refresh folders"); }
        finally{ setLoading(false); }
    };


    //------------------------------------------- Edit Book ---------------------------------------------

    const deleteTheBook = async ({bookId, reason, setLoading}) => {
        if(bookId){
            setLoading(true);
            await deleteBook(bookId, reason);
            setLoading(false);
        }
    };


    //------------------------------------------- Uploads ---------------------------------------------

    const approveTheBook = async ({bookId, editedBook, reason, setLoading}) => {
        if(bookId){
            setLoading(true);
            await approveBook(bookId, editedBook, reason);
            setLoading(false);
        }
    };

    const rejectTheBook = async ({bookId, reason, setLoading}) => {
        if(bookId){
            setLoading(true);
            await rejectBook(bookId, reason);
            setLoading(false);
        }
    };

    const batchApproveTheBooks = async ({books, toast, setLoading}) => {
        setLoading(true);
        try { 
            await batchApprove(books); 
            toast.success("Approved all books")
        }
        catch (err) { toast.error("Failed to approve all books"); }
        finally{ setLoading(false); }
    };


    //------------------------------------------- Reports ---------------------------------------------

    const updateTheReportStatus = async ({reportId, status, reason, setLoading}) => {
        if(reportId){
            setLoading(true);
            await updateReportStatus(reportId, status, reason);
            setLoading(false);
        }
    };

    return { refreshTheCategoriesCache, refreshTheLanguagesCache, refreshTheFoldersCache, deleteTheBook,
        approveTheBook, rejectTheBook, batchApproveTheBooks, updateTheReportStatus
     };
};
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchUploads, editBook } from "../../api/books";
import UploadBookCard from "../utils/UploadBookCard";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Button from "../utils/Button";
import { Upload } from "lucide-react";
import UploadBook from "../utils/UploadBook";
import { useUploads } from "../contexts/UploadsContext";
import { toast } from "react-toastify";
import { useSelectedData } from "../contexts/SelectedDataContext";
import ReportCard from "../utils/ReportCard";
import { useNavbar } from "../contexts/NavbarContext";
import CommonBookSkeleton from "../utils/CommonBookSkeleton";

const book5 = {
    bookId:5,
    title: "Upload - pending book",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    uploadStatus: {
      bookId: 5,
      status: "pending",
      reason: "we will look into it very soon",
      createdAt: null
    }
};

const book6 = {
    bookId:6,
    title: "Upload - reviewing book",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    uploadStatus: {
      bookId: 6,
      status: "in_review",
      reason: "under review",
      createdAt: null
    }
};

const book7 = {
    bookId:7,
    title: "Upload - published book",
    authors:["Athul", "Abhi"],
    coverUrl:'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400',
    ratingAvg:4.5,
    uploadStatus: {
      bookId: 7,
      status: "published",
      reason: "category changed",
      createdAt: null
    }
};

const book8 = {
    bookId:8,
    title: "Upload - rejected book",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    uploadStatus: {
      bookId: 8,
      status: "rejected",
      reason: "empty book",
      createdAt: null
    }
};

const book9 = {
    bookId: 9,
    title: "",
    authors:[],
    uploadStatus: {
      bookId: 9,
      title:  "Upload - deleted book by admin",
      authors:["Athul", "Abhi"],
      status: "removed",
      reason: "empty book",
      createdAt: null
    }
};


function EditBook({ book }) {

  const [form, setForm] = useState(book);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async () => {
    try {
      const res = await editBook(book.bookId, form);
      if (res.requiresApproval) { toast.success("Changes submitted for approval"); }
      else { toast.success("Updated successfully"); }
    }
    catch (e) {
      toast.error("Error updating");
    }
  };

  return (
    <div>
      <input name="title" value={form.title} onChange={handleChange} />
      <input name="ISBN" value={form.ISBN} onChange={handleChange} />
      <input name="authors" value={form.authors?.join(",")} onChange={handleChange} />
      <input name="publisher" value={form.publisher} onChange={handleChange} />
      <input name="publishedYear" value={form.publishedYear} onChange={handleChange} />

      <select name="privacy" value={form.privacy} onChange={handleChange}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <button onClick={handleSubmit}>Update</button>
    </div>
  );
}

export default function Uploads() {
  const { uploads, setUploads, uploadsLoaded, setUploadsLoaded } = useUploads();
  const { openPopUp } = useSelectedData();
  const { openNav } = useNavbar();

  const [cursor, setCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isUpload, setIsUpload] = useState(false);
  
  const loadMoreRef = useRef(null);
  const scrollRef = useRef(null);

  const loadInitial = async () => {
    if (uploadsLoaded) return;
    setInitialLoading(true);
    const data = await fetchUploads(null);
    setUploads(data.books);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setUploadsLoaded(true);
    setInitialLoading(false);
  };

  const loadMoreUploads = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await fetchUploads(cursor);
    setUploads(prev => [...prev, ...data.books]);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoadingMore(false);
  }, [cursor, hasMore, loadingMore, setUploads]);

  useEffect(() => { loadInitial(); }, []);

  useInfiniteScroll({ targetRef: loadMoreRef, onLoadMore: loadMoreUploads, hasMore, loading: loadingMore, disabled: initialLoading });

  return (
    <div className={`${ (openPopUp || isUpload) ? "pointer-events-none" : "" } relative w-full h-full items-center flex flex-col justify-center 
            overflow-hidden bg-[image:var(--ph-bg)] sm:bg-[image:var(--pc-bg)] bg-cover bg-right-bottom bg-no-repeat transition duration-300`}>
              
      <div className={`${ (openPopUp || isUpload) ? "pointer-events-none blur-xl select-none" : ""} z-10 w-full h-11 items-center flex flex-row justify-between`}>
        <h2 className="text-xl text-white font-bold w-fit px-6 py-2 bg-[url('/wood-bg.jpg')] 
              bg-cover bg-repeat-y rounded-r-full">My Uploads
        </h2>
        { ( uploads.length > 0 && !isUpload ) && 
          (<Button variant="primary" className="flex flex-row text-center text-sm ml-2 mr-4 cursor-pointer" onClick={()=>setIsUpload(true)}> 
              <Upload size={20} className="mr-2"/> Upload
          </Button>
        )}
      </div>
        
      <div className={`${ (openPopUp || isUpload) ? "pointer-events-none blur-xl select-none" : ""} w-full h-[calc(100%-44px)] pt-8 flex 
            flex-col justify-center overflow-hidden`}>
            
        <div ref={scrollRef} className={`w-full h-full relative px-4 overflow-x-hidden overflow-y-auto scrollbar-auto`}>
            
          <div className={`grid grid-cols-1 ${ openNav ? "lg:grid-cols-2":"md:grid-cols-2 xl:grid-cols-3"} 2xl:grid-cols-3 gap-4`} ref={scrollRef}>
    
            {initialLoading && Array.from({ length: 8 }).map((_, i) => ( <CommonBookSkeleton key={i} type={"upload"} /> ))}
    
            {!initialLoading && uploads.map(book => ( <UploadBookCard key={book.bookId} book={book} scrollRef={scrollRef} /> ))}
              
            <UploadBookCard key={book5.bookId} book={book5} scrollRef={scrollRef} />
            <UploadBookCard key={book6.bookId} book={book6} scrollRef={scrollRef} />
            <UploadBookCard key={book7.bookId} book={book7} scrollRef={scrollRef} />
            <UploadBookCard key={book8.bookId} book={book8} scrollRef={scrollRef} />
            <UploadBookCard key={book9.bookId} book={book9} scrollRef={scrollRef} />

            {loadingMore && Array.from({ length: 4 }).map((_, i) => ( <CommonBookSkeleton key={`more-${i}`} type={"upload"} /> ))}
    
          </div>
        
          {!initialLoading && uploads.length === 0 && (
            <div className="text-center py-16 flex flex-col justify-center items-center">
              <p className="text-lg opacity-70">No Uploads yet 📚</p>
              <Button variant="primary" className="flex flex-row text-center my-4 cursor-pointer" onClick={()=>setIsUpload(true)}> 
                <Upload size={20} className="mr-2"/> Upload
              </Button>
            </div>
          )}
    
          {/* SENTINEL */}
          <div ref={loadMoreRef} className="h-10" />
    
        </div>
    
      </div>
        
      <div className={`${ (openPopUp || isUpload) ? "pointer-events-auto" : "hidden"} fixed z-50 max-h-[calc(100%-56px)] align-middle mx-4 py-8 
                 bg-[var(--background)] justify-center shadow-md rounded-xl items-center overflow-auto scrollbar-auto`}>
        <div className={`align-middle w-full h-full justify-center items-center overflow-x-hidden overflow-y-auto scrollbar-auto`}>
            { isUpload && <UploadBook isUpload={isUpload} setIsUpload={setIsUpload}/> }
            { openPopUp && <ReportCard /> }
        </div>
      </div>

    </div>
  );
}
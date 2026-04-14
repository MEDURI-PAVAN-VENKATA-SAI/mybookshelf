import { useEffect, useRef, useState, useCallback } from "react";
import { fetchReadings } from "../../api/books";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import ReadingBookCard from "../utils/ReadingBookCard";
import { useNavbar } from "../contexts/NavbarContext";
import { useReadings } from "../contexts/ReadingsContext";
import { useSelectedData } from "../contexts/SelectedDataContext";
import ReportCard from "../utils/ReportCard";
import CommonBookSkeleton from "../utils/CommonBookSkeleton";

const book1 = {
    bookId:1,
    title: "User reading first timeUser reading first time",
    authors:["Athul", "Abhi"],
    coverUrl:'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400',
    ratingAvg:4.5,
    readingStatus:{
      currentPage:30,
      totalPages:100,
      status:"Reading",
      repetitionCount:0
    }
};

const book2 = {
    bookId:2,
    title: "User completed first time",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    readingStatus:{
      currentPage:100,
      totalPages:100,
      status:"completed",
      repetitionCount:1
    }
};

const book3 = {
    bookId:3,
    title: "User reading second time",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    readingStatus:{
      currentPage:25,
      totalPages:100,
      status:"Reading",
      repetitionCount:1
    }
};

const book4 = {
    bookId:4,
    title: "User completed second time",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    readingStatus:{
      currentPage:100,
      totalPages:100,
      status:"completed",
      repetitionCount:2
    }
};

export default function Readings() {
  const { readings, setReadings, readingsLoaded, setReadingsLoaded } = useReadings();
  const { openPopUp } = useSelectedData();
  const { openNav } = useNavbar();

  const [showFilter, setShowFilter] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);
  const scrollRef = useRef(null);

  const loadInitial = async () => {
    if (readingsLoaded) return;
    setInitialLoading(true);
    const data = await fetchReadings(null);
    setReadings(data.books); 
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setReadingsLoaded(true);
    setInitialLoading(false);
  };

  const loadMoreReadings = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await fetchReadings(cursor);
    setReadings(prev => [...prev, ...data.books]);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoadingMore(false);
  }, [cursor, hasMore, loadingMore, setReadings]);

  useEffect(() => { loadInitial(); }, []);

  useInfiniteScroll({ targetRef: loadMoreRef, onLoadMore: loadMoreReadings, hasMore, loading: loadingMore, disabled: initialLoading });

  useEffect(() => {
    if (!showFilter) return;
    const handleOutsideClick = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) { setShowFilter(false); } };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick); 
  }, [showFilter]);
  
  return (
    <div className={`${ openPopUp ? "pointer-events-none" : "" } relative w-full h-full items-center flex flex-col justify-center overflow-hidden
          bg-[image:var(--ph-bg)] sm:bg-[image:var(--pc-bg)] bg-cover bg-right-bottom bg-no-repeat transition duration-300`}>
          
      <div className={`${openPopUp ? "pointer-events-none blur-xl select-none" : ""} z-10 w-full h-11 items-center flex flex-row justify-between`}>
          <h2 className="text-xl text-white font-bold w-fit px-6 py-2 bg-[url('/wood-bg.jpg')] 
                bg-cover bg-repeat-y rounded-r-full">My Readings
          </h2>
      </div>
    
      <div className={`${ openPopUp ? "pointer-events-none blur-xl select-none" : ""} w-full h-[calc(100%-44px)] pt-8 flex flex-col justify-center overflow-hidden`}>
        
        <div ref={scrollRef} className={`w-full h-full relative px-4 overflow-x-hidden overflow-y-auto scrollbar-auto`}>
        
          <div className={`grid grid-cols-1 ${ openNav ? "lg:grid-cols-2":"md:grid-cols-2 xl:grid-cols-3"} 2xl:grid-cols-3 gap-4`} ref={scrollRef}>

            {initialLoading && Array.from({ length: 8 }).map((_, i) => ( <CommonBookSkeleton key={i} /> ))}

            {!initialLoading && readings.map(book => ( <ReadingBookCard key={book.bookId} book={book} scrollRef={scrollRef} /> ))}

            <ReadingBookCard key={book1.bookId} book={book1} scrollRef={scrollRef}/>
            <ReadingBookCard key={book2.bookId} book={book2} scrollRef={scrollRef}/>
            <ReadingBookCard key={book3.bookId} book={book3} scrollRef={scrollRef}/>
            <ReadingBookCard key={book4.bookId} book={book4} scrollRef={scrollRef}/>

            {loadingMore && Array.from({ length: 4 }).map((_, i) => ( <CommonBookSkeleton key={`more-${i}`} /> ))}

          </div>
    
          {!initialLoading && readings.length === 0 && (
            <div className="text-center py-16 w-full h-full">
              <p className="text-lg">No Readings yet 📚</p>
              <p className="text-sm mt-1">Start reading a book</p>
            </div>
          )}

          {/* SENTINEL */}
          <div ref={loadMoreRef} className="h-10" />

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
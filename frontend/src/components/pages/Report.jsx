import React, { useState, useRef, useEffect, useCallback } from "react";
import { useReports } from "../contexts/ReportsContext";
import ReportStatusCard from "../utils/ReportStatusCard";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { fetchMyReports } from "@/api/books";
import ReportCard from "../utils/ReportCard";
import { useNavbar } from "../contexts/NavbarContext";
import { useSelectedData } from "../contexts/SelectedDataContext";
import CommonBookSkeleton from "../utils/CommonBookSkeleton";

const book9 = {
    bookId:9,
    title: "Pending Report",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    reportStatus:{
      reportId: 1,
      reporterId: "123",
      targetId: 9,
      issues: [ "Broken file", "Copy right", "Wrong content", "Wrong information", "others" ],
      details: "nothing",
      status: "pending", 
      reason: "sorry for the delay",
      createdAt: null
    }
};

const book10 = {
    bookId:10,
    title: "Reviewing Report",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    reportStatus:{
      reportId: 2,
      reporterId: "123",
      targetId: 10,
      issues: [ "Broken file", "Copy right", "others" ],
      details: "nothing",
      status: "in_review",
      reason: "under review",
      createdAt: null
    }
};

const book11 = {
    bookId:11,
    title: "Resolved Report",
    authors:["Athul", "Abhi"],
    coverUrl:'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400',
    ratingAvg:4.5,
    reportStatus:{
      reportId: 3,
      reporterId: "123",
      targetId: 11,
      issues: [ "Wrong content", "Wrong information", "others" ],
      details: "nothing",
      status: "resolved",
      reason: "we resolved the issues",
      createdAt: null
    }
};

const book12 = {
    bookId:12,
    title: "Rejected Report",
    authors:["Athul", "Abhi"],
    coverUrl:"",
    ratingAvg:4.5,
    reportStatus:{
      reportId: 4,
      reporterId: "123",
      targetId: 12,
      issues: ["others"],
      details: "nothing",
      status: "rejected",
      reason: "invalid report invalid report invalid report invalid report invalid report invalid report invalid report invalid report",
      createdAt: null
    }
};

const book13 = {
    bookId:13,
    reportStatus:{
      reportId: 5,
      reporterId: "123",
      targetId: 12,
      title: "Deleted book Report",
      authors:["Athul", "Abhi"],
      issues: ["others"],
      details: "",
      status: "resolved",
      reason: "book deleted",
      createdAt: null
    }
};


export default function Report(){

  const { reports, setReports, reportsLoaded, setReportsLoaded } = useReports();
  const { openNav } = useNavbar();
  const { openPopUp } = useSelectedData();

  const [cursor, setCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMoreRef = useRef(null);
  const scrollRef = useRef(null);

  const loadInitial = async () => {
    if (reportsLoaded) return;
    setInitialLoading(true);
    const data = await fetchMyReports(null);
    setReports(data.books);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setReportsLoaded(true);
    setInitialLoading(false);
  };

  const loadMoreReports = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await fetchMyReports(cursor);
    setReports(prev => [...prev, ...data.books]);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoadingMore(false);
  }, [cursor, hasMore, loadingMore, setReports]);

  useEffect(() => { loadInitial(); }, []);

  useInfiniteScroll({ targetRef: loadMoreRef, onLoadMore: loadMoreReports, hasMore, loading: loadingMore, disabled: initialLoading });

  return (
    <div className={`${ openPopUp ? "pointer-events-none" : "" } relative w-full h-full items-center flex flex-col justify-center overflow-hidden
              bg-[image:var(--ph-bg)] sm:bg-[image:var(--pc-bg)] bg-cover bg-right-bottom bg-no-repeat transition duration-300`}>

      <div className={`${openPopUp ? "pointer-events-none blur-xl select-none" : ""} z-10 w-full h-11 items-center flex flex-row justify-between`}>
          <h2 className="text-xl text-white font-bold w-fit px-6 py-2 bg-[url('/wood-bg.jpg')] 
                bg-cover bg-repeat-y rounded-r-full">Reported Issues
          </h2>
      </div>

      <div className={`${ openPopUp ? "pointer-events-none blur-xl select-none" : ""} w-full h-[calc(100%-44px)] pt-8 flex flex-col justify-center overflow-hidden`}>

        <div ref={scrollRef} className={`w-full h-full relative px-4 overflow-x-hidden overflow-y-auto scrollbar-auto`}>

          <div className={`grid grid-cols-1 ${ openNav ? "lg:grid-cols-2":"md:grid-cols-2 xl:grid-cols-3"} 2xl:grid-cols-3 gap-4`} ref={scrollRef}>

            {initialLoading && Array.from({ length: 8 }).map((_, i) => ( <CommonBookSkeleton key={i} type={"report"} /> ))}

            {!initialLoading && reports.map(book => ( <ReportStatusCard key={book.reportStatus.reportId} book={book} scrollRef={scrollRef} />))}

            <ReportStatusCard key={book9.reportStatus.reportId} book={book9} scrollRef={scrollRef} />
            <ReportStatusCard key={book10.reportStatus.reportId} book={book10} scrollRef={scrollRef} />
            <ReportStatusCard key={book11.reportStatus.reportId} book={book11} scrollRef={scrollRef} />
            <ReportStatusCard key={book12.reportStatus.reportId} book={book12} scrollRef={scrollRef} />
            <ReportStatusCard key={book13.reportStatus.reportId} book={book13} scrollRef={scrollRef} />

            {loadingMore && Array.from({ length: 4 }).map((_, i) => ( <CommonBookSkeleton key={`more-${i}`} type={"report"} /> ))}

          </div>

          {!initialLoading && reports.length === 0 && (
            <div className="text-center py-16 flex flex-col justify-center items-center">
              <p className="text-lg opacity-70">In MyBookShelf, We provide the best to users 📚</p>
            </div>
          )}

          {/* SENTINEL */}
          <div ref={loadMoreRef} className="h-10" />
    
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
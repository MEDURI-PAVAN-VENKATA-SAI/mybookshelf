import React, { useRef, useState, useCallback, useEffect } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import BookCard from '../../components/utils/BookCard';
import TabCarousel from "../utils/TabCarousel";
import { useCategories } from "../contexts/CategoriesContext";
import { useHomeBooks } from "../contexts/HomeContext";
import { fetchHomeBooks } from "@/api/books";
import BookSkeleton from "../utils/BookSkeleton";
import ReportCard from "../utils/ReportCard";
import { useSelectedData } from "../contexts/SelectedDataContext";

const allBooks = [
    {
        bookId: '1',
        title: 'The Midnight Library The Midnight Library',
        authors: ['Matt Haig', 'APJ Abdul Kalam'],
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.5,
        categories: ['FIC', 'FAIRY'],
        language: "en",
        isFavourite: true
    },
    {
        bookId: '2',
        title: 'Atomic Habits',
        authors: ['James Clear'],
        coverUrl: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.8,
        categories: ['REL'],
        language: "en",
        isFavourite: true
    },
    {
        bookId: '3',
        title: 'Project Hail Mary',
        authors: ['Andy Weir'],
        coverUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.7,
        categories: ['Science'],
        isFavourite: false
    },
    {
        bookId: '4',
        title: 'The Silent Patient',
        authors: ['Alex Michaelides'],
        coverUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.3,
        categories: ['Mystery'],
        isFavourite: false
    },
    {
        bookId: '5',
        title: 'Dune',
        authors: ['Frank Herbert'],
        coverUrl: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.6,
        categories: ['Fantasy'],
        isFavourite: true
    },
    {
        bookId: '6',
        title: 'The Martian',
        authors: ['Andy Weir'],
        coverUrl: 'https://images.pexels.com/photos/267586/pexels-photo-267586.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.5,
        categories: ['Science'],
        isFavourite: false
    },
    {
        bookId: '7',
        title: '1984',
        authors: ['George Orwell'],
        coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.7,
        categories: ['Fiction'],
        isFavourite: true
    },
    {
        bookId: '8',
        title: 'SAMSUNGSAMSUNGSAMSUNG',
        authors: ['Yuval Noah Harari'],
        coverUrl: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.6,
        categories: ['NNNNNNNNNNNNNNNNNNN']
    },
    {
        bookId: '9',
        title: 'Steve Jobs',
        authors: ['Walter Isaacson'],
        coverUrl: 'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.4,
        categories: ['Biography']
    },
    {
        bookId: '10',
        title: 'The Hobbit',
        authors: ['J.R.R. Tolkien'],
        coverUrl: 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.8,
        categories: ['Religion & Spirituality']
    },
    {
        bookId: '11',
        title: 'Gone Girl',
        authors: ['Gillian Flynn'],
        coverUrl: 'https://images.pexels.com/photos/1261180/pexels-photo-1261180.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.2,
        categories: ['Health & Lifestyle']
    },
    {
        bookId: '12',
        title: 'Educated',
        authors: ['Tara Westover'],
        coverUrl: 'https://images.pexels.com/photos/1560424/pexels-photo-1560424.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.7,
        categories: ['Research & References']
    },
    {
        bookId: '13',
        title: 'Educated',
        authors: ['Tara Westover'],
        coverUrl: '',
        ratingAvg: 4.7,
        categories: ['Research & References']
    }
];

const cats = [ { id:"all", title:"All" }, { id:"Fiction", title:"Fiction" }, { id:"Non-Fiction", title:"Non-Fiction" },
    { id:"Science", title:"Science" }, { id:"Biography", title:"Biography" }, { id:"Fantasy", title:"Fantasy" },
    { id:"Mystery", title:"Mystery" }, { id:"Myst", title:"Myst" } ]; 

const subcategories = cats;


function Home(){
  const { homeBooks, setHomeBooks, homeBooksLoaded, setHomeBooksLoaded } = useHomeBooks();
  const { openPopUp } = useSelectedData();

  const [cursor, setCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  
  const loadMoreRef = useRef(null);
  const scrollRef = useRef(null);

  const loadInitial = async () => {
    if (homeBooksLoaded) return;
    setInitialLoading(true);
    const data = await fetchHomeBooks(null);
    setHomeBooks(data.books);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setHomeBooksLoaded(true);
    setInitialLoading(false);
  };

  const loadMoreHomeBooks = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await fetchHomeBooks(cursor);
    setHomeBooks(prev => [...prev, ...data.books]);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoadingMore(false);
  }, [cursor, hasMore, loadingMore, setHomeBooks]);

  useEffect(() => { loadInitial(); }, []);

  useInfiniteScroll({ targetRef: loadMoreRef, onLoadMore: loadMoreHomeBooks, hasMore, loading: loadingMore, disabled: initialLoading });


  
  const { categories } = useCategories();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');

  const filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              book.authors.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || book.categories.find((cat)=> cat === selectedCategory);
        return matchesSearch && matchesCategory;
  });

  return (
    <div className={`${ openPopUp ? "pointer-events-none" : "" } relative w-full h-full items-center flex flex-col justify-center overflow-hidden`}>

        <div className={`${ openPopUp ? "pointer-events-none blur-xl select-none" : ""} w-full h-full flex flex-col justify-center overflow-hidden`}>

            <TabCarousel tabs={cats} selectedTab={selectedCategory} setSelectedTab={setSelectedCategory} 
                        rounded className="w-full h-10 px-0 py-2 z-30 shadow-md bg-[var(--background)]" />

            <div ref={scrollRef} className={`w-full h-[calc(100%-40px)] relative bg-[var(--secondary)] px-1 min-[364px]:px-4 py-8 overflow-x-hidden 
                overflow-y-auto scrollbar-auto`}>

                <div ref={scrollRef} className="w-full flex flex-col">
                
                    <div className="mb-8 max-[364px]:mx-4">
                        <h1 className="text-3xl font-bold text-[var(--text)] mb-2"> Browse All Books </h1>
                        <p className="text-[var(--muted-text)]"> Discover your next favourite read from our collection </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 min-[578px]:gap-6">

                        {initialLoading && Array.from({ length: 8 }).map((_, i) => ( <BookSkeleton key={i} /> ))}

                        {!initialLoading && homeBooks.map(book=>(<BookCard key={book.bookId} book={book} scrollRef={scrollRef} showActions />))}

                        {filteredBooks.map(book => ( 
                            <BookCard key={book.bookId} book={book} scrollRef={scrollRef} showActions secondaryCategory />
                        ))}

                        {loadingMore && Array.from({ length: 4 }).map((_, i) => ( <BookSkeleton key={`more-${i}`} /> ))}

                    </div>

                    {!initialLoading && homeBooks.length === 0 && (
                        <div className="text-center py-16 flex flex-col justify-center items-center">
                            <p className="text-lg opacity-70">No Books Added yet 📚</p>
                        </div>
                    )}
                    
                    {/* SENTINEL */}
                    <div ref={loadMoreRef} className="h-10" />

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

export default Home;
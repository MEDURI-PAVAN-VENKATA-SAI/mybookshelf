import { useEffect, useRef, useState, useCallback } from "react";
import { fetchFavouriteBooks } from "../../api/books";
import BookCard from "../utils/BookCard";
import BookSkeleton from "../utils/BookSkeleton";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useFavourites } from "../contexts/FavouritesContext";
import { useSelectedData } from "../contexts/SelectedDataContext";
import ReportCard from "../utils/ReportCard";

const allBooks = [
    {
        bookId: '1',
        title: 'The Midnight Library The Midnight Library',
        authors: ['Matt Haig', 'APJ Abdul Kalam'],
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.5,
        categories: ['Fiction', 'Fairy tales'],
        isFavourite: true
    },
    {
        bookId: '2',
        title: 'Atomic Habits',
        authors: ['James Clear'],
        coverUrl: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.8,
        categories: ['Non-Fiction'],
        isFavourite: true
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
        bookId: '7',
        title: '1984',
        authors: ['George Orwell'],
        coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400',
        ratingAvg: 4.7,
        categories: ['Fiction'],
        isFavourite: true
    },
];

export default function Favourites() {
  const { favourites, setFavourites, favouritesLoaded, setFavouritesLoaded } = useFavourites();
  const { openPopUp } = useSelectedData();

  const [cursor, setCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);
  const scrollRef = useRef(null);

  const loadInitial = async () => {
    if (favouritesLoaded) return;
    setInitialLoading(true);
    const data = await fetchFavouriteBooks(null);
    setFavourites(data.books);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setFavouritesLoaded(true);
    setInitialLoading(false);
  };

  const loadMoreFavourites = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await fetchFavouriteBooks(cursor);
    setFavourites(prev => [...prev, ...data.books]);
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoadingMore(false);
  }, [cursor, hasMore, loadingMore, setFavourites]);

  useEffect(() => { loadInitial(); }, []);

  useInfiniteScroll({ targetRef: loadMoreRef, onLoadMore: loadMoreFavourites, hasMore, loading: loadingMore, disabled: initialLoading });

  return (
    <div className={`${ openPopUp ? "pointer-events-none" : "" } relative w-full h-full items-center flex flex-col justify-center overflow-hidden`}>
      
      <div className={`${openPopUp ? "pointer-events-none blur-xl select-none" : ""} z-10 w-full h-11 items-center flex flex-row justify-between`}>
          <h2 className="text-xl text-white font-bold w-fit px-6 py-2 bg-[url('/wood-bg.jpg')] 
                bg-cover bg-repeat-y rounded-r-full">My Favourites
          </h2>
      </div>

      <div className={`${ openPopUp ? "pointer-events-none blur-xl select-none" : ""} w-full h-[calc(100%-44px)] pt-8 flex flex-col justify-center overflow-hidden`}>
    
        <div ref={scrollRef} className={`w-full h-full relative bg-[var(--secondary)] px-1 min-[364px]:px-4 overflow-x-hidden 
              overflow-y-auto scrollbar-auto`}>
    
          <div className="flex flex-wrap justify-center gap-3 min-[578px]:gap-6">
    
              {initialLoading && Array.from({ length: 8 }).map((_, i) => ( <BookSkeleton key={i} /> ))}
    
              {!initialLoading && favourites.map(book => ( <BookCard key={book.bookId} book={book} scrollRef={scrollRef} showActions /> ))}

              {loadingMore && Array.from({ length: 4 }).map((_, i) => ( <BookSkeleton key={`more-${i}`} /> ))}

          </div>

          {!initialLoading && favourites.length === 0 && (
            <div className="text-center py-16 opacity-70">
              <p className="text-lg">No favourite books yet 📚</p>
              <p className="text-sm mt-1">Tap ❤️ on books to add them</p>
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
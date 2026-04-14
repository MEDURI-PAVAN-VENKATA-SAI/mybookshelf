import { useState, useEffect } from "react";
import { rateBook, getUserRating } from "@/api/books";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

export default function StarRating({ bookId, title, className='' }) {

  const [rating, setRating] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0); 

  // Fetch initial rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await getUserRating(bookId);
        setRating(res);
      } 
      catch (err) {
        console.error(err);
      }
    };
    fetchRating();
  }, [bookId]);

  const handleRating = async (value) => {
    try {
      setLoading(true);
      await rateBook(bookId, value);
      setRating(value);
      toast.success("Successfully Rated "+title);
    }
    catch (err) {
      toast.error("Something went wrong! try again");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${loading ? "pointer-events-none" : "" } relative h-fit flex gap-1 items-center ${className} rounded bg-black border-t border-[var(--border)]`}>
      {loading && <div className="absolute top-0 z-50 w-full h-full flex items-center text-center justify-center">
          <LoaderCircle size={30} className="text-[var(--accent)] animate-spin"/>
      </div>}

      <div className={`${loading ? "pointer-events-none blur-xs" : "" } w-full h-fit p-2 flex flex-row gap-3 items-center text-center justify-center`}
        onMouseLeave={() => setHover(0)}
      >
        <div className="text-[16px] text-yellow-500 text-center">{(rating === 0) ? "Rate this" : "Your Rating"}</div>
        <div className="w-fit h-fit flex flex-col items-center justify-center">
          <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => {
            const current = hover || rating;   // KEY LOGIC
            return (
              <span
                key={star}
                className={`text-3xl transition ${ star <= current ? "text-yellow-500" : "text-white"} 
                          ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onMouseEnter={() => setHover(star)}   // ⭐ hover effect
                onClick={() => !loading && handleRating(star)}
              >
                ★
              </span>
            );
          })}
          </div>
          <div className="w-full h-fit flex items-center justify-between text-[var(--muted-text)]">
            <div className="text-[12px]">Poor</div>
            <div className="text-[12px]">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
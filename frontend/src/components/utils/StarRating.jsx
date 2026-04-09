import { useState } from "react";
import { rateBook } from "@/api/books";
import { toast } from "react-toastify";

export default function StarRating({ bookId, title, initialRating = 0, className='' }) {
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);

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
    <div className={`w-fit flex gap-1 cursor-pointer ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span className={`text-3xl ${star <= rating ? "text-yellow-500" : "text-[var(--border)]"}`} key={star} 
                onClick={() => handleRating(star)}>
          ★
        </span>
      ))}
    </div>
  );
}
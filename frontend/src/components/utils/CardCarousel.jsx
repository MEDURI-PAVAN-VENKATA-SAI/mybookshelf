import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "./BookCard";

export default function CardCarousel({ title, books, onClick, className="", showActions = true }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -carouselRef.current.clientWidth : carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className={`relative w-full h-fit ${className}`}>
      <div className="flex items-center justify-between mb-5 px-4">
        <h2 className="text-2xl font-bold text-[var(--text)] ml-2">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--hover)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--hover)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 px-4"
      >
        {books.map((book) => (
          <div key={book.id} className="flex-none w-fit p-1">
            <BookCard
              key={book.id}
              book={book}
              onClick={onClick}
              onRemove={()=>{}}
              showActions={showActions}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

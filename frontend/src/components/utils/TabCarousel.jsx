import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TabCarousel({ tabs, selectedTab, setSelectedTab, className = "", rounded=false,
    primaryStyle="bg-[var(--accent)] text-white", normalStyle="bg-[var(--border)] text-[var(--text)] hover:bg-[var(--hover)]" }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight( el.scrollLeft + el.clientWidth < el.scrollWidth - 1 );
  };

  const scroll = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = direction === "left" ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollButtons();
    const el = carouselRef.current;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <section className={`max-w-full h-fit flex items-center ${className}`}>
      
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 h-10 px-2 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--hover)] cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div
        ref={carouselRef}
        className="flex mx-2.5 gap-3 overflow-x-auto scroll-smooth scrollbar-hide whitespace-nowrap"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`h-9 px-4 text-sm font-medium shrink-0 transition-all duration-200 cursor-pointer
                ${ rounded ? "rounded-full" : "rounded" }
                ${ selectedTab === tab.id ? primaryStyle : normalStyle }`}
          >
            <div className={`flex items-center font-medium`}>
                <div className={`${tab.icon ? "mr-2" : "hidden" }`}>{tab.icon ? tab.icon : ""}</div>
                <div className="shrink-0">{tab.title}</div>
            </div>
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 h-10 px-2 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--hover)] cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </section>
  );
}

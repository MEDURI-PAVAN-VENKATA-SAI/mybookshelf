import { useEffect, useRef } from "react";

export default function useInfiniteScroll({ targetRef, onLoadMore, hasMore, loading, disabled = false }) {
  const observerRef = useRef(null);

  useEffect(() => {
    if (disabled || loading || !hasMore || !targetRef?.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" } // prefetch before reaching bottom
    );

    observerRef.current.observe(targetRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, loading, disabled, onLoadMore, targetRef]);
}

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TopLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  useEffect(() => {
    // Reset progress and ensure transitions are active
    setProgress(0);
    setOpacity(1);
    setTransitionEnabled(true);

    // Animate to 80%
    const start = setTimeout(() => setProgress(50), 50);

    // Animate to 100%
    const finish = setTimeout(() => setProgress(100), 500);

    // Fade out
    const fadeOut = setTimeout(() => setOpacity(0), 800);

    // Disable transition and reset progress after fade-out
    const reset = setTimeout(() => {
      setTransitionEnabled(false); // disable transition
      setProgress(0); // instant reset
      setOpacity(1); // ready for next load
    }, 1100);

    return () => {
      clearTimeout(start);
      clearTimeout(finish);
      clearTimeout(fadeOut);
      clearTimeout(reset);
    };
  }, [location]);

  return (
    <div className="fixed top-0 left-0 w-[100dvw] h-[3px] z-[999] bg-[var(--background)] overflow-hidden">
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          backgroundColor: "var(--accent)",
          opacity,
          transition: transitionEnabled
            ? "width 0.3s ease, opacity 0.3s ease"
            : "none",
        }}
      ></div>
    </div>
  );
}

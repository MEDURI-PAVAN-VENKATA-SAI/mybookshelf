import { useState, useRef, useEffect } from "react";

export default function ReadMore({ text = "", maxLines = 1, className="" }) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setShowToggle(el.scrollHeight > el.clientHeight); // check overflow
  }, [text, maxLines]);

  return (
    <div className={`text-sm flex ${className}`}>
      <p ref={textRef} className="text-sm overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : maxLines,
          WebkitBoxOrient: "vertical"
        }}
      >
        {text}
      </p>

      {showToggle && (
        <button onClick={() => setExpanded((prev) => !prev)} className="text-blue-500 text-sm shrink-0" >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
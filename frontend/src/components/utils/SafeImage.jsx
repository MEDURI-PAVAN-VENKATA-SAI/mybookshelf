import React, { useState } from "react";

const SafeImage = ({
  src,
  alt = "",
  className = "",
  fallback = "/no-image.svg",
  loadingPlaceholder = null
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallback); // Use fallback image
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      { isLoading && ( loadingPlaceholder || ( <div className="absolute inset-0 bg-[var(--ring)] animate-pulse" /> )) }
      <img
        src={(imgSrc === '' || imgSrc === null) ? fallback : imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full transition-opacity duration-300 ${ isLoading ? "opacity-0" : "opacity-100" }`}
        loading="lazy"
      />
    </div>
  );
};

export default SafeImage;

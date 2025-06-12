"use client";

import {useState, useEffect} from 'react';

interface ImageCarouselProps {
  images: string[];
  altText: string;
  baseUrl: string;
}

export default function ImageCarousel({images, altText, baseUrl}: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Image carousel navigation functions
  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    // Only set up auto-advance if there are multiple images and not paused
    if (images && images.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        nextImage();
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval); // Clean up on unmount
    }
  }, [images, isPaused]); // Re-run effect if images or pause state changes

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events when carousel is focused/hovered
      if (isPaused && images && images.length > 1) {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused, images]);

  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50; // Minimum distance for a swipe

    if (isSwipe && images && images.length > 1) {
      if (distance > 0) {
        // Swipe left, go to next image
        nextImage();
      } else {
        // Swipe right, go to previous image
        prevImage();
      }
    }

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Open fullscreen image view
  const openFullscreen = (image: string) => {
    // Find the index of the clicked image to sync the carousel
    if (images) {
      const index = images.findIndex(img => img === image);
      if (index !== -1) {
        setCurrentImageIndex(index);
      }
    }

    setFullscreenImage(image);
    // Pause auto-advance when fullscreen is open
    setIsPaused(true);
    // Add body class to prevent scrolling
    // adds the class overflow-hidden to the <body> tag, prevents scrolling
    document.body.classList.add('overflow-hidden');
  };

  // Close fullscreen image view
  const closeFullscreen = () => {
    setFullscreenImage(null);
    // Resume auto-advance if mouse is not over carousel
    if (!isPaused) {
      setIsPaused(false);
    }
    // Remove body class to allow scrolling again
    document.body.classList.remove('overflow-hidden');
  };

  // Handle keyboard events for fullscreen view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage) {
        if (e.key === 'Escape') {
          closeFullscreen();
        } else if (e.key === 'ArrowLeft' && images && images.length > 1) {
          prevImage();
        } else if (e.key === 'ArrowRight' && images && images.length > 1) {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // remove when unmounts (modal closes)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenImage, images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="mb-4 relative w-70"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* the viewport - hides overflowing content so you only see one image at a time.
        overflow-hidden ensures that when the inner content moves, you don’t see the off-screen parts. */}
        {/* image sit side-by-side because of the parent .flex class */}
        {/* each image takes up 100% of the container width (min-w-full),
          transform: translateX(-N%) shifts the entire row leftward to show the N-th image */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{transform: `translateX(-${currentImageIndex * 100}%)`}}
          >
            {images.map((image, index) => (
              <div key={index} className="min-w-full">
                <img
                  src={`${baseUrl}/${image}`}
                  alt={`${altText} - image ${index + 1}`}
                  className="w-full aspect-square object-cover cursor-pointer"
                  onClick={() => openFullscreen(image)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image navigation indicators */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-[#008247]' : 'bg-gray-300'}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Previous/Next buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-colors"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-colors"
              onClick={nextImage}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <div className="relative max-w-5xl max-h-screen p-4">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              onClick={closeFullscreen}
              aria-label="Close fullscreen view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Fullscreen image */}
            <img
              src={`${baseUrl}/${images?.[currentImageIndex] || fullscreenImage}`}
              alt={altText}
              className="max-h-[90vh] max-w-full object-contain"
            />

            {/* Navigation buttons for fullscreen view */}
            {images && images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </>
            )}

            {/* Image counter for fullscreen view */}
            {images && images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

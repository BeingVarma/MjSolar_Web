"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, AlertCircle, RefreshCw } from "lucide-react";

export interface CloudinaryImage {
  id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
  format: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch images when modal opens
  useEffect(() => {
    if (isOpen && images.length === 0 && !error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, error, fetchImages]);

  const handleNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  }, [lightboxIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  }, [lightboxIndex, images.length]);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lightboxIndex, onClose, handleNext, handlePrev]);



  // Cloudinary URL transformer for aggressive thumbnail optimization
  const getOptimizedThumb = (url: string) => {
    return url.replace('/upload/', '/upload/c_fill,w_600,f_auto,q_auto/');
  };

  const getOptimizedFull = (url: string) => {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/80 backdrop-blur-xl"
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl h-[90vh] bg-obsidian/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col m-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-md z-10">
                <div>
                  <h2 className="font-outfit text-2xl font-bold text-white">Project Portfolio</h2>
                  <p className="text-slate-400 text-sm tracking-wide">Behind the scenes at MjSolar</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/5 hover:bg-rose/20 hover:text-rose text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose"
                  aria-label="Close Gallery"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <AlertCircle size={48} className="text-rose mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Failed to load gallery</h3>
                    <p className="text-slate-400 mb-6 max-w-md">We couldn&apos;t connect to the image server. Please check your connection and try again.</p>
                    <button
                      onClick={fetchImages}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                      <RefreshCw size={18} /> Retry
                    </button>
                  </div>
                ) : images.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <Maximize2 size={48} className="text-slate-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400">No project images available.</h3>
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05 }
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                  >
                    {images.map((image, idx) => (
                      <motion.div
                        key={image.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 cursor-zoom-in"
                        onClick={() => setLightboxIndex(idx)}
                      >
                        <Image
                          src={getOptimizedThumb(image.secure_url)}
                          alt={`MjSolar project ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <Maximize2 className="text-white drop-shadow-lg" size={20} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-obsidian/95 backdrop-blur-2xl"
          >
            <div className="absolute top-6 left-6 text-white/50 font-outfit text-sm tracking-widest bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
              {lightboxIndex + 1} / {images.length}
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-md"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-md"
              aria-label="Previous Image"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-md"
              aria-label="Next Image"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-5xl max-h-[85vh] p-12 flex items-center justify-center"
            >
              <Image
                src={getOptimizedFull(images[lightboxIndex].secure_url)}
                alt={`MjSolar project fullscreen ${lightboxIndex + 1}`}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="100vw"
                quality={90}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

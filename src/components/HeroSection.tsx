"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { IntroState } from "@/app/[lang]/ClientPage";
import { useI18n } from "@/context/I18nContext";
import GalleryModal from "./GalleryModal";

export default function HeroSection({ introState = "finished", onIntroEnd }: { introState?: IntroState, onIntroEnd?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (introState === "playing") {
      vid.muted = false; // attempt sound
      vid.play().catch((err) => {
        if (err.name === 'NotAllowedError') {
          vid.muted = true;
          setIsMuted(true);
          setNeedsTap(true);
          vid.play().catch(e => console.warn("Autoplay entirely blocked:", e));
        } else {
          console.warn("Autoplay prevented:", err);
        }
      });
    } else if (introState === "finished") {
      vid.pause();
      const setLastFrame = () => {
        if (vid.duration) {
          vid.currentTime = Math.max(0, vid.duration - 0.1);
        }
      };
      
      if (vid.readyState >= 1) {
        setLastFrame();
      } else {
        vid.addEventListener("loadedmetadata", setLastFrame, { once: true });
      }
    }
  }, [introState]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 bg-obsidian">
        <AnimatePresence>
          {introState !== "finished" && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-gradient-to-b from-[#0D0814]/40 via-[#0D0814]/60 to-[#0D0814] z-10"
            />
          )}
        </AnimatePresence>
        
        <video
          ref={videoRef}
          muted={isMuted}
          playsInline
          preload="auto"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture={true}
          className="w-full h-full object-cover opacity-60"
          onTimeUpdate={(e) => {
            const vid = e.currentTarget;
            if (vid.duration && vid.duration - vid.currentTime < 1.5) {
              // Smoothly fade out volume over the last 1.5 seconds
              const volumeLevel = Math.max(0, (vid.duration - vid.currentTime) / 1.5);
              vid.volume = volumeLevel;
            }
          }}
          onEnded={() => {
            if (introState === "playing" && onIntroEnd) onIntroEnd();
          }}
        >
          <source
            src="/videos/hero-intro.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Tap to Unmute Overlay */}
        <AnimatePresence>
          {needsTap && introState === "playing" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 cursor-pointer backdrop-blur-[2px]"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  setIsMuted(false);
                }
                setNeedsTap(false);
              }}
            >
              <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-white animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/10 transition-colors">
                <VolumeX size={20} />
                <span className="font-semibold text-sm font-outfit tracking-wide">Tap to enable sound</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Audio Toggle Button */}
        <AnimatePresence>
          {introState === "playing" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute background video" : "Mute background video"}
              className="absolute bottom-10 right-10 z-50 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,158,0,0.4)] transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-20">
        <AnimatePresence>
          {introState === "finished" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="inline-block px-4 py-1.5 rounded-full border border-rose/30 bg-rose/10 text-rose backdrop-blur-md text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(224,83,117,0.3)]"
              >
                {t("nextGen")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                className="font-outfit text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
              >
                {t("pureSolar")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-solar">
                  {t("engineered")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="max-w-2xl text-base md:text-lg text-slate-300 font-inter mb-8"
              >
                {t("heroSub")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <a
                  href="#calculator"
                  className="group relative px-6 py-3 bg-gradient-to-r from-solar to-amber rounded-full text-obsidian font-bold text-base overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,96,0,0.4)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10">{t("calcSavings")}</span>
                </a>

                <button 
                  onClick={() => setIsGalleryOpen(true)}
                  className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-obsidian flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-obsidian border-b-[5px] border-b-transparent ml-1" />
                  </div>
                  <span className="font-semibold text-white text-sm">{t("watchProcess")}</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solar/20 blur-[120px] rounded-full pointer-events-none z-10" />
      
      {/* Dynamic Cloudinary Gallery Modal */}
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
    </section>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
}

export default function TypewriterText({ text, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<"indicator" | "typing" | "done">("indicator");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (phase === "typing" && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [displayedText, phase]);

  useEffect(() => {
    const indicatorTimer = setTimeout(() => {
      setPhase("typing");
    }, 400 + Math.random() * 200); // 400-600ms indicator

    return () => clearTimeout(indicatorTimer);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    let currentIndex = 0;
    let isActive = true;

    const typeNextChar = () => {
      if (!isActive) return;

      if (currentIndex < text.length) {
        const char = text.charAt(currentIndex);
        setDisplayedText((prev) => prev + char);
        currentIndex++;

        // Calculate delay
        let delay = 20 + Math.random() * 20; // 20-40ms base
        if (char === '.' || char === '?' || char === '!') delay += 200;
        else if (char === ',' || char === '\n') delay += 100;

        setTimeout(typeNextChar, delay);
      } else {
        setPhase("done");
        if (onComplete) onComplete();
      }
    };

    typeNextChar();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, text]);

  if (phase === "indicator") {
    return (
      <div className="flex items-center gap-1 text-slate-400 h-5 mb-3" aria-live="polite">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }}>●</motion.div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>●</motion.div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>●</motion.div>
      </div>
    );
  }

  return (
    <div className="text-white text-sm mb-3 whitespace-pre-wrap leading-relaxed" aria-live="polite">
      {phase === "done" ? (
        <span>{text}</span>
      ) : (
        <span>
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-[2px] h-[1em] bg-amber ml-[1px] align-middle"
          />
        </span>
      )}
      <div ref={scrollRef} />
    </div>
  );
}

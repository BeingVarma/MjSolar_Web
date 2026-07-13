"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative overflow-hidden text-slate-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full max-w-md relative z-10 border-red-500/20 text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        
        <h1 className="font-outfit text-3xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-400 mb-8">
          A critical error occurred while processing your request. Our engineering team has been notified.
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw size={18} /> Try again
          </button>
          
          <Link
            href="/"
            className="w-full py-3 bg-gradient-to-r from-solar to-amber rounded-xl text-obsidian font-bold hover:shadow-[0_0_20px_rgba(255,96,0,0.4)] transition-all flex items-center justify-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

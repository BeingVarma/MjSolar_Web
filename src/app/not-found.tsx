import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solar/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="text-center relative z-10 max-w-lg">
        <div className="font-outfit text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6">
          404
        </div>
        
        <h1 className="font-outfit text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          The requested resource could not be located in our architecture. It may have been moved or deleted.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-solar to-amber rounded-full text-obsidian font-bold text-lg hover:scale-105 shadow-[0_0_30px_rgba(255,96,0,0.4)] transition-transform"
        >
          <Home size={20} />
          Return Home
        </Link>
      </div>
    </div>
  );
}

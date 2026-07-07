"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, CheckCircle2 } from "lucide-react";
import { IntroState } from "@/app/page";

export default function ChatbotOverlay({ introState = "finished" }: { introState?: IntroState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [propertyType, setPropertyType] = useState("");
  const [avgBill, setAvgBill] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleNext = () => setStep(s => s + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request with data payload
    console.log({ propertyType, avgBill, zipCode, contactInfo });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      {introState === "finished" && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <AnimatePresence>
            {!isOpen && (
              <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-solar to-amber p-4 rounded-full shadow-[0_0_20px_rgba(255,96,0,0.3)] hover:scale-105 transition-transform"
          >
            <div className="absolute right-full mr-4 bg-white text-obsidian px-4 py-2 rounded-2xl rounded-br-none text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Hi! Check your 72-hour installation window here ☀️
            </div>
            <MessageSquare size={24} className="text-obsidian" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-0 right-0 w-[350px] bg-obsidian border border-white/10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-solar to-amber p-4 flex justify-between items-center">
              <div>
                <h3 className="font-outfit font-bold text-obsidian">MjSolar Consultant</h3>
                <p className="text-obsidian/80 text-xs">Online • Replies instantly</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-obsidian hover:bg-black/10 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 h-[320px] flex flex-col justify-end bg-gradient-to-b from-white/5 to-transparent relative">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center h-full justify-center">
                  <CheckCircle2 size={48} className="text-green-400 mb-4" />
                  <h4 className="text-white font-bold text-xl mb-2">Request Received!</h4>
                  <p className="text-slate-400 text-sm">One of our premium consultants will contact you shortly to confirm your 72-hour window.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {step === 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="text-white text-sm mb-3">Hi there! Are you looking for residential or commercial solar?</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setPropertyType("Residential"); handleNext(); }} className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors border border-white/5">Residential</button>
                        <button type="button" onClick={() => { setPropertyType("Commercial"); handleNext(); }} className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors border border-white/5">Commercial</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="text-white text-sm mb-3">Got it. What&apos;s your average monthly power bill?</p>
                      <div className="flex gap-2">
                        <input required type="number" placeholder="e.g. 250" value={avgBill} onChange={e => setAvgBill(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber text-sm transition-colors" />
                        <button type="button" onClick={handleNext} disabled={!avgBill} className="bg-amber text-obsidian px-3 rounded-lg hover:bg-solar transition-colors disabled:opacity-50"><Send size={16} /></button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="text-white text-sm mb-3">Almost done! What&apos;s your Zip Code?</p>
                      <div className="flex gap-2">
                        <input required type="text" placeholder="Enter Zip" value={zipCode} onChange={e => setZipCode(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber text-sm transition-colors" />
                        <button type="button" onClick={handleNext} disabled={!zipCode} className="bg-amber text-obsidian px-3 rounded-lg hover:bg-solar transition-colors disabled:opacity-50"><Send size={16} /></button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="text-white text-sm mb-3">Perfect! Where should we send your installation quote?</p>
                      <input required type="text" placeholder="Email or Phone Number" value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber text-sm transition-colors mb-2" />
                      <button type="submit" disabled={!contactInfo || isSubmitting} className="w-full py-2 bg-gradient-to-r from-solar to-amber text-obsidian font-bold rounded-lg hover:shadow-[0_0_15px_rgba(255,158,0,0.4)] transition-all flex items-center justify-center h-10">
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" /> : "Get My Quote"}
                      </button>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

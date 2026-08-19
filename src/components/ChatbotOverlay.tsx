"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import TypewriterText from "./TypewriterText";
import { IntroState } from "@/app/[lang]/ClientPage";
import { useI18n } from "@/context/I18nContext";

const SolarBotIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size}
    height={size}
    viewBox="0 0 100 100" 
    className={className} 
    aria-hidden="true"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Rotating Sun Rays */}
    <motion.g 
      animate={{ rotate: 360 }} 
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "50px 50px" }}
    >
      {[...Array(8)].map((_, i) => (
        <path
          key={i}
          d="M50 8 L50 20 M50 80 L50 92"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 50 50)`}
          className="opacity-90"
        />
      ))}
    </motion.g>

    {/* Robot Head / Sun Core */}
    <circle cx="50" cy="50" r="24" fill="currentColor" />
    
    {/* Robot Eyes */}
    <circle cx="41" cy="46" r="3.5" fill="#FFF" />
    <circle cx="59" cy="46" r="3.5" fill="#FFF" />
    
    {/* Friendly Smile */}
    <path 
      d="M 42 56 Q 50 64 58 56" 
      stroke="#FFF" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      fill="none"
    />
  </svg>
);

export default function ChatbotOverlay({ introState = "finished" }: { introState?: IntroState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isSuccessTypingDone, setIsSuccessTypingDone] = useState(false);
  const { t } = useI18n();

  // Form states
  const [propertyType, setPropertyType] = useState("");
  const [avgBill, setAvgBill] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleNext = () => {
    setIsTypingDone(false);
    setStep(s => s + 1);
  };

  const handleOpen = () => {
    setIsTypingDone(false);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request with data payload
    console.log({ propertyType, avgBill, zipCode, contactInfo });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsTypingDone(false);
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
            onClick={handleOpen}
            aria-label="Solar AI Assistant"
            title="Solar AI Assistant"
            className="group relative flex items-center gap-3 bg-gradient-to-r from-solar to-amber p-4 rounded-full shadow-[0_0_20px_rgba(255,96,0,0.3)] hover:scale-105 transition-transform"
          >
            <span className="sr-only">Solar AI Assistant</span>
            <div className="absolute right-full mr-4 bg-white text-obsidian px-4 py-2 rounded-2xl rounded-br-none text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              {t("chatOpen")}
            </div>
            <SolarBotIcon size={26} className="text-obsidian" />
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
                <h3 className="font-outfit font-bold text-obsidian">{t("consultant")}</h3>
                <p className="text-obsidian/80 text-xs">{t("onlineStatus")}</p>
              </div>
              <button aria-label="Close chat" onClick={() => setIsOpen(false)} className="text-obsidian hover:bg-black/10 p-1 rounded-full transition-colors">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 h-[320px] flex flex-col justify-end bg-gradient-to-b from-white/5 to-transparent relative">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center h-full py-4 px-2">
                  <CheckCircle2 size={40} className="text-green-400 mb-3 shrink-0" />
                  <h4 className="font-outfit font-bold text-white text-lg mb-1 shrink-0">{t("reqReceived")}</h4>
                  <div className="flex-1 overflow-y-auto max-h-[160px] w-full text-slate-300 text-xs md:text-sm no-scrollbar">
                    <TypewriterText 
                      text={`${t("reqReceivedSub")}\n\nFor a faster response and to discuss your requirements directly, you can also continue the conversation with us on WhatsApp.`} 
                      onComplete={() => setIsSuccessTypingDone(true)} 
                    />
                  </div>
                  <AnimatePresence>
                    {isSuccessTypingDone && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="w-full mt-3 shrink-0"
                      >
                        <a 
                          href="https://wa.me/918688749050" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1ebd57] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.02] text-sm"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          <span>Chat on WhatsApp</span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {step === 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <TypewriterText text={t("chatQ1")} onComplete={() => setIsTypingDone(true)} />
                      {isTypingDone && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                          <button type="button" onClick={() => { setPropertyType("Residential"); handleNext(); }} className="text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors border border-white/10">{t("resMode")}</button>
                          <button type="button" onClick={() => { setPropertyType("Commercial"); handleNext(); }} className="text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors border border-white/10">{t("comMode")}</button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <TypewriterText text={t("chatQ2")} onComplete={() => setIsTypingDone(true)} />
                      {isTypingDone && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                          <input required type="number" aria-label="Average monthly bill" placeholder="e.g. 250" value={avgBill} onChange={e => setAvgBill(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber text-sm transition-colors" />
                          <button aria-label="Submit bill" type="button" onClick={handleNext} disabled={!avgBill} className="bg-amber text-obsidian px-3 rounded-lg hover:bg-solar transition-colors disabled:opacity-50"><Send size={16} aria-hidden="true" /></button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <TypewriterText text={t("chatQ3")} onComplete={() => setIsTypingDone(true)} />
                      {isTypingDone && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                          <input required type="text" aria-label="Zip code" placeholder="Enter Zip" value={zipCode} onChange={e => setZipCode(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber text-sm transition-colors" />
                          <button aria-label="Submit zip code" type="button" onClick={handleNext} disabled={!zipCode} className="bg-amber text-obsidian px-3 rounded-lg hover:bg-solar transition-colors disabled:opacity-50"><Send size={16} aria-hidden="true" /></button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <TypewriterText text={t("chatQ4")} onComplete={() => setIsTypingDone(true)} />
                      {isTypingDone && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                          <input aria-label="Contact information" required type="text" placeholder="Email or Phone Number" value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber text-sm transition-colors" />
                          <button type="submit" disabled={!contactInfo || isSubmitting} className="w-full py-2 bg-gradient-to-r from-solar to-amber text-obsidian font-bold rounded-lg hover:shadow-[0_0_15px_rgba(255,158,0,0.4)] transition-all flex items-center justify-center h-10 mt-2">
                            {isSubmitting ? <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" /> : t("getMyQuote")}
                          </button>
                        </motion.div>
                      )}
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

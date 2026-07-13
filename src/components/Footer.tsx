"use client";

import { useState } from "react";
import { Camera, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useI18n } from "@/context/I18nContext";
import LegalModal from "./LegalModal";

export default function Footer() {
  const { config } = useAdminConfig();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'sla' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request for Vercel deployment readiness without backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <footer id="contact" className="relative bg-[#08050C] border-t border-white/5 pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-rose to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 relative z-10">
        <div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-4">
            {t("readyToHarness")}
          </h2>
          <p className="text-slate-400 text-base mb-6 max-w-md">
            {t("reachOut")}
          </p>
          
          <div className="flex gap-4 mb-12">
            <a href={config.socials.x} aria-label="Follow us on X" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
              X
            </a>
            <a href={config.socials.linkedin} aria-label="Follow us on LinkedIn" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
              in
            </a>
            <a href={config.socials.facebook} aria-label="Follow us on Facebook" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
              f
            </a>
            <a href={config.socials.instagram} aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
              <Camera size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-solar/20 blur-[100px] rounded-full pointer-events-none" />
          
          {isSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center py-12">
              <CheckCircle2 size={56} className="text-green-400 mb-6" />
              <h3 className="font-outfit text-2xl font-bold text-white mb-2">{t("msgSent")}</h3>
              <p className="text-slate-400 text-center">{t("msgSentSub")}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="first-name" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{t("firstName")}</label>
                  <input id="first-name" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{t("lastName")}</label>
                  <input id="last-name" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{t("emailAddr")}</label>
                <input id="email" required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all" />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{t("messageDetails")}</label>
                <textarea id="message" required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all resize-none" />
              </div>

              <button type="submit" disabled={isSubmitting} className="group flex items-center justify-center gap-2 w-full py-3 bg-white text-obsidian font-bold rounded-xl hover:bg-slate-200 transition-colors mt-2 h-12">
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t("submitReq")} <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
        <div className="flex flex-col md:flex-row items-center gap-2 order-3 md:order-1 font-medium">
          <span className="text-slate-400">Developed by</span>
          <a 
            href="https://shancom.in/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-300 hover:text-solar transition-colors duration-300 relative group"
          >
            Shancom Solutions
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-solar transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <div className="flex gap-6 order-1 md:order-2">
          <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => setActiveModal('sla')} className="hover:text-white transition-colors">Enterprise SLA</button>
        </div>
        <div className="flex items-center gap-2 order-2 md:order-3">
          <span>&copy; {new Date().getFullYear()} MjSolar Engineering Inc. All rights reserved.</span>
        </div>
      </div>

      <LegalModal 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        type={activeModal} 
      />
    </footer>
  );
}

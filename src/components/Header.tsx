"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { IntroState } from "@/app/[lang]/ClientPage";
import { useI18n } from "@/context/I18nContext";



export default function Header({ introState = "finished" }: { introState?: IntroState }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useI18n();

  const NAV_LINKS = [
    { name: t("navStandards"), href: "#standards" },
    { name: t("navServices"), href: "#services" },
    { name: t("navPortfolio"), href: "#dashboard" },
    { name: t("navCalculator"), href: "#calculator" },
    { name: t("navContact"), href: "#contact" },
  ];

  return (
    <AnimatePresence>
      {introState === "finished" && (
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-panel border-b-0 border-white/5 py-4"
        >
          <div className="max-w-[90rem] mx-auto px-6 flex items-center justify-between">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-2xl font-outfit font-bold tracking-tight hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              <Image 
                src="/icon.png" 
                alt="MjSolar Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 object-contain rounded-md"
              />
              <span className="text-white">MjSolar</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-8 px-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <a
                href="#contact"
                aria-label={t("getQuote")}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-solar to-amber text-obsidian font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,96,0,0.4)] transition-all transform hover:scale-105"
              >
                {t("getQuote")}
              </a>
              <button
                onClick={() => setLanguage(language === "en" ? "hi" : language === "hi" ? "te" : "en")}
                className="px-3 py-1 rounded border border-white/20 text-xs font-bold hover:bg-white/10 transition-colors uppercase"
                aria-label="Toggle language"
              >
                {language}
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white p-2 shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full glass-panel flex flex-col p-6 gap-4 lg:hidden border-t border-white/10 shadow-2xl"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            aria-label={t("getQuote")}
            className="mt-4 w-full text-center px-6 py-3.5 rounded-full bg-gradient-to-r from-solar to-amber text-obsidian font-bold text-sm hover:shadow-[0_0_20px_rgba(255,96,0,0.4)] transition-all"
          >
            {t("getQuote")}
          </a>
        </motion.div>
      )}
        </motion.header>
      )}
    </AnimatePresence>
  );
}

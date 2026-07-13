"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { IntroState } from "@/app/page";
import { useI18n } from "@/context/I18nContext";



export default function Header({ introState = "finished" }: { introState?: IntroState }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useI18n();

  const NAV_LINKS = [
    { name: t("navServices"), href: "#services" },
    { name: t("navCalculator"), href: "#calculator" },
    { name: t("navDashboard"), href: "#dashboard" },
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
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-outfit font-bold tracking-tight">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-solar to-amber flex items-center justify-center text-obsidian shadow-[0_0_15px_rgba(255,158,0,0.5)]">
                M
              </div>
              <span className="text-white">MjSolar</span>
            </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-solar to-amber text-obsidian font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,96,0,0.4)] transition-all transform hover:scale-105"
          >
            {t("getQuote")}
          </a>
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="px-3 py-1 rounded border border-white/20 text-xs font-bold hover:bg-white/10 transition-colors uppercase"
            aria-label="Toggle language"
          >
            {language}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
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
          className="absolute top-full left-0 w-full glass-panel flex flex-col p-6 gap-4 md:hidden border-t border-white/10"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      )}
        </motion.header>
      )}
    </AnimatePresence>
  );
}

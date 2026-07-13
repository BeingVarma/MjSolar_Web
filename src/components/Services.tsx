"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/context/I18nContext";

export default function Services() {
  const { t } = useI18n();

  const SYSTEMS = [
    {
      title: t("sys1Title"),
      desc: t("sys1Desc"),
      keys: [t("sys1Key1"), t("sys1Key2"), t("sys1Key3"), t("sys1Key4"), t("sys1Key5")],
      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
      alt: "On-Grid Solar System Installation"
    },
    {
      title: t("sys2Title"),
      desc: t("sys2Desc"),
      keys: [t("sys2Key1"), t("sys2Key2"), t("sys2Key3"), t("sys2Key4"), t("sys2Key5")],
      img: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?q=80&w=800&auto=format&fit=crop",
      alt: "Off-Grid Solar System with Batteries"
    },
    {
      title: t("sys3Title"),
      desc: t("sys3Desc"),
      keys: [t("sys3Key1"), t("sys3Key2"), t("sys3Key3"), t("sys3Key4"), t("sys3Key5")],
      img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800&auto=format&fit=crop",
      alt: "Hybrid Solar System Installation"
    }
  ];

  const PRODUCTS = [
    {
      title: t("prod1Title"),
      desc: t("prod1Desc"),
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=600&auto=format&fit=crop",
      alt: "Solar Water Pump System"
    },
    {
      title: t("prod2Title"),
      desc: t("prod2Desc"),
      img: "https://images.unsplash.com/photo-1584278860047-22db9ff82bed?q=80&w=600&auto=format&fit=crop",
      alt: "Solar Water Heater on Roof"
    },
    {
      title: t("prod3Title"),
      desc: t("prod3Desc"),
      img: "https://images.unsplash.com/photo-1572085313466-6710de8d7ba3?q=80&w=600&auto=format&fit=crop",
      alt: "Solar Powered Street Light"
    },
    {
      title: t("prod4Title"),
      desc: t("prod4Desc"),
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
      alt: "Solar Fencing System"
    }
  ];

  return (
    <section className="py-32 relative bg-obsidian overflow-hidden">
      {/* Decorative Blur Elements matching OurStandards */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -left-40 top-40 w-96 h-96 bg-solar/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 bottom-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="font-outfit text-3xl md:text-5xl font-bold text-white mb-6">
            {t("servicesTitle")}
          </h2>
          <h3 className="font-outfit text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-solar to-amber mb-4">
            {t("servicesSub")}
          </h3>
          <p className="text-slate-400 max-w-3xl mx-auto text-base md:text-lg">
            {t("servicesDesc")}
          </p>
        </motion.div>

        {/* Part 1: System Solutions */}
        <div className="mb-24">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-outfit font-bold text-white mb-10 border-l-4 border-solar pl-4"
          >
            {t("systemTitle")}
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SYSTEMS.map((sys, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="glass-panel rounded-3xl relative group overflow-hidden flex flex-col h-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={sys.img} 
                    alt={sys.alt} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 to-transparent" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-xl font-outfit font-bold text-white mb-3">
                    {sys.title}
                  </h4>
                  <p className="text-slate-400 font-inter text-sm mb-6 flex-1">
                    {sys.desc}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {sys.keys.map((key, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={16} className="text-solar shrink-0 mt-0.5" />
                        <span>{key}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href="#contact" 
                    className="inline-flex items-center gap-2 text-solar hover:text-amber font-semibold text-sm transition-colors group/btn"
                  >
                    {t("reqConsultation")}
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Part 2: Solar Products */}
        <div className="mb-24">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-outfit font-bold text-white mb-10 border-l-4 border-solar pl-4"
          >
            {t("productTitle")}
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((prod, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="glass-panel p-5 rounded-2xl relative group flex flex-col h-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-xl mb-5">
                  <Image 
                    src={prod.img} 
                    alt={prod.alt} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-lg font-outfit font-bold text-white mb-2">
                  {prod.title}
                </h4>
                <p className="text-slate-400 font-inter text-xs leading-relaxed flex-1 mb-4">
                  {prod.desc}
                </p>
                <a 
                  href="#contact" 
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  {t("learnMore")}
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-10 md:p-14 rounded-3xl text-center relative overflow-hidden border border-white/5 bg-white/[0.02]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-solar/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          
          <h3 className="text-2xl md:text-3xl font-outfit font-bold text-white mb-8 relative z-10">
            {t("ctaLookingFor")}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a 
              href="#contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-solar to-amber text-obsidian font-bold text-sm hover:shadow-[0_0_30px_rgba(255,96,0,0.4)] transition-all transform hover:scale-105"
            >
              {t("getQuote")}
            </a>
            <a 
              href="#contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-all"
            >
              {t("ctaContactExperts")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

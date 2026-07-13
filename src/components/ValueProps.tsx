"use client";

import { motion } from "framer-motion";
import { Zap, Clock, ShieldCheck } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function ValueProps() {
  const { t } = useI18n();

  const PILLARS = [
    {
      icon: Zap,
      title: t("vp1Title"),
      description: t("vp1Desc"),
      color: "from-amber to-yellow-600",
    },
    {
      icon: Clock,
      title: t("vp2Title"),
      description: t("vp2Desc"),
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: ShieldCheck,
      title: t("vp3Title"),
      description: t("vp3Desc"),
      color: "from-rose to-purple-500",
    }
  ];

  return (
    <section id="services" className="py-32 relative bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar to-amber">MjSolar Standard</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Engineering excellence meets uncompromising speed. We deploy the world&apos;s most advanced solar architectures faster than anyone else.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="glass-panel p-8 rounded-3xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <pillar.icon size={24} className="text-white" />
              </div>
              
              <h3 className="text-xl font-outfit font-bold text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-slate-400 font-inter leading-relaxed text-sm">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

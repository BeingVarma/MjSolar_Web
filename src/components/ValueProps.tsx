"use client";

import { motion } from "framer-motion";
import { Clock, Zap, Building2 } from "lucide-react";

const PILLARS = [
  {
    icon: Clock,
    title: "72-Hour Rapid Installation",
    description: "Guaranteed swift engineering from blueprint to activation. Our streamlined process ensures minimal disruption to your lifestyle or operations.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Zap,
    title: "Ultra-High Efficiency Panels",
    description: "Next-gen photovoltaic tech yielding 24%+ more energy footprint than standard market panels, maximizing your roof's potential.",
    color: "from-amber to-solar",
  },
  {
    icon: Building2,
    title: "Commercial & Residential Scaling",
    description: "Tailored engineering architectures perfectly suited for sprawling premium estates and robust enterprise facilities alike.",
    color: "from-rose to-purple-500",
  }
];

export default function ValueProps() {
  return (
    <section id="services" className="py-32 relative bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar to-amber">MjSolar Standard</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
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
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${pillar.color} mb-6 shadow-lg`}>
                <pillar.icon size={28} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-outfit font-bold text-white mb-4">
                {pillar.title}
              </h3>
              <p className="text-slate-400 font-inter leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

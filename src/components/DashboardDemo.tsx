"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Activity, DollarSign, Leaf } from "lucide-react";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useI18n } from "@/context/I18nContext";

export default function DashboardDemo() {
  const { config } = useAdminConfig();
  const { t } = useI18n();
  const [profile, setProfile] = useState<"home" | "warehouse">("home");
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  // Simulate live data feed
  useEffect(() => {
    const base = profile === "home" ? 15 : 120;
    const variance = profile === "home" ? 3 : 15;
    
    // Initial data
    setTimeout(() => {
      const initial = Array.from({ length: 20 }, () => base + (Math.random() * variance - variance / 2));
      setDataPoints(initial);
    }, 0);

    const interval = setInterval(() => {
      setDataPoints(prev => {
        const next = [...prev.slice(1), base + (Math.random() * variance - variance / 2)];
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [profile]);

  const maxVal = Math.max(...dataPoints, 1);
  const minVal = Math.min(...dataPoints, 0);

  // Simple SVG path generator
  const generatePath = () => {
    if (dataPoints.length === 0) return "";
    const w = 1000;
    const h = 200;
    const dx = w / (dataPoints.length - 1);
    const scaleY = (val: number) => h - ((val - minVal) / (maxVal - minVal || 1)) * h;

    return dataPoints.reduce((acc, val, i) => {
      const x = i * dx;
      const y = scaleY(val);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, "");
  };

  const metrics = {
    savedToday: profile === "home" ? config.dashboard.homeMultiplier : config.dashboard.warehouseMultiplier,
    co2Offset: profile === "home" ? config.dashboard.co2Home : config.dashboard.co2Warehouse
  };

  return (
    <section id="dashboard" className="py-20 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="font-outfit text-4xl font-bold text-white mb-2">{t("dashTitle")}</h2>
            <p className="text-slate-400">{t("dashSub")}</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setProfile("home")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                profile === "home" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t("homeSim")}
            </button>
            <button
              onClick={() => setProfile("warehouse")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                profile === "warehouse" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t("warehouseSim")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-3 glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-white font-medium">
                <Activity size={20} className="text-rose" />
                Live Power Generation (kW)
              </div>
              <div className="text-2xl font-outfit font-bold text-white">
                {dataPoints[dataPoints.length - 1]?.toFixed(2)} <span className="text-sm text-slate-400 font-normal">kW</span>
              </div>
            </div>

            <div className="h-[250px] w-full relative">
              <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-rose)" />
                    <stop offset="100%" stopColor="var(--color-solar)" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={generatePath()}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              </svg>
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-white w-full"></div>
                <div className="border-t border-white w-full"></div>
                <div className="border-t border-white w-full"></div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Leaf size={18} className="text-green-400" />
                <span className="text-sm font-medium">{t("co2Offset")} ({t("tons")})</span>
              </div>
              <div className="text-3xl font-outfit font-bold text-white">
                {metrics.co2Offset.toFixed(1)}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-center bg-gradient-to-br from-white/5 to-amber/10 border-amber/20">
              <div className="flex items-center gap-3 mb-2 text-amber/80">
                <DollarSign size={18} />
                <span className="text-sm font-medium">{t("savedToday")}</span>
              </div>
              <div className="text-4xl font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber to-solar">
                ₹{metrics.savedToday.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

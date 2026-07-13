"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, SunMedium, Building2, Home } from "lucide-react";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useI18n } from "@/context/I18nContext";

export default function RoiCalculator() {
  const { config } = useAdminConfig();
  const { t } = useI18n();
  const [mode, setMode] = useState<"res" | "com">("res");
  const isCommercial = mode === "com";
  
  const [bill, setBill] = useState(config.roi.resDefault);

  const breakEvenYears = isCommercial ? 4.8 : 4.2;
  const savings = bill * 12 * 0.90; // Simplified for this example structure

  const minBill = isCommercial ? config.roi.comMin : config.roi.resMin;
  const maxBill = isCommercial ? config.roi.comMax : config.roi.resMax;
  const step = isCommercial ? config.roi.comStep : config.roi.resStep;

  const formatLabel = (val: number) => {
    if (val >= 100000) {
      return `₹${val / 100000} Lakh${val >= 1000000 ? "s+" : ""}`;
    }
    return `₹${val.toLocaleString('en-IN')}${val >= 10000 ? '+' : ''}`;
  };

  const formatIndianCurrency = (val: number) => Math.round(val).toLocaleString('en-IN');

  const minLabel = formatLabel(minBill);
  const maxLabel = formatLabel(maxBill);

  useEffect(() => {
    setBill(isCommercial ? config.roi.comDefault : config.roi.resDefault);
  }, [mode, config.roi]);

  return (
    <section id="calculator" className="py-24 relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose/10 via-obsidian to-obsidian" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-rose/20">
          <div className="text-center mb-16 relative z-10">
            <h2 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-4">
              {t("roiTitle")}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t("roiSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Inputs */}
            <div className="space-y-8">
              <div className="flex bg-white/5 p-1 rounded-full w-max">
                <button
                  onClick={() => setMode("res")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${mode === "res" ? "bg-amber text-obsidian shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  <Home size={18} /> {t("resMode")}
                </button>
                <button
                  onClick={() => setMode("com")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${mode === "com" ? "bg-solar text-obsidian shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  <Building2 size={18} /> {t("comMode")}
                </button>
              </div>

              <div>
                <label className="block text-slate-300 mb-4 font-medium flex flex-wrap gap-2 items-center">
                  {t("monthlyBill")}: 
                  <span className="text-amber font-bold text-lg">
                    {bill >= 100000 
                      ? `₹${(bill / 100000).toLocaleString('en-IN')} Lakh${bill >= maxBill ? '+' : ''}` 
                      : `₹${bill.toLocaleString('en-IN')}${bill >= maxBill ? '+' : ''}`}
                  </span>
                </label>
                <input
                  type="range"
                  min={minBill}
                  max={maxBill}
                  step={step}
                  value={bill}
                  onChange={(e) => setBill(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-solar"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>{minLabel}</span>
                  <span>{maxLabel}</span>
                </div>
              </div>
            </div>

            {/* Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <TrendingUp size={24} className="text-amber mb-3" />
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{t("estSavings")}</div>
                <div className="font-outfit text-3xl font-bold text-white flex items-baseline gap-1">
                  <span className="text-xl text-amber">₹</span>
                  {formatIndianCurrency(savings)}
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-solar/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <SunMedium size={24} className="text-solar mb-3" />
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{t("paybackPeriod")}</div>
                <div className="font-outfit text-3xl font-bold text-white flex items-baseline gap-2">
                  {breakEvenYears} <span className="text-lg text-slate-400 font-inter font-normal">{t("years")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center border-t border-white/10 pt-8">
            <button className="px-8 py-4 bg-white text-obsidian rounded-full font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Lock In These Savings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

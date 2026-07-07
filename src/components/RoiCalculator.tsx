"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useAdminConfig } from "@/context/AdminConfigContext";

export default function RoiCalculator() {
  const { config } = useAdminConfig();
  const [isCommercial, setIsCommercial] = useState(false);
  
  // Use state but initialize safely. We will update bill when toggling or when config changes if needed.
  const [bill, setBill] = useState(config.roi.resDefault);

  const breakEvenYears = isCommercial ? 4.8 : 4.2;

  const minBill = isCommercial ? config.roi.comMin : config.roi.resMin;
  const maxBill = isCommercial ? config.roi.comMax : config.roi.resMax;
  const step = isCommercial ? config.roi.comStep : config.roi.resStep;

  // Format the text for slider endpoints dynamically
  const formatLabel = (val: number) => {
    if (val >= 100000) {
      return `₹${val / 100000} Lakh${val >= 1000000 ? "s+" : ""}`;
    }
    return `₹${val.toLocaleString('en-IN')}${val >= 10000 ? '+' : ''}`;
  };

  const minLabel = formatLabel(minBill);
  const maxLabel = formatLabel(maxBill);

  const handleToggle = (commercial: boolean) => {
    setIsCommercial(commercial);
    setBill(commercial ? config.roi.comDefault : config.roi.resDefault);
  };

  const targetYear1 = bill * 12 * 0.90; // 90% offset
  const targetYear10 = targetYear1 * 10 * 1.15; // 15% energy cost inflation

  const year1Value = useMotionValue(0);
  const year10Value = useMotionValue(0);

  const year1Rounded = useTransform(year1Value, (latest) => `₹${Math.round(latest).toLocaleString('en-IN')}`);
  const year10Rounded = useTransform(year10Value, (latest) => `₹${Math.round(latest).toLocaleString('en-IN')}`);

  useEffect(() => {
    const controls1 = animate(year1Value, targetYear1, { duration: 0.8, ease: "easeOut" });
    const controls10 = animate(year10Value, targetYear10, { duration: 1.2, ease: "easeOut" });

    return () => {
      controls1.stop();
      controls10.stop();
    };
  }, [targetYear1, targetYear10, year1Value, year10Value]);

  return (
    <section id="calculator" className="py-24 relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose/10 via-obsidian to-obsidian" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-rose/20">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-4xl font-bold text-white mb-4">
              Interactive ROI Calculator
            </h2>
            <p className="text-slate-400">Discover your potential savings in real-time.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Inputs */}
            <div className="space-y-8">
              <div className="flex bg-white/5 p-1 rounded-full w-max">
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    !isCommercial ? "bg-rose text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                  onClick={() => handleToggle(false)}
                >
                  Residential
                </button>
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    isCommercial ? "bg-solar text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                  onClick={() => handleToggle(true)}
                >
                  Commercial
                </button>
              </div>

              <div>
                <label className="block text-slate-300 mb-4 font-medium flex flex-wrap gap-2 items-center">
                  Average Monthly Electricity Bill: 
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
            <div className="space-y-6">
              <div className="glass-panel bg-white/5 p-6 rounded-2xl border-white/5">
                <p className="text-slate-400 text-sm mb-1">Estimated Year 1 Savings</p>
                <motion.span className="font-outfit text-3xl md:text-4xl font-bold text-white block truncate">
                  {year1Rounded}
                </motion.span>
              </div>
              
              <div className="glass-panel bg-gradient-to-br from-solar/20 to-amber/5 p-6 rounded-2xl border-solar/30">
                <p className="text-amber/80 text-sm mb-1 font-medium">10-Year Cumulative Savings</p>
                <motion.span className="font-outfit text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-solar to-amber block mb-2 truncate">
                  {year10Rounded}
                </motion.span>
                <p className="text-slate-300 text-sm">
                  Pays for itself in <span className="text-white font-bold">{breakEvenYears} years</span>
                </p>
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

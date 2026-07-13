"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useI18n } from "@/context/I18nContext";
import { 
  Building2, Home, SunMedium, TrendingUp, ChevronRight, 
  Leaf, Zap, Factory, Battery, IndianRupee 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";

export default function RoiCalculator() {
  const { config } = useAdminConfig();
  const { t } = useI18n();
  const [mode, setMode] = useState<"res" | "com">("res");
  const isCommercial = mode === "com";
  
  // Inputs
  const [bill, setBill] = useState(isCommercial ? config.roi.comDefault : config.roi.resDefault);
  const [state, setState] = useState("AP");
  const [roofType, setRoofType] = useState("rcc");
  const [businessType, setBusinessType] = useState("manufacturing");
  const [operatingDays, setOperatingDays] = useState(30);

  const minBill = isCommercial ? config.roi.comMin : config.roi.resMin;
  const maxBill = isCommercial ? config.roi.comMax : config.roi.resMax;
  const step = isCommercial ? config.roi.comStep : config.roi.resStep;

  // Handle Mode Switch
  const switchMode = (newMode: "res" | "com") => {
    setMode(newMode);
    setBill(newMode === "com" ? config.roi.comDefault : config.roi.resDefault);
    setSelectedKwOverride(null);
  };

  const handleBillChange = (val: number) => {
    setBill(val);
    setSelectedKwOverride(null);
  }

  // Calculations Logic
  const tariff = isCommercial ? config.assumptions.tariffCom : config.assumptions.tariffRes;
  const genPerKw = config.assumptions.generationPerKw;
  const costPerKw = isCommercial ? config.pricing.costPerKwCom : config.pricing.costPerKwRes;
  const exportTariff = config.assumptions.exportTariff;

  // Estimate monthly consumption in units (kWh)
  const monthlyUnits = bill / tariff;
  
  // Recommend System Size (kW) to offset 100% of bill
  const rawRecommendedKw = monthlyUnits / genPerKw;
  // Round to nearest 0.5 or 1 kW
  const recommendedKw = Math.max(1, Math.ceil(rawRecommendedKw * 2) / 2);

  const [selectedKwOverride, setSelectedKwOverride] = useState<number | null>(null);
  const activeKw = selectedKwOverride || recommendedKw;

  // Subsidy Calculation (Simplified)
  const subsidyPerKw = isCommercial ? config.subsidies.subsidyPerKwCom : config.subsidies.subsidyPerKwRes;
  const maxSubsidyKw = isCommercial ? config.subsidies.maxSubsidyKwCom : config.subsidies.maxSubsidyKwRes;

  const calculateSystemMetrics = (kw: number) => {
    const eligibleSubsidyKw = Math.min(kw, maxSubsidyKw);
    const totalSubsidy = eligibleSubsidyKw * subsidyPerKw;
    const cost = (kw * costPerKw) - totalSubsidy;
    const monthlyGen = kw * genPerKw;
    
    // Net Metering
    let newBill = 0;
    let exportIncome = 0;
    
    if (monthlyGen < monthlyUnits) {
      newBill = (monthlyUnits - monthlyGen) * tariff;
    } else {
      exportIncome = (monthlyGen - monthlyUnits) * exportTariff;
    }

    const monthlySavings = bill - newBill + exportIncome;
    const annualSavings = monthlySavings * 12;
    
    // Payback
    const payback = cost / annualSavings;

    // Lifetime (25 years with degradation, maintenance, and inverter replacement)
    let lifetimeSavings = 0;
    let currentTariff = tariff;
    let currentGen = monthlyGen * 12;
    
    for (let i = 1; i <= 25; i++) {
      let yearlyUnits = monthlyUnits * 12;
      let yearlyBill = 0;
      let yearlyExport = 0;
      
      if (currentGen < yearlyUnits) {
        yearlyBill = (yearlyUnits - currentGen) * currentTariff;
      } else {
        yearlyExport = (currentGen - yearlyUnits) * exportTariff; // export tariff doesn't inflate here
      }
      
      let yearSavings = (yearlyUnits * currentTariff) - yearlyBill + yearlyExport;
      
      // Subtract maintenance
      yearSavings -= (config.assumptions.maintenanceCostPerKwYear * kw);

      // Subtract inverter replacement
      if (i === config.assumptions.inverterReplacementYear) {
        yearSavings -= (config.assumptions.inverterReplacementCostPerKw * kw);
      }

      lifetimeSavings += yearSavings;

      currentGen = currentGen * (1 - config.assumptions.degradationRate);
      currentTariff = currentTariff * (1 + config.assumptions.inflationRate);
    }

    return { cost, monthlyGen, newBill, exportIncome, monthlySavings, annualSavings, payback, lifetimeSavings };
  };

  const activeMetrics = calculateSystemMetrics(activeKw);
  const recommendedMetrics = calculateSystemMetrics(recommendedKw);

  // Comparison Options
  const comparisonKws = [
    recommendedKw,
    Math.ceil(recommendedKw * 1.5),
    Math.ceil(recommendedKw * 2),
    Math.ceil(recommendedKw * 3)
  ].filter((v, i, a) => a.indexOf(v) === i); // Unique

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  // Generate Chart Data
  const chartData = useMemo(() => {
    let data = [];
    let cumulative = -activeMetrics.cost;
    let currentTariff = tariff;
    let currentGen = activeMetrics.monthlyGen * 12;
    const yearlyUnits = monthlyUnits * 12;

    for (let year = 0; year <= 25; year++) {
      if (year === 0) {
        data.push({ year: 0, cashFlow: Math.round(cumulative) });
        continue;
      }
      
      let yearlyBill = 0;
      let yearlyExport = 0;
      if (currentGen < yearlyUnits) {
        yearlyBill = (yearlyUnits - currentGen) * currentTariff;
      } else {
        yearlyExport = (currentGen - yearlyUnits) * exportTariff;
      }
      
      let yearSavings = (yearlyUnits * currentTariff) - yearlyBill + yearlyExport;
      
      yearSavings -= (config.assumptions.maintenanceCostPerKwYear * activeKw);
      if (year === config.assumptions.inverterReplacementYear) {
        yearSavings -= (config.assumptions.inverterReplacementCostPerKw * activeKw);
      }

      cumulative += yearSavings;
      data.push({ year, cashFlow: Math.round(cumulative) });

      currentGen = currentGen * (1 - config.assumptions.degradationRate);
      currentTariff = currentTariff * (1 + config.assumptions.inflationRate);
    }
    return data;
  }, [activeMetrics.cost, activeMetrics.monthlyGen, monthlyUnits, tariff, exportTariff, config.assumptions, activeKw]);

  return (
    <section id="calculator" className="py-20 relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-solar/5 via-obsidian to-obsidian" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("smartCalcTitle")}
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {t("smartCalcSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Inputs (30 Seconds) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-rose/20">
              <div className="flex bg-white/5 p-1 rounded-full w-full mb-6">
                <button
                  onClick={() => switchMode("res")}
                  className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-full font-bold transition-all text-sm ${!isCommercial ? "bg-amber text-obsidian shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  <Home size={16} /> {t("resMode")}
                </button>
                <button
                  onClick={() => switchMode("com")}
                  className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-full font-bold transition-all text-sm ${isCommercial ? "bg-solar text-obsidian shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  <Building2 size={16} /> {t("comMode")}
                </button>
              </div>

              <div className="space-y-6">
                {/* Monthly Bill */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3 flex justify-between items-center">
                    {t("monthlyBill")}
                    <span className="text-amber font-bold text-lg">{formatCurrency(bill)}</span>
                  </label>
                  <input
                    type="range"
                    min={minBill}
                    max={maxBill}
                    step={step}
                    value={bill}
                    onChange={(e) => handleBillChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-solar"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium tracking-wider">
                    <span>{formatCurrency(minBill)}</span>
                    <span>{formatCurrency(maxBill)}</span>
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">{t("state")}</label>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber appearance-none">
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                    <option value="MH">Maharashtra</option>
                    <option value="DL">Delhi</option>
                    <option value="KA">Karnataka</option>
                  </select>
                </div>

                {/* Roof Type */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">{t("roofType")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["roofRcc", "roofMetal", "roofTile", "roofOther"].map(r => (
                      <button 
                        key={r} 
                        onClick={() => setRoofType(r)}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors border ${roofType === r ? 'bg-amber/20 border-amber text-amber' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                      >
                        {t(r as any)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commercial Extras */}
                <AnimatePresence>
                  {isCommercial && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">{t("typeBusiness")}</label>
                        <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber appearance-none">
                          <option value="manufacturing">Manufacturing / Factory</option>
                          <option value="office">Corporate Office</option>
                          <option value="retail">Retail / Mall</option>
                          <option value="warehouse">Warehouse</option>
                          <option value="hospitality">Hospitality / Hotel</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">{t("operatingDays")} ({operatingDays})</label>
                        <input type="range" min="5" max="31" value={operatingDays} onChange={(e) => setOperatingDays(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-solar" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Environment Impact */}
            <div className="glass-panel p-6 rounded-3xl border-white/10 space-y-4">
              <h3 className="text-base font-outfit font-bold text-white mb-2">{t("envImpact")}</h3>
              <div className="flex items-center gap-4 text-slate-300">
                <Leaf className="text-green-400" size={20} />
                <div>
                  <div className="text-xl font-bold text-white">{Math.round(activeKw * 25.5)}</div>
                  <div className="text-[10px] uppercase tracking-wide">{t("treesSaved")}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <Factory className="text-rose" size={20} />
                <div>
                  <div className="text-xl font-bold text-white">{Math.round(activeKw * 1.5)} {t("tons")}</div>
                  <div className="text-[10px] uppercase tracking-wide">{t("co2Reduction")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Output & Recommendations */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active System Card */}
            <div className="relative p-1 rounded-3xl bg-gradient-to-r from-solar via-amber to-rose overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="bg-obsidian/95 backdrop-blur-xl p-6 md:p-8 rounded-[1.4rem] relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                  <div>
                    {activeKw === recommendedKw && (
                      <div className="inline-block px-3 py-1 rounded-full bg-amber/20 text-amber font-bold text-[10px] tracking-widest uppercase mb-3 border border-amber/30 shadow-[0_0_15px_rgba(255,191,0,0.3)]">
                        ✨ {t("recommendedForYou")}
                      </div>
                    )}
                    <div className="font-outfit text-5xl font-bold text-white mb-1 flex items-baseline gap-2">
                      {activeKw} <span className="text-xl text-slate-400">{t("kw")}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{t("solarCapacity")}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-2xl font-bold text-white mb-1">{formatCurrency(activeMetrics.cost)}</div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">{t("netInvestment")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">{t("monthlySavings")}</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(activeMetrics.monthlySavings)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">{t("paybackPeriod")}</p>
                    <p className="text-lg font-bold text-amber">{activeMetrics.payback.toFixed(1)} {t("years")}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">{t("lifetimeSavings")}</p>
                    <p className="text-lg font-bold text-green-400">{formatCurrency(activeMetrics.lifetimeSavings)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">{t("warranty")}</p>
                    <p className="text-lg font-bold text-white">{config.warranty.panels} {t("years")}</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-white text-obsidian font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] text-sm flex items-center justify-center gap-2">
                  <Zap size={16} className="text-amber" /> {t("getSiteSurvey")}
                </button>
              </div>
            </div>

            {/* Financial Projection Chart */}
            <div className="glass-panel p-6 rounded-3xl border-white/10">
              <h3 className="text-lg font-outfit font-bold text-white mb-4 pl-2">{t("financialProjection")}</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffbf00" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffbf00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickMargin={8} axisLine={false} />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{fill: '#64748b', fontSize: 12}} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(val) => `₹${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [formatCurrency(Number(val)), t("monthlyCashFlow" as any)]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <ReferenceLine y={0} stroke="#ff6000" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="cashFlow" stroke="#ffbf00" strokeWidth={2} fillOpacity={1} fill="url(#colorCashFlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Cash Flow Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col justify-center">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-4">{t("currentBill")}</h4>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center text-rose">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(bill)}</div>
                    <div className="text-xs text-rose">Every Month</div>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col justify-center bg-gradient-to-br from-white/5 to-amber/5">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-4">{t("afterSolar")}</h4>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Battery size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(activeMetrics.newBill)}</div>
                    <div className="text-xs text-green-400">{t("billAfter")}</div>
                  </div>
                </div>
                {activeMetrics.exportIncome > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-slate-400">{t("electricityCredit")}</span>
                    <span className="text-amber font-bold">+{formatCurrency(activeMetrics.exportIncome)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Larger System Options (Upsell) */}
            <div>
              <h3 className="text-lg font-outfit font-bold text-white mb-4">{t("largerSystemOptions")}</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                {comparisonKws.map((kw) => {
                  const metrics = calculateSystemMetrics(kw);
                  const isSelected = kw === activeKw;
                  return (
                    <div 
                      key={kw} 
                      onClick={() => setSelectedKwOverride(kw)}
                      className={`min-w-[240px] cursor-pointer snap-center glass-panel p-5 rounded-3xl border transition-all ${isSelected ? 'border-amber shadow-[0_0_20px_rgba(255,191,0,0.2)] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-outfit text-xl font-bold text-white">{kw} {t("kw")}</span>
                        {kw === recommendedKw && <span className="text-[10px] bg-amber/20 text-amber px-2 py-1 rounded-full uppercase tracking-wider font-bold">Rec</span>}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t("estCost")}</span>
                          <span className="text-white font-medium">{formatCurrency(metrics.cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t("monthlySavings")}</span>
                          <span className="text-green-400 font-medium">+{formatCurrency(metrics.monthlySavings)}</span>
                        </div>
                        {metrics.exportIncome > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">{t("monthlyExport")}</span>
                            <span className="text-amber font-medium">+{formatCurrency(metrics.exportIncome)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t("paybackPeriod")}</span>
                          <span className="text-white font-medium">{metrics.payback.toFixed(1)} {t("years")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-slate-500 max-w-2xl mx-auto pt-4 border-t border-white/5">
              These estimates are based on configurable assumptions and typical operating conditions. Final system sizing and financial projections will be confirmed during the free site survey.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

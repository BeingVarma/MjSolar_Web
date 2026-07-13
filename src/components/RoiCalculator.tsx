"use client";

import { useState, useMemo } from "react";
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
  };

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

  // Subsidy Calculation (Simplified)
  const subsidyPerKw = isCommercial ? config.subsidies.subsidyPerKwCom : config.subsidies.subsidyPerKwRes;
  const maxSubsidyKw = isCommercial ? config.subsidies.maxSubsidyKwCom : config.subsidies.maxSubsidyKwRes;
  const eligibleSubsidyKw = Math.min(recommendedKw, maxSubsidyKw);
  const totalSubsidy = eligibleSubsidyKw * subsidyPerKw;

  const calculateSystemMetrics = (kw: number) => {
    const cost = (kw * costPerKw) - (Math.min(kw, maxSubsidyKw) * subsidyPerKw);
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

    // Lifetime (25 years with degradation)
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
      lifetimeSavings += yearSavings;

      currentGen = currentGen * (1 - config.assumptions.degradationRate);
      currentTariff = currentTariff * (1 + config.assumptions.inflationRate);
    }

    return { cost, monthlyGen, newBill, exportIncome, monthlySavings, annualSavings, payback, lifetimeSavings };
  };

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
    let cumulative = -recommendedMetrics.cost;
    let currentTariff = tariff;
    let currentGen = recommendedMetrics.monthlyGen * 12;
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
      cumulative += yearSavings;

      data.push({ year, cashFlow: Math.round(cumulative) });

      currentGen = currentGen * (1 - config.assumptions.degradationRate);
      currentTariff = currentTariff * (1 + config.assumptions.inflationRate);
    }
    return data;
  }, [recommendedMetrics.cost, recommendedMetrics.monthlyGen, monthlyUnits, tariff, exportTariff, config.assumptions]);

  return (
    <section id="calculator" className="py-24 relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-solar/5 via-obsidian to-obsidian" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-4xl md:text-6xl font-bold text-white mb-6">
            {t("smartCalcTitle")}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t("smartCalcSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Inputs (30 Seconds) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-[2rem] border-rose/20">
              <div className="flex bg-white/5 p-1 rounded-full w-full mb-8">
                <button
                  onClick={() => switchMode("res")}
                  className={`flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-full font-bold transition-all ${!isCommercial ? "bg-amber text-obsidian shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  <Home size={18} /> {t("resMode")}
                </button>
                <button
                  onClick={() => switchMode("com")}
                  className={`flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-full font-bold transition-all ${isCommercial ? "bg-solar text-obsidian shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  <Building2 size={18} /> {t("comMode")}
                </button>
              </div>

              <div className="space-y-6">
                {/* Monthly Bill */}
                <div>
                  <label className="block text-slate-300 font-medium mb-3 flex justify-between">
                    {t("monthlyBill")}
                    <span className="text-amber font-bold text-xl">{formatCurrency(bill)}</span>
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
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                    <span>{formatCurrency(minBill)}</span>
                    <span>{formatCurrency(maxBill)}</span>
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">{t("state")}</label>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber appearance-none">
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                    <option value="MH">Maharashtra</option>
                    <option value="DL">Delhi</option>
                    <option value="KA">Karnataka</option>
                  </select>
                </div>

                {/* Roof Type */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">{t("roofType")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["roofRcc", "roofMetal", "roofTile", "roofOther"].map(r => (
                      <button 
                        key={r} 
                        onClick={() => setRoofType(r)}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors border ${roofType === r ? 'bg-amber/20 border-amber text-amber' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
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
                        <label className="block text-slate-300 font-medium mb-2">{t("typeBusiness")}</label>
                        <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber appearance-none">
                          <option value="manufacturing">Manufacturing / Factory</option>
                          <option value="office">Corporate Office</option>
                          <option value="retail">Retail / Mall</option>
                          <option value="warehouse">Warehouse</option>
                          <option value="hospitality">Hospitality / Hotel</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-2">{t("operatingDays")} ({operatingDays})</label>
                        <input type="range" min="5" max="31" value={operatingDays} onChange={(e) => setOperatingDays(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-solar" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Environment Impact */}
            <div className="glass-panel p-6 rounded-[2rem] border-white/10 space-y-4">
              <h3 className="text-lg font-outfit font-bold text-white mb-2">{t("envImpact")}</h3>
              <div className="flex items-center gap-4 text-slate-300">
                <Leaf className="text-green-400" size={24} />
                <div>
                  <div className="text-2xl font-bold text-white">{Math.round(recommendedKw * 25.5)}</div>
                  <div className="text-xs uppercase tracking-wide">{t("treesSaved")}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <Factory className="text-rose" size={24} />
                <div>
                  <div className="text-2xl font-bold text-white">{Math.round(recommendedKw * 1.5)} {t("tons")}</div>
                  <div className="text-xs uppercase tracking-wide">{t("co2Reduction")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Output & Recommendations */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Recommended System Card */}
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-r from-solar via-amber to-rose overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="bg-obsidian/95 backdrop-blur-xl p-8 md:p-10 rounded-[2.4rem] relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                  <div>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-amber/20 text-amber font-bold text-sm tracking-wide uppercase mb-4 border border-amber/30 shadow-[0_0_15px_rgba(255,191,0,0.3)]">
                      ✨ {t("recommendedForYou")}
                    </div>
                    <div className="font-outfit text-6xl font-bold text-white mb-2 flex items-baseline gap-2">
                      {recommendedKw} <span className="text-2xl text-slate-400">{t("kw")}</span>
                    </div>
                    <p className="text-slate-400">{t("solarCapacity")}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-3xl font-bold text-white mb-1">{formatCurrency(recommendedMetrics.cost)}</div>
                    <p className="text-slate-400 text-sm uppercase tracking-wide">{t("netInvestment")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div>
                    <p className="text-slate-400 text-xs uppercase mb-1">{t("monthlySavings")}</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(recommendedMetrics.monthlySavings)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase mb-1">{t("paybackPeriod")}</p>
                    <p className="text-xl font-bold text-amber">{recommendedMetrics.payback.toFixed(1)} {t("years")}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase mb-1">{t("lifetimeSavings")}</p>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(recommendedMetrics.lifetimeSavings)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase mb-1">{t("warranty")}</p>
                    <p className="text-xl font-bold text-white">{config.warranty.panels} {t("years")}</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-white text-obsidian font-bold rounded-2xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] text-lg flex items-center justify-center gap-2">
                  <Zap size={20} className="text-amber" /> {t("getSiteSurvey")}
                </button>
              </div>
            </div>

            {/* Financial Projection Chart */}
            <div className="glass-panel p-6 rounded-[2rem] border-white/10">
              <h3 className="text-xl font-outfit font-bold text-white mb-6 pl-2">{t("financialProjection")}</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffbf00" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffbf00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="year" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickMargin={10} axisLine={false} />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{fill: '#94a3b8'}} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(val) => `₹${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: any) => [formatCurrency(Number(val)), t("monthlyCashFlow" as any)]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <ReferenceLine y={0} stroke="#ff6000" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="cashFlow" stroke="#ffbf00" strokeWidth={3} fillOpacity={1} fill="url(#colorCashFlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Cash Flow Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-[2rem] border-white/10 flex flex-col justify-center">
                <h4 className="text-sm uppercase tracking-wide text-slate-400 mb-6">{t("currentBill")}</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center text-rose">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{formatCurrency(bill)}</div>
                    <div className="text-sm text-rose">Every Month</div>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] border-white/10 flex flex-col justify-center bg-gradient-to-br from-white/5 to-amber/5">
                <h4 className="text-sm uppercase tracking-wide text-slate-400 mb-6">{t("afterSolar")}</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Battery size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{formatCurrency(recommendedMetrics.newBill)}</div>
                    <div className="text-sm text-green-400">{t("billAfter")}</div>
                  </div>
                </div>
                {recommendedMetrics.exportIncome > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                    <span className="text-slate-400">{t("electricityCredit")}</span>
                    <span className="text-amber font-bold">+{formatCurrency(recommendedMetrics.exportIncome)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Larger System Options (Upsell) */}
            <div>
              <h3 className="text-xl font-outfit font-bold text-white mb-6">{t("largerSystemOptions")}</h3>
              <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar snap-x">
                {comparisonKws.map((kw) => {
                  const metrics = calculateSystemMetrics(kw);
                  return (
                    <div key={kw} className={`min-w-[280px] snap-center glass-panel p-6 rounded-[2rem] border ${kw === recommendedKw ? 'border-amber/50' : 'border-white/10'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-outfit text-2xl font-bold text-white">{kw} {t("kw")}</span>
                        {kw === recommendedKw && <span className="text-xs bg-amber/20 text-amber px-2 py-1 rounded-full uppercase">Rec</span>}
                      </div>
                      <div className="space-y-3 text-sm">
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

          </div>
        </div>
      </div>
    </section>
  );
}

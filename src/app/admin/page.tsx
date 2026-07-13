"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useI18n } from "@/context/I18nContext";
import { CheckCircle2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useI18n();

  const { config, updateConfig } = useAdminConfig();
  const [localConfig, setLocalConfig] = useState(config);
  
  const [activeTab, setActiveTab] = useState<"roi" | "pricing" | "assumptions" | "subsidies" | "dashboard" | "socials">("roi");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    
    if (sanitizedPassword === "mjsolar2026") {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSave = () => {
    updateConfig(localConfig);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateNestedConfig = (section: keyof typeof localConfig, key: string, value: number | string) => {
    setLocalConfig({
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [key]: value
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 md:p-12 rounded-[2rem] w-full max-w-md relative z-10 border-rose/30"
        >
          <div className="text-center mb-8">
            <h1 className="font-outfit text-3xl font-bold text-white mb-2">{t("adminPortal")}</h1>
            <p className="text-slate-400">{t("adminSub")}</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                maxLength={20}
                onChange={(e) => setPassword(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all`}
              />
              {error && <p className="text-red-400 text-xs mt-2">Incorrect password. Try again.</p>}
            </div>
            
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-solar to-amber rounded-xl text-obsidian font-bold hover:shadow-[0_0_20px_rgba(255,96,0,0.4)] transition-all">
              {t("authBtn")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-slate-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> {t("liveSite")}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const TABS = [
    { id: "roi", label: "Calculator Ranges" },
    { id: "pricing", label: "Pricing & Subsidy" },
    { id: "assumptions", label: "Assumptions" },
    { id: "dashboard", label: "Dashboard Metrics" },
    { id: "socials", label: "Social Links" },
  ] as const;

  return (
    <div className="min-h-screen bg-obsidian text-slate-300 p-6 md:p-12 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-solar/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-white mb-2">{t("ctrlPanel")}</h1>
            <p className="text-slate-400">{t("ctrlSub")}</p>
          </div>
          <Link href="/" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-medium flex items-center gap-2">
            <ArrowLeft size={16} /> {t("liveSite")}
          </Link>
        </div>

        <div className="glass-panel rounded-[2rem] overflow-hidden border-white/10">
          <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-8 py-4 font-medium uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-white/10 text-white border-b-2 border-solar" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {activeTab === "roi" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-rose">Residential Limits</h3>
                      {[
                        { key: "resMin", label: "Minimum Bill (₹)" },
                        { key: "resMax", label: "Maximum Bill (₹)" },
                        { key: "resDefault", label: "Default Bill (₹)" },
                        { key: "resStep", label: "Slider Step (₹)" }
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-medium text-slate-400 uppercase mb-2">{f.label}</label>
                          <input type="number" value={(localConfig.roi as Record<string, number>)[f.key]} onChange={e => updateNestedConfig("roi", f.key, Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-solar">Commercial Limits</h3>
                      {[
                        { key: "comMin", label: "Minimum Bill (₹)" },
                        { key: "comMax", label: "Maximum Bill (₹)" },
                        { key: "comDefault", label: "Default Bill (₹)" },
                        { key: "comStep", label: "Slider Step (₹)" }
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-medium text-slate-400 uppercase mb-2">{f.label}</label>
                          <input type="number" value={(localConfig.roi as Record<string, number>)[f.key]} onChange={e => updateNestedConfig("roi", f.key, Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-rose">Installation Cost</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Cost per kW (Residential) ₹</label>
                        <input type="number" value={localConfig.pricing.costPerKwRes} onChange={e => updateNestedConfig("pricing", "costPerKwRes", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Cost per kW (Commercial) ₹</label>
                        <input type="number" value={localConfig.pricing.costPerKwCom} onChange={e => updateNestedConfig("pricing", "costPerKwCom", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-solar">Subsidies</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Subsidy per kW (Res) ₹</label>
                        <input type="number" value={localConfig.subsidies.subsidyPerKwRes} onChange={e => updateNestedConfig("subsidies", "subsidyPerKwRes", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Max Subsidy kW (Res)</label>
                        <input type="number" value={localConfig.subsidies.maxSubsidyKwRes} onChange={e => updateNestedConfig("subsidies", "maxSubsidyKwRes", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Subsidy per kW (Com) ₹</label>
                        <input type="number" value={localConfig.subsidies.subsidyPerKwCom} onChange={e => updateNestedConfig("subsidies", "subsidyPerKwCom", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "assumptions" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-rose">Financial Assumptions</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Electricity Tariff (Res) ₹/Unit</label>
                        <input type="number" step="0.1" value={localConfig.assumptions.tariffRes} onChange={e => updateNestedConfig("assumptions", "tariffRes", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Electricity Tariff (Com) ₹/Unit</label>
                        <input type="number" step="0.1" value={localConfig.assumptions.tariffCom} onChange={e => updateNestedConfig("assumptions", "tariffCom", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Export Tariff ₹/Unit</label>
                        <input type="number" step="0.1" value={localConfig.assumptions.exportTariff} onChange={e => updateNestedConfig("assumptions", "exportTariff", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Tariff Inflation Rate (Decimal e.g., 0.05)</label>
                        <input type="number" step="0.01" value={localConfig.assumptions.inflationRate} onChange={e => updateNestedConfig("assumptions", "inflationRate", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-solar">Technical Assumptions</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Generation per kW (Units/Month)</label>
                        <input type="number" value={localConfig.assumptions.generationPerKw} onChange={e => updateNestedConfig("assumptions", "generationPerKw", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Panel Degradation Rate (Decimal e.g., 0.005)</label>
                        <input type="number" step="0.001" value={localConfig.assumptions.degradationRate} onChange={e => updateNestedConfig("assumptions", "degradationRate", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Panel Warranty (Years)</label>
                        <input type="number" value={localConfig.warranty.panels} onChange={e => updateNestedConfig("warranty", "panels", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Inverter Warranty (Years)</label>
                        <input type="number" value={localConfig.warranty.inverter} onChange={e => updateNestedConfig("warranty", "inverter", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Maintenance Cost (₹/kW/Year)</label>
                        <input type="number" value={localConfig.assumptions.maintenanceCostPerKwYear} onChange={e => updateNestedConfig("assumptions", "maintenanceCostPerKwYear", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Inverter Replacement Year</label>
                        <input type="number" value={localConfig.assumptions.inverterReplacementYear} onChange={e => updateNestedConfig("assumptions", "inverterReplacementYear", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Inverter Replacement Cost (₹/kW)</label>
                        <input type="number" value={localConfig.assumptions.inverterReplacementCostPerKw} onChange={e => updateNestedConfig("assumptions", "inverterReplacementCostPerKw", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "dashboard" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-rose">Home Simulation</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Total Saved Today Base (₹)</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.homeMultiplier} onChange={e => updateNestedConfig("dashboard", "homeMultiplier", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">CO2 Offset Tons</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.co2Home} onChange={e => updateNestedConfig("dashboard", "co2Home", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-solar">Warehouse Simulation</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Total Saved Today Base (₹)</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.warehouseMultiplier} onChange={e => updateNestedConfig("dashboard", "warehouseMultiplier", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">CO2 Offset Tons</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.co2Warehouse} onChange={e => updateNestedConfig("dashboard", "co2Warehouse", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "socials" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">X (Twitter) URL</label>
                        <input type="url" value={localConfig.socials.x} onChange={e => updateNestedConfig("socials", "x", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">LinkedIn URL</label>
                        <input type="url" value={localConfig.socials.linkedin} onChange={e => updateNestedConfig("socials", "linkedin", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Facebook URL</label>
                        <input type="url" value={localConfig.socials.facebook} onChange={e => updateNestedConfig("socials", "facebook", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Instagram URL</label>
                        <input type="url" value={localConfig.socials.instagram} onChange={e => updateNestedConfig("socials", "instagram", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose outline-none" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-solar to-amber text-obsidian rounded-xl font-bold hover:scale-105 transition-transform"
              >
                <Save size={18} /> {t("publish")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 font-medium"
          >
            <CheckCircle2 size={24} />
            Configuration Updated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

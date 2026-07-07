"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { CheckCircle2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  const { config, updateConfig } = useAdminConfig();
  const [localConfig, setLocalConfig] = useState(config);
  
  const [activeTab, setActiveTab] = useState<"roi" | "dashboard" | "socials">("roi");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mjsolar2026") {
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
            <h1 className="font-outfit text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Secure access required.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all`}
              />
              {error && <p className="text-red-400 text-xs mt-2">Incorrect password. Try again.</p>}
            </div>
            
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-solar to-amber rounded-xl text-obsidian font-bold hover:shadow-[0_0_20px_rgba(255,96,0,0.4)] transition-all">
              Authenticate
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-slate-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Return to Main Site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-300 p-6 md:p-12 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-solar/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-white mb-2">Control Panel</h1>
            <p className="text-slate-400">Manage real-time frontend parameters globally.</p>
          </div>
          <Link href="/" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-medium flex items-center gap-2">
            <ArrowLeft size={16} /> Live Site
          </Link>
        </div>

        <div className="glass-panel rounded-[2rem] overflow-hidden border-white/10">
          <div className="flex border-b border-white/10 overflow-x-auto">
            {(["roi", "dashboard", "socials"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab ? "bg-white/10 text-white border-b-2 border-solar" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {tab === "roi" ? "Calculator Config" : tab === "dashboard" ? "Dashboard Metrics" : "Social Links"}
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
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Minimum Bill (₹)</label>
                        <input type="number" value={localConfig.roi.resMin} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, resMin: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Maximum Bill (₹)</label>
                        <input type="number" value={localConfig.roi.resMax} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, resMax: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Default Bill (₹)</label>
                        <input type="number" value={localConfig.roi.resDefault} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, resDefault: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Slider Step (₹)</label>
                        <input type="number" value={localConfig.roi.resStep} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, resStep: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-solar">Commercial Limits</h3>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Minimum Bill (₹)</label>
                        <input type="number" value={localConfig.roi.comMin} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, comMin: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Maximum Bill (₹)</label>
                        <input type="number" value={localConfig.roi.comMax} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, comMax: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Default Bill (₹)</label>
                        <input type="number" value={localConfig.roi.comDefault} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, comDefault: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Slider Step (₹)</label>
                        <input type="number" value={localConfig.roi.comStep} onChange={e => setLocalConfig({...localConfig, roi: {...localConfig.roi, comStep: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
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
                        <input type="number" step="0.1" value={localConfig.dashboard.homeMultiplier} onChange={e => setLocalConfig({...localConfig, dashboard: {...localConfig.dashboard, homeMultiplier: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">CO2 Offset Tons</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.co2Home} onChange={e => setLocalConfig({...localConfig, dashboard: {...localConfig.dashboard, co2Home: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-outfit font-bold text-white mb-4 text-solar">Warehouse Simulation</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Total Saved Today Base (₹)</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.warehouseMultiplier} onChange={e => setLocalConfig({...localConfig, dashboard: {...localConfig.dashboard, warehouseMultiplier: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">CO2 Offset Tons</label>
                        <input type="number" step="0.1" value={localConfig.dashboard.co2Warehouse} onChange={e => setLocalConfig({...localConfig, dashboard: {...localConfig.dashboard, co2Warehouse: Number(e.target.value)}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "socials" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">X (Twitter) URL</label>
                        <input type="url" required value={localConfig.socials.x} onChange={e => setLocalConfig({...localConfig, socials: {...localConfig.socials, x: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">LinkedIn URL</label>
                        <input type="url" required value={localConfig.socials.linkedin} onChange={e => setLocalConfig({...localConfig, socials: {...localConfig.socials, linkedin: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Facebook URL</label>
                        <input type="url" required value={localConfig.socials.facebook} onChange={e => setLocalConfig({...localConfig, socials: {...localConfig.socials, facebook: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Instagram URL</label>
                        <input type="url" required value={localConfig.socials.instagram} onChange={e => setLocalConfig({...localConfig, socials: {...localConfig.socials, instagram: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-rose focus:ring-1 focus:ring-rose outline-none" />
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
                <Save size={18} /> Publish Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
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

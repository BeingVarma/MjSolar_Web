"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AdminConfig {
  roi: {
    resMin: number;
    resMax: number;
    resStep: number;
    resDefault: number;
    comMin: number;
    comMax: number;
    comStep: number;
    comDefault: number;
  };
  dashboard: {
    homeMultiplier: number;
    warehouseMultiplier: number;
    co2Home: number;
    co2Warehouse: number;
  };
  socials: {
    x: string;
    linkedin: string;
    facebook: string;
    instagram: string;
  };
}

const defaultConfig: AdminConfig = {
  roi: {
    resMin: 500,
    resMax: 10000,
    resStep: 500,
    resDefault: 4000,
    comMin: 25000,
    comMax: 1000000,
    comStep: 5000,
    comDefault: 150000,
  },
  dashboard: {
    homeMultiplier: 120.5,
    warehouseMultiplier: 1550.8,
    co2Home: 14.2,
    co2Warehouse: 186.5,
  },
  socials: {
    x: "https://x.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
};

interface AdminConfigContextType {
  config: AdminConfig;
  updateConfig: (newConfig: AdminConfig) => void;
}

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

export function AdminConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AdminConfig>(defaultConfig);

  return (
    <AdminConfigContext.Provider value={{ config, updateConfig: setConfig }}>
      {children}
    </AdminConfigContext.Provider>
  );
}

export function useAdminConfig() {
  const context = useContext(AdminConfigContext);
  if (!context) {
    throw new Error("useAdminConfig must be used within an AdminConfigProvider");
  }
  return context;
}

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
  pricing: {
    costPerKwRes: number;
    costPerKwCom: number;
  };
  assumptions: {
    tariffRes: number; // ₹ per unit
    tariffCom: number;
    exportTariff: number; // ₹ per unit exported
    generationPerKw: number; // units per kW per month
    degradationRate: number; // % loss per year
    inflationRate: number; // % electricity price increase per year
    maintenanceCostPerKwYear: number; // ₹ per kW per year
    inverterReplacementYear: number; // year
    inverterReplacementCostPerKw: number; // ₹ per kW
  };
  subsidies: {
    subsidyPerKwRes: number; // ₹ per kW
    maxSubsidyKwRes: number; // max kW eligible
    subsidyPerKwCom: number;
    maxSubsidyKwCom: number;
  };
  warranty: {
    panels: number; // years
    inverter: number; // years
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
    resMax: 20000,
    resStep: 500,
    resDefault: 4000,
    comMin: 20000,
    comMax: 1000000,
    comStep: 5000,
    comDefault: 150000,
  },
  pricing: {
    costPerKwRes: 65000,
    costPerKwCom: 55000,
  },
  assumptions: {
    tariffRes: 8.5,
    tariffCom: 10.5,
    exportTariff: 3.5,
    generationPerKw: 120,
    degradationRate: 0.005,
    inflationRate: 0.05,
    maintenanceCostPerKwYear: 500,
    inverterReplacementYear: 10,
    inverterReplacementCostPerKw: 10000,
  },
  subsidies: {
    subsidyPerKwRes: 15000, // Roughly standard residential subsidy up to 3kW
    maxSubsidyKwRes: 3,
    subsidyPerKwCom: 0,
    maxSubsidyKwCom: 0,
  },
  warranty: {
    panels: 25,
    inverter: 10,
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

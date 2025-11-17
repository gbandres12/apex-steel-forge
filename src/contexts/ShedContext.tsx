import { createContext, useContext, useState, ReactNode } from "react";

export interface ShedConfig {
  length: number; // Comprimento (m)
  width: number; // Largura (m)
  height: number; // Pé-direito (m)
  showWalls: boolean;
  roofType: "comum" | "termoacustica";
  hasMezzanine: boolean;
  mezzanineWidth: number;
  mezzanineLength: number;
  city: string;
  terrainLevel: "sim" | "nao";
  paymentType: "avista" | "50-50" | "30-70";
  observations: string;
}

interface ShedContextType {
  config: ShedConfig;
  updateConfig: (updates: Partial<ShedConfig>) => void;
}

const defaultConfig: ShedConfig = {
  length: 20,
  width: 10,
  height: 6,
  showWalls: true,
  roofType: "comum",
  hasMezzanine: false,
  mezzanineWidth: 5,
  mezzanineLength: 10,
  city: "cuiaba",
  terrainLevel: "sim",
  paymentType: "50-50",
  observations: "",
};

const ShedContext = createContext<ShedContextType | undefined>(undefined);

export const ShedProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ShedConfig>(defaultConfig);

  const updateConfig = (updates: Partial<ShedConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ShedContext.Provider value={{ config, updateConfig }}>
      {children}
    </ShedContext.Provider>
  );
};

export const useShed = () => {
  const context = useContext(ShedContext);
  if (!context) {
    throw new Error("useShed must be used within ShedProvider");
  }
  return context;
};

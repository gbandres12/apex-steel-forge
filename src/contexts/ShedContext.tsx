import { createContext, useContext, useState, ReactNode } from "react";

export interface ShedConfig {
  length: number; // Comprimento (m) - múltiplos de 6
  width: number; // Largura (m)
  height: number; // Pé-direito (m) - 6, 8, 10, 12
  showWalls: boolean;
  roofType: "metalica" | "termoacustica";
  hasMezzanine: boolean;
  mezzanineWidth: number;
  mezzanineLength: number;
  city: string;
  hasTerrain: "sim" | "nao";
  needsEarthworks: "sim" | "nao";
  paymentType: "30-entrada" | "5-25-medicao";
  observations: string;
}

interface ShedContextType {
  config: ShedConfig;
  updateConfig: (updates: Partial<ShedConfig>) => void;
}

const defaultConfig: ShedConfig = {
  length: 24, // Múltiplo de 6
  width: 10,
  height: 6,
  showWalls: true,
  roofType: "metalica",
  hasMezzanine: false,
  mezzanineWidth: 5,
  mezzanineLength: 10,
  city: "santarem",
  hasTerrain: "nao",
  needsEarthworks: "nao",
  paymentType: "30-entrada",
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

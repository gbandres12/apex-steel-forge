import { createContext, useContext, useState, ReactNode } from "react";

export type StructureCategory = "comercial" | "industrial";
export type VaoLivre = 10 | 14 | 16 | 20;
export type PillarType = "com-pilar" | "sem-pilar";
export type Peireito = 6 | 7;
export type RoofTileType = "simples" | "termoacustica";
export type ClosureType = "sem-fechamento" | "com-fechamento";
export type ClosureCoverage = "parcial" | "total";
export type ServiceType = "fabricado" | "fabricado-montado";

export interface ShedConfig {
  // Tipo de estrutura
  structureCategory: StructureCategory;

  // Comercial - Dimensões
  vaoLivre: VaoLivre;
  profundidade: number; // múltiplos de 6, 6 a 120

  // Pilar
  pillarType: PillarType;
  peireito: Peireito; // só quando com-pilar

  // Telhado cobertura
  roofTileType: RoofTileType;

  // Fechamento lateral
  closureType: ClosureType;
  closureCoverage: ClosureCoverage; // só quando com-fechamento

  // Portão
  gateWidth: number;
  gateHeight: number;

  // Telha do fechamento
  closureTileType: RoofTileType;

  // Fabricação / Montagem
  serviceType: ServiceType;

  // Logística
  distanceKm: number; // distância em km de Santarém

  // Industrial
  industrialName: string;
  industrialCnpj: string;
  industrialEmail: string;
  industrialPhone: string;
  industrialUseType: string;
}

interface ShedContextType {
  config: ShedConfig;
  updateConfig: (updates: Partial<ShedConfig>) => void;
}

const defaultConfig: ShedConfig = {
  structureCategory: "comercial",

  vaoLivre: 10,
  profundidade: 24,

  pillarType: "sem-pilar",
  peireito: 6,

  roofTileType: "simples",

  closureType: "sem-fechamento",
  closureCoverage: "parcial",

  gateWidth: 4,
  gateHeight: 4,

  closureTileType: "simples",

  serviceType: "fabricado",

  distanceKm: 0,

  industrialName: "",
  industrialCnpj: "",
  industrialEmail: "",
  industrialPhone: "",
  industrialUseType: "",
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

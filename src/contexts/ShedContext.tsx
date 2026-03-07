import { createContext, useContext, useState, ReactNode } from "react";

export type StructureCategory = "comercial" | "industrial";
export type VaoLivre = 10 | 14 | 16 | 20;
export type PillarType = "com-pilar" | "sem-pilar";
export type Peireito = 6 | 7;
export type RoofTileType = "simples" | "termoacustica";
/** "sem-fechamento" | "parcial" = 80% da altura | "total" = 100% da altura */
export type ClosureOption = "sem-fechamento" | "parcial" | "total";
export type ServiceType = "fabricado" | "fabricado-montado";
export type PaymentType = "financiado" | "medicoes";

export interface ShedConfig {
  // ── Categoria ─────────────────────────────────────────────────────────────
  structureCategory: StructureCategory;

  // ── Comercial — Dimensões ─────────────────────────────────────────────────
  vaoLivre: VaoLivre;
  profundidade: number; // múltiplos de 6 m, de 6 a 120 m

  // ── Pilar ─────────────────────────────────────────────────────────────────
  pillarType: PillarType;
  peireito: Peireito; // só relevante quando com-pilar

  // ── Cobertura ─────────────────────────────────────────────────────────────
  roofTileType: RoofTileType;

  // ── Fechamento lateral (3 opções diretas) ─────────────────────────────────
  closureOption: ClosureOption;

  // ── Portão (só quando há fechamento) ─────────────────────────────────────
  gateWidth: number;
  gateHeight: number;

  // ── Telha do fechamento ───────────────────────────────────────────────────
  closureTileType: RoofTileType;

  // ── Serviço ───────────────────────────────────────────────────────────────
  serviceType: ServiceType;

  // ── Logística ─────────────────────────────────────────────────────────────
  distanceKm: number; // km de Santarém — PA

  // ── Pagamento ─────────────────────────────────────────────────────────────
  paymentType: PaymentType;

  // ── Industrial ────────────────────────────────────────────────────────────
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

  closureOption: "sem-fechamento",

  gateWidth: 4,
  gateHeight: 4,

  closureTileType: "simples",

  serviceType: "fabricado",

  distanceKm: 0,

  paymentType: "medicoes",

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
  if (!context) throw new Error("useShed must be used within ShedProvider");
  return context;
};

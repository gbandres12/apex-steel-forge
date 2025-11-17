import { useShed } from "@/contexts/ShedContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

// Tabela de preços (valores ilustrativos)
const PRICING = {
  basePricePerM2: 450, // R$ por m² da estrutura
  roofComum: 85, // R$ por m² telha comum
  roofTermoacustica: 145, // R$ por m² telha termoacústica
  mezzaninePerM2: 380, // R$ por m² do mezanino
  freight: {
    cuiaba: 5000,
    "varzea-grande": 5500,
    rondonopolis: 8000,
    sinop: 12000,
    palmas: 15000,
    "porto-velho": 18000,
    "rio-branco": 22000,
  } as Record<string, number>,
  terrainPrepNao: 8000, // Custo adicional se terreno não nivelado
  paymentDiscount: {
    avista: 0.05, // 5% desconto à vista
    "50-50": 0,
    "30-70": 0,
  } as Record<string, number>,
};

export const SummaryCard = () => {
  const { config } = useShed();

  // Cálculos
  const totalArea = config.length * config.width;
  const structureCost = totalArea * PRICING.basePricePerM2;
  
  const roofPrice = config.roofType === "termoacustica" 
    ? PRICING.roofTermoacustica 
    : PRICING.roofComum;
  const roofCost = totalArea * roofPrice;

  const mezzanineArea = config.hasMezzanine 
    ? config.mezzanineWidth * config.mezzanineLength 
    : 0;
  const mezzanineCost = mezzanineArea * PRICING.mezzaninePerM2;

  const freightCost = PRICING.freight[config.city] || 0;
  const terrainCost = config.terrainLevel === "nao" ? PRICING.terrainPrepNao : 0;

  const subtotal = structureCost + roofCost + mezzanineCost + freightCost + terrainCost;
  const discount = subtotal * PRICING.paymentDiscount[config.paymentType];
  const totalCost = subtotal - discount;

  const downPayment = config.paymentType === "avista" 
    ? totalCost 
    : config.paymentType === "50-50"
    ? totalCost * 0.5
    : totalCost * 0.3;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleRequestQuote = () => {
    toast.success("Orçamento solicitado! Nossa equipe entrará em contato em breve.");
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="bg-gradient-glow text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Resumo do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Área */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Área Total</span>
            <span className="font-bold text-foreground">{totalArea.toFixed(0)} m²</span>
          </div>
          {config.hasMezzanine && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Área do Mezanino</span>
              <span className="font-bold text-foreground">{mezzanineArea.toFixed(0)} m²</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Custos Detalhados */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estrutura Metálica</span>
            <span className="text-foreground">{formatCurrency(structureCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Cobertura ({config.roofType === "termoacustica" ? "Termoacústica" : "Comum"})
            </span>
            <span className="text-foreground">{formatCurrency(roofCost)}</span>
          </div>
          {config.hasMezzanine && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mezanino</span>
              <span className="text-foreground">{formatCurrency(mezzanineCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Frete</span>
            <span className="text-foreground">{formatCurrency(freightCost)}</span>
          </div>
          {config.terrainLevel === "nao" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Preparação do Terreno</span>
              <span className="text-foreground">{formatCurrency(terrainCost)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Subtotal e Desconto */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Desconto (À vista)</span>
              <span className="text-green-600">- {formatCurrency(discount)}</span>
            </div>
          )}
        </div>

        <Separator className="bg-primary/30" />

        {/* Total */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">Total Estimado</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totalCost)}</span>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Entrada</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(downPayment)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {config.paymentType === "avista" 
                ? "Pagamento à vista" 
                : config.paymentType === "50-50"
                ? "50% na entrada, 50% na entrega"
                : "30% na entrada, 70% na entrega"}
            </p>
          </div>
        </div>

        <Button onClick={handleRequestQuote} className="w-full shadow-glow mt-4">
          Solicitar Orçamento Completo
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          * Valores estimados. Orçamento final pode variar conforme especificações técnicas.
        </p>
      </CardContent>
    </Card>
  );
};

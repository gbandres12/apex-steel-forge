import { useShed } from "@/contexts/ShedContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

// Tabela de preços (valores reais)
const PRICING = {
  basePricePerM2: 450, // R$ por m² da estrutura base (altura 6m)
  heightAdditionalPerMeter: 70, // R$ 70 adicional por m² para cada metro acima de 6m
  roofMetalica: 40, // R$ por m² telha metálica comum
  roofTermoacustica: 130, // R$ por m² telha termoacústica
  mezzaninePerM2: 1450, // R$ por m² do mezanino
  freightPerKmPerTruck: 3.5, // R$ por km rodado por carreta
  distanceFromSantarem: {
    santarem: 0,
    belem: 800,
    manaus: 750,
    "porto-velho": 1800,
    "rio-branco": 2400,
    palmas: 1300,
    cuiaba: 1600,
  } as Record<string, number>,
};

export const SummaryCard = () => {
  const { config } = useShed();

  // Cálculos
  const totalArea = config.length * config.width;
  
  // Custo da estrutura com adicional por altura
  const heightAdditional = Math.max(0, config.height - 6) * PRICING.heightAdditionalPerMeter;
  const structurePricePerM2 = PRICING.basePricePerM2 + heightAdditional;
  const structureCost = totalArea * structurePricePerM2;
  
  // Custo da cobertura
  const roofPrice = config.roofType === "termoacustica" 
    ? PRICING.roofTermoacustica 
    : PRICING.roofMetalica;
  const roofCost = totalArea * roofPrice;

  // Custo do mezanino
  const mezzanineArea = config.hasMezzanine 
    ? config.mezzanineWidth * config.mezzanineLength 
    : 0;
  const mezzanineCost = mezzanineArea * PRICING.mezzaninePerM2;

  // Cálculo de frete baseado em distância e número de carretas
  const distance = PRICING.distanceFromSantarem[config.city] || 0;
  const trucksNeeded = Math.ceil(totalArea / 1000); // 1 carreta por 1000m²
  const freightCost = trucksNeeded * distance * PRICING.freightPerKmPerTruck;

  const subtotal = structureCost + roofCost + mezzanineCost + freightCost;
  const totalCost = subtotal;

  const downPayment = config.paymentType === "30-entrada" 
    ? totalCost * 0.3
    : totalCost * 0.05; // 5% inicial para condição especial

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleRequestQuote = () => {
    toast.success("Orçamento solicitado! Nossa equipe entrará em contato em breve.");
  };

  const generateWhatsAppMessage = () => {
    const message = `🏗️ *Orçamento Galpão Almeida Steel*

📐 *Dimensões:*
• Comprimento: ${config.length}m
• Largura: ${config.width}m  
• Altura: ${config.height}m
• Área Total: ${totalArea.toFixed(0)}m²

🏗️ *Especificações:*
• Cobertura: ${config.roofType === "termoacustica" ? "Telha Termoacústica" : "Telha Metálica 0.43mm"}
${config.hasMezzanine ? `• Mezanino: ${mezzanineArea.toFixed(0)}m² (${config.mezzanineWidth}m x ${config.mezzanineLength}m)` : "• Mezanino: Não"}

📍 *Localização:*
• Cidade: ${config.city}
${config.hasTerrain === "sim" ? "• Possui terreno: Sim" : "• Possui terreno: Não"}
${config.needsEarthworks === "sim" ? "• Necessita terraplanagem: Sim" : "• Necessita terraplanagem: Não"}

💰 *Resumo Financeiro:*
• Estrutura Metálica: ${formatCurrency(structureCost)}
• Cobertura: ${formatCurrency(roofCost)}
${config.hasMezzanine ? `• Mezanino: ${formatCurrency(mezzanineCost)}` : ""}
• Frete (${trucksNeeded} carreta${trucksNeeded > 1 ? "s" : ""}, ${distance}km): ${formatCurrency(freightCost)}
• *TOTAL ESTIMADO: ${formatCurrency(totalCost)}*
• Entrada (${config.paymentType === "30-entrada" ? "30%" : "5%"}): ${formatCurrency(downPayment)}

${config.observations ? `📝 *Observações:*\n${config.observations}\n\n` : ""}
Gostaria de um orçamento completo e mais informações!`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppShare = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5593991910861?text=${message}`;
    window.open(whatsappUrl, "_blank");
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
              Cobertura ({config.roofType === "termoacustica" ? "Termoacústica" : "Metálica 0.43mm"})
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
            <span className="text-muted-foreground">
              Frete ({trucksNeeded} carreta{trucksNeeded > 1 ? "s" : ""}, {distance}km)
            </span>
            <span className="text-foreground">{formatCurrency(freightCost)}</span>
          </div>
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
              {config.paymentType === "30-entrada" 
                ? "30% na entrada + restante por medição" 
                : "5% assinatura + 25% em 30 dias + restante por medição"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={handleWhatsAppShare} className="w-full shadow-glow bg-green-600 hover:bg-green-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar para WhatsApp
          </Button>
          <Button onClick={handleRequestQuote} variant="outline" className="w-full">
            Solicitar Orçamento Completo
          </Button>
        </div>

        <div className="bg-muted/30 p-3 rounded-lg mt-4">
          <p className="text-xs text-muted-foreground">
            <strong>Incluso:</strong> Estrutura metálica (pilares, tesouras, terças) + cobertura + montagem
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Não incluso:</strong> Fundação, piso, docas, paredes de fechamento, terraplanagem
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            * Valores estimados. Orçamento final pode variar conforme especificações técnicas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useShed } from "@/contexts/ShedContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calculator, Download, Send } from "lucide-react";
import { toast } from "sonner";

// ─── Tabela de preços ─────────────────────────────────────────────────────────
const PRICING = {
  estrutura: 180,            // R$/m² de planta
  pilar6m: 50,               // R$/m² quando pé-direito 6m
  pilar7m: 65,               // R$/m² quando pé-direito 7m
  telhaSimples: 45,          // R$/m²
  telhaTermoacustica: 135,   // R$/m²
  fechamentoEstrutura: 85,   // R$/m² de área de fechamento
  montagemEstrutura: 50,     // R$/m² de planta (fabricado+montado)
  montagemFechamento: 25,    // R$/m² de fechamento (fabricado+montado)
  mobilizacaoKmCarga: 18,    // R$/km por carga (cada 15t = 1 carga)
  pesoEstruturaM2: 12,       // kg por m² de planta
  pesoFechamentoM2: 7,       // kg por m² de fechamento
  maoDeObraPor600m2: 20000,  // R$ 20.000 a cada 600m² de planta
  raioIsencao: 60,           // km de Santarém sem cobrança de mobilização
} as const;

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

// ─── Linha de item ─────────────────────────────────────────────────────────────
function LineItem({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between items-start text-sm ${highlight ? "font-semibold" : ""}`}>
      <div>
        <span className={highlight ? "text-foreground" : "text-muted-foreground"}>{label}</span>
        {sub && <p className="text-xs text-muted-foreground/70 mt-0">{sub}</p>}
      </div>
      <span className={highlight ? "text-foreground" : "text-foreground/80"}>{value}</span>
    </div>
  );
}

export const SummaryCard = () => {
  const { config } = useShed();

  const isComercial = config.structureCategory === "comercial";
  const isMontado = config.serviceType === "fabricado-montado";
  const temFechamento = config.closureType === "com-fechamento";

  // ── Área de planta ───────────────────────────────────────────────────────────
  const areaPlanta = config.vaoLivre * config.profundidade;

  // ── Pé-direito efetivo ───────────────────────────────────────────────────────
  // Só existe quando com-pilar; caso sem-pilar não há pé-direito definido para
  // fechamento, então adotamos 6m como padrão visual.
  const pedireitoValor = config.pillarType === "com-pilar" ? config.peireito : 6;

  // ── Valor da estrutura ───────────────────────────────────────────────────────
  const valorEstrutura =
    areaPlanta * PRICING.estrutura +
    (config.pillarType === "com-pilar"
      ? areaPlanta * (pedireitoValor === 6 ? PRICING.pilar6m : PRICING.pilar7m)
      : 0);

  // ── Telhado (cobertura) ──────────────────────────────────────────────────────
  const precoTelha =
    config.roofTileType === "termoacustica"
      ? PRICING.telhaTermoacustica
      : PRICING.telhaSimples;
  const valorTelhado = areaPlanta * precoTelha;

  // ── Fechamento ───────────────────────────────────────────────────────────────
  const perimetro = 2 * config.vaoLivre + 2 * config.profundidade;
  const alturaFechamento =
    config.closureCoverage === "parcial"
      ? pedireitoValor * 0.8
      : pedireitoValor;
  const areaPortao = config.gateWidth * config.gateHeight;
  const areaFechamento = temFechamento
    ? Math.max(0, alturaFechamento * perimetro - areaPortao)
    : 0;

  const precoTelhaFechamento =
    config.closureTileType === "termoacustica"
      ? PRICING.telhaTermoacustica
      : PRICING.telhaSimples;

  const valorEstruturaFechamento = temFechamento
    ? areaFechamento * PRICING.fechamentoEstrutura
    : 0;
  const valorTelhaFechamento = temFechamento
    ? areaFechamento * precoTelhaFechamento
    : 0;
  const valorTotalFechamento = valorEstruturaFechamento + valorTelhaFechamento;

  // ── Montagem ─────────────────────────────────────────────────────────────────
  const valorMontagemEstrutura = isMontado ? areaPlanta * PRICING.montagemEstrutura : 0;
  const valorMontagemFechamento = isMontado && temFechamento
    ? areaFechamento * PRICING.montagemFechamento
    : 0;
  const valorMontagem = valorMontagemEstrutura + valorMontagemFechamento;

  // ── Mão de obra de montagem ───────────────────────────────────────────────────
  const valorMaoDeObra = isMontado
    ? Math.ceil(areaPlanta / 600) * PRICING.maoDeObraPor600m2
    : 0;

  // ── Mobilização ───────────────────────────────────────────────────────────────
  const pesoTotal =
    areaPlanta * PRICING.pesoEstruturaM2 +
    (temFechamento ? areaFechamento * PRICING.pesoFechamentoM2 : 0);
  const numCargas = Math.ceil(pesoTotal / 15000);
  const valorMobilizacao =
    config.distanceKm > PRICING.raioIsencao
      ? numCargas * config.distanceKm * PRICING.mobilizacaoKmCarga
      : 0;

  // ── Total ─────────────────────────────────────────────────────────────────────
  const valorTotal =
    valorEstrutura +
    valorTelhado +
    valorTotalFechamento +
    valorMontagem +
    valorMaoDeObra +
    valorMobilizacao;

  // ── WhatsApp ──────────────────────────────────────────────────────────────────
  const buildWhatsApp = () => {
    const msg = `🏗️ *Orçamento Galpão - Apex Steel Forge*

📐 *Dimensões:*
• Vão Livre: ${config.vaoLivre}m
• Profundidade: ${config.profundidade}m
• Área de Planta: ${areaPlanta} m²

🏗️ *Especificações:*
• Estrutura: ${config.pillarType === "com-pilar" ? `Com Pilar (pé-direito ${pedireitoValor}m)` : "Sem Pilar"}
• Cobertura: ${config.roofTileType === "termoacustica" ? "Termoacústica EPS 30mm" : "Telha Simples 0,43mm"}
• Fechamento: ${temFechamento ? `${config.closureCoverage === "parcial" ? "Parcial 80%" : "Total 100%"} — ${config.closureTileType === "termoacustica" ? "Termoacústica" : "Simples"}` : "Sem fechamento"}
• Serviço: ${isMontado ? "Fabricado + Montado" : "Somente Fabricado"}

💰 *Resumo Financeiro:*
• Estrutura: ${fmt(valorEstrutura)}
• Telhado: ${fmt(valorTelhado)}
${temFechamento ? `• Fechamento: ${fmt(valorTotalFechamento)}\n` : ""}${isMontado ? `• Montagem: ${fmt(valorMontagem)}\n• Mão de Obra: ${fmt(valorMaoDeObra)}\n` : ""}${valorMobilizacao > 0 ? `• Mobilização (${numCargas} carga${numCargas > 1 ? "s" : ""}, ${config.distanceKm}km): ${fmt(valorMobilizacao)}\n` : ""}
• *TOTAL ESTIMADO: ${fmt(valorTotal)}*

Gostaria de uma proposta detalhada!`;

    return `https://wa.me/5593991910861?text=${encodeURIComponent(msg)}`;
  };

  const handleWhatsApp = () => window.open(buildWhatsApp(), "_blank");

  const handleDownloadPDF = () => {
    toast.info("Gerando PDF...");
    setTimeout(() => {
      const content = `
ORÇAMENTO ESTIMADO - APEX STEEL FORGE
======================================

DIMENSÕES
-----------
Vão Livre:        ${config.vaoLivre}m
Profundidade:     ${config.profundidade}m
Área de Planta:   ${areaPlanta} m²

ESPECIFICAÇÕES
--------------
Estrutura:        ${config.pillarType === "com-pilar" ? `Com Pilar (pé-direito ${pedireitoValor}m)` : "Sem Pilar"}
Cobertura:        ${config.roofTileType === "termoacustica" ? "Termoacústica EPS 30mm" : "Telha Simples 0,43mm"}
Fechamento:       ${temFechamento ? `${config.closureCoverage === "parcial" ? "Parcial 80%" : "Total 100%"}` : "Sem fechamento"}
${temFechamento ? `Área Fechamento:  ${areaFechamento.toFixed(1)} m²\n` : ""}
Serviço:          ${isMontado ? "Fabricado + Montado" : "Somente Fabricado"}
Distância:        ${config.distanceKm} km de Santarém

RESUMO FINANCEIRO
-----------------
Estrutura:        ${fmt(valorEstrutura)}
Telhado:          ${fmt(valorTelhado)}
${temFechamento ? `Fechamento:       ${fmt(valorTotalFechamento)}\n` : ""}${isMontado ? `Montagem:         ${fmt(valorMontagem)}\nMão de Obra:      ${fmt(valorMaoDeObra)}\n` : ""}${valorMobilizacao > 0 ? `Mobilização:      ${fmt(valorMobilizacao)}\n` : ""}
TOTAL ESTIMADO: ${fmt(valorTotal)}

======================================
* Valores estimados. Orçamento final pode variar conforme especificações técnicas.
* Distância considerada de Santarém - PA.
`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orcamento-apex-steel.txt";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Orçamento exportado com sucesso!");
    }, 800);
  };

  const handleRequestQuote = () => {
    toast.success("Solicitação enviada! Nossa equipe entrará em contato em breve.", {
      duration: 5000,
    });
  };

  // ── Render Industrial ─────────────────────────────────────────────────────────
  if (!isComercial) {
    const allFilled =
      config.industrialName &&
      config.industrialEmail &&
      config.industrialPhone &&
      config.industrialUseType;

    const handleIndustrialSubmit = () => {
      if (!allFilled) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      toast.success(
        "Nosso setor comercial irá analisar sua necessidade e entrar em contato.",
        { duration: 7000 }
      );
    };

    return (
      <Card className="border-border bg-card">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="w-5 h-5" />
            Estrutura Industrial
          </CardTitle>
          <p className="text-sm text-white/80">Proposta personalizada</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estruturas industriais possuem requisitos específicos que exigem análise técnica detalhada. Após o envio do formulário, nossa equipe entrará em contato.
          </p>

          <div className="bg-muted/30 p-3 rounded-lg space-y-1 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> <span className="text-foreground font-medium">{config.industrialName || "—"}</span></p>
            <p><span className="text-muted-foreground">CNPJ:</span> <span className="text-foreground font-medium">{config.industrialCnpj || "—"}</span></p>
            <p><span className="text-muted-foreground">E-mail:</span> <span className="text-foreground font-medium">{config.industrialEmail || "—"}</span></p>
            <p><span className="text-muted-foreground">Telefone:</span> <span className="text-foreground font-medium">{config.industrialPhone || "—"}</span></p>
            <p><span className="text-muted-foreground">Tipo de uso:</span> <span className="text-foreground font-medium">{config.industrialUseType || "—"}</span></p>
          </div>

          <Button
            onClick={handleIndustrialSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar para Análise Comercial
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Render Comercial ──────────────────────────────────────────────────────────
  return (
    <Card className="border-border bg-card">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-primary-foreground">
          <Calculator className="w-5 h-5" />
          Resumo do Orçamento
        </CardTitle>
        <p className="text-sm text-primary-foreground/80">Atualizado em tempo real</p>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Dimensões */}
        <div className="bg-muted/30 rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Vão Livre</p>
            <p className="font-bold text-foreground">{config.vaoLivre}m</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Profundidade</p>
            <p className="font-bold text-foreground">{config.profundidade}m</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Área</p>
            <p className="font-bold text-primary">{areaPlanta} m²</p>
          </div>
        </div>

        {temFechamento && (
          <div className="bg-muted/20 rounded-lg p-3 grid grid-cols-2 gap-2 text-center text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Área Fechamento</p>
              <p className="font-bold text-foreground">{areaFechamento.toFixed(1)} m²</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Pé-direito</p>
              <p className="font-bold text-foreground">{pedireitoValor}m {config.closureCoverage === "parcial" ? "(×80%)" : ""}</p>
            </div>
          </div>
        )}

        <Separator />

        {/* Itens de custo */}
        <div className="space-y-2.5">
          <LineItem
            label="Estrutura Metálica"
            sub={`R$ 180/m²${config.pillarType === "com-pilar" ? ` + R$ ${pedireitoValor === 6 ? "50" : "65"}/m² (pilar)` : ""}`}
            value={fmt(valorEstrutura)}
          />
          <LineItem
            label={`Telhado (${config.roofTileType === "termoacustica" ? "Termoacústica" : "Simples"})`}
            sub={`R$ ${precoTelha}/m² × ${areaPlanta} m²`}
            value={fmt(valorTelhado)}
          />

          {temFechamento && (
            <>
              <LineItem
                label="Estrutura de Fechamento"
                sub={`R$ 85/m² × ${areaFechamento.toFixed(1)} m²`}
                value={fmt(valorEstruturaFechamento)}
              />
              <LineItem
                label={`Telha Fechamento (${config.closureTileType === "termoacustica" ? "Termoacústica" : "Simples"})`}
                sub={`R$ ${precoTelhaFechamento}/m² × ${areaFechamento.toFixed(1)} m²`}
                value={fmt(valorTelhaFechamento)}
              />
            </>
          )}

          {isMontado && (
            <>
              <LineItem
                label="Montagem (estrutura + fechamento)"
                sub={`R$ 50/m² planta${temFechamento ? " + R$ 25/m² fechamento" : ""}`}
                value={fmt(valorMontagem)}
              />
              <LineItem
                label="Mão de Obra de Montagem"
                sub={`R$ 20.000 × ${Math.ceil(areaPlanta / 600)} bloco(s) de 600m²`}
                value={fmt(valorMaoDeObra)}
              />
            </>
          )}

          {valorMobilizacao > 0 && (
            <LineItem
              label="Mobilização de Carga"
              sub={`${numCargas} carga${numCargas > 1 ? "s" : ""} × ${config.distanceKm} km × R$ 18/km`}
              value={fmt(valorMobilizacao)}
            />
          )}
        </div>

        <Separator className="bg-primary/20" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-foreground">Total Estimado</span>
          <span className="text-2xl font-bold text-primary">{fmt(valorTotal)}</span>
        </div>

        {/* Botões */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 shadow-lg font-semibold"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Solicitar via WhatsApp
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleDownloadPDF} variant="outline" className="w-full text-sm gap-1.5">
              <Download className="w-4 h-4" />
              Baixar Orçamento
            </Button>
            <Button onClick={handleRequestQuote} variant="outline" className="w-full text-sm gap-1.5">
              <Send className="w-4 h-4" />
              Proposta Detalhada
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
          <p><strong>Incluso:</strong> Estrutura metálica, cobertura{temFechamento ? ", fechamento" : ""}{isMontado ? ", montagem" : ""}.</p>
          <p><strong>Não incluso:</strong> Fundação, piso, terraplanagem, projetos executivos.</p>
          <p>* Mobilização cobrada apenas para obras fora de 60 km de Santarém - PA.</p>
          <p>* Valores estimados. Orçamento final conforme especificações técnicas.</p>
        </div>
      </CardContent>
    </Card>
  );
};

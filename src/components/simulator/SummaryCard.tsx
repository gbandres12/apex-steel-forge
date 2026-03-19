import { useShed } from "@/contexts/ShedContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calculator, Download, Send, MessageCircle, FileText } from "lucide-react";
import { toast } from "sonner";

// ─── Tabela de preços ─────────────────────────────────────────────────────────
const PRICING = {
  estrutura: 180,           // R$/m² de planta
  pilar6m: 50,              // R$/m² adicional pé-direito 6 m
  pilar7m: 65,              // R$/m² adicional pé-direito 7 m
  telhaSimples: 45,         // R$/m²
  telhaTermoacustica: 135,  // R$/m²
  fechamentoEstrutura: 85,  // R$/m² de área de fechamento
  montagemEstrutura: 50,    // R$/m² de planta
  montagemFechamento: 25,   // R$/m² de fechamento
  mobilizacaoKmCarga: 18,   // R$/km por carga
  pesoEstruturaM2: 12,      // kg/m² de planta
  pesoFechamentoM2: 7,      // kg/m² de fechamento
  maoDeObraPor600m2: 20_000,// R$ a cada 600 m²
  raioIsencao: 65,          // km de Santarém sem mobilização
  jurosMes: 0.025,          // 2,5 % a.m. (financiado)
} as const;

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtN = (v: number, decimals = 1) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// ─── Item de linha simples ────────────────────────────────────────────────────
function LineItem({
  label, value, sub, highlight,
}: {
  label: string; value: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between items-start gap-2 text-sm ${highlight ? "font-semibold" : ""}`}>
      <div className="flex-1 min-w-0">
        <span className={highlight ? "text-foreground" : "text-muted-foreground"}>{label}</span>
        {sub && <p className="text-xs text-muted-foreground/60 leading-tight">{sub}</p>}
      </div>
      <span className={`shrink-0 ${highlight ? "text-foreground" : "text-foreground/80"}`}>{value}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export const SummaryCard = () => {
  const { config } = useShed();

  const isComercial = config.structureCategory === "comercial";
  const isMontado = config.serviceType === "fabricado-montado";
  const temFechamento = config.closureOption !== "sem-fechamento";
  const isParcial = config.closureOption === "parcial";

  // ── Área ──────────────────────────────────────────────────────────────────
  const areaPlanta = config.vaoLivre * config.profundidade;

  // ── Pé-direito efetivo ────────────────────────────────────────────────────
  const pedireito = config.pillarType === "com-pilar" ? config.peireito : 6;

  // ── Estrutura ─────────────────────────────────────────────────────────────
  const pilarAdd =
    config.pillarType === "com-pilar"
      ? areaPlanta * (pedireito === 6 ? PRICING.pilar6m : PRICING.pilar7m)
      : 0;
  const valorEstrutura = areaPlanta * PRICING.estrutura + pilarAdd;

  // ── Cobertura ─────────────────────────────────────────────────────────────
  const precoTelha =
    config.roofTileType === "termoacustica"
      ? PRICING.telhaTermoacustica
      : PRICING.telhaSimples;
  const valorCobertura = areaPlanta * precoTelha;

  // ── Fechamento ────────────────────────────────────────────────────────────
  const perimetro = 2 * config.vaoLivre + 2 * config.profundidade;
  const alturaFechamento = isParcial ? pedireito * 0.8 : pedireito;
  const areaPortao = temFechamento ? config.gateWidth * config.gateHeight : 0;
  const areaFechamento = temFechamento
    ? Math.max(0, alturaFechamento * perimetro - areaPortao)
    : 0;

  const precoTelhaFech =
    config.closureTileType === "termoacustica"
      ? PRICING.telhaTermoacustica
      : PRICING.telhaSimples;

  const valorEstFech = temFechamento ? areaFechamento * PRICING.fechamentoEstrutura : 0;
  const valorTelhaFech = temFechamento ? areaFechamento * precoTelhaFech : 0;
  const valorFechamento = valorEstFech + valorTelhaFech;

  // ── Montagem ──────────────────────────────────────────────────────────────
  const valorMontagemEst = isMontado ? areaPlanta * PRICING.montagemEstrutura : 0;
  const valorMontagemFech = isMontado && temFechamento
    ? areaFechamento * PRICING.montagemFechamento : 0;
  const valorMontagem = valorMontagemEst + valorMontagemFech;

  // ── Mobilização de Equipe (Antiga Mão de obra) ────────────────────────────
  const blocos = Math.ceil(areaPlanta / 600);
  const isForaRaio = config.distanceKm > PRICING.raioIsencao;
  const valorMobilizacaoEquipe = (isMontado && isForaRaio) ? blocos * PRICING.maoDeObraPor600m2 : 0;

  // ── Transporte / Mobilização ──────────────────────────────────────────────
  const pesoTotal =
    areaPlanta * PRICING.pesoEstruturaM2 +
    (temFechamento ? areaFechamento * PRICING.pesoFechamentoM2 : 0);
  const numCargas = Math.ceil(pesoTotal / 15_000);
  const valorTransporte =
    config.distanceKm > PRICING.raioIsencao
      ? numCargas * (config.distanceKm - PRICING.raioIsencao) * PRICING.mobilizacaoKmCarga
      : 0;
  const kmCobrado = Math.max(0, config.distanceKm - PRICING.raioIsencao);

  // ── Total ─────────────────────────────────────────────────────────────────
  const valorTotal =
    valorEstrutura + valorCobertura + valorFechamento +
    valorMontagem + valorMobilizacaoEquipe + valorTransporte;

  const valorM2 = areaPlanta > 0 ? valorTotal / areaPlanta : 0;

  // ── Simulação de pagamento ────────────────────────────────────────────────
  // Financiado: 40% entrada + saldo em 24x com juros 2,5% a.m. (Price)
  const entradaFinanciado = valorTotal * 0.40;
  const saldoFinanciado = valorTotal - entradaFinanciado;
  const i = PRICING.jurosMes;
  const n = 24;
  const parcelaFinanciado =
    saldoFinanciado > 0
      ? saldoFinanciado * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
      : 0;

  // Medições: 5% + 25% em 30 dias + saldo em obra
  const entrada5 = valorTotal * 0.05;
  const parcela30 = valorTotal * 0.25;
  const saldoMedicoes = valorTotal - entrada5 - parcela30;

  // ── Mensagem WhatsApp ─────────────────────────────────────────────────────
  const buildWhatsApp = (isEspecialista = false) => {
    const fechDesc =
      config.closureOption === "sem-fechamento"
        ? "Sem fechamento"
        : config.closureOption === "parcial"
          ? `Parcial 80% — ${config.closureTileType === "termoacustica" ? "Termoacústica" : "Simples"}`
          : `Total 100% — ${config.closureTileType === "termoacustica" ? "Termoacústica" : "Simples"}`;

    const pgDesc =
      config.paymentType === "financiado"
        ? `Financiado — 40% entrada + 24×${fmt(parcelaFinanciado)} (2,5% a.m.)`
        : `Medições — 5% entrada + 25% em 30 dias + saldo em obra`;

    const msg = isEspecialista
      ? `Olá! Gostaria de falar com um especialista sobre um galpão metálico.\n\n📐 ${config.vaoLivre}m × ${config.profundidade}m (${areaPlanta} m²)\n💰 Total estimado: ${fmt(valorTotal)}`
      : `🏗️ *Orçamento Galpão — Apex Steel Forge*

📐 *Dimensões:*
• Vão Livre: ${config.vaoLivre}m
• Profundidade: ${config.profundidade}m
• Área de Planta: ${areaPlanta} m²

🏗️ *Especificações:*
• Estrutura: ${config.pillarType === "com-pilar" ? `Com Pilar (pé-direito ${pedireito}m)` : "Sem Pilar"}
• Telhado: ${config.roofShape === "arco" ? "Arco" : "Duas Águas"}
• Cobertura: ${config.roofTileType === "termoacustica" ? "Termoacústica EPS 30mm" : "Telha Simples 0,43mm"}
• Fechamento: ${fechDesc}
• Serviço: ${isMontado ? "Fabricação + Montagem" : "Apenas Fabricação"}

💰 *Resumo Financeiro:*
• Estrutura: ${fmt(valorEstrutura)}
• Cobertura: ${fmt(valorCobertura)}
${temFechamento ? `• Fechamento: ${fmt(valorFechamento)}\n` : ""}${isMontado ? `• Montagem: ${fmt(valorMontagem)}\n` : ""}${valorMobilizacaoEquipe > 0 ? `• Mobilização de Equipe: ${fmt(valorMobilizacaoEquipe)}\n` : ""}${valorTransporte > 0 ? `• Frete de Material (${numCargas} carga${numCargas > 1 ? "s" : ""}, excedente ${kmCobrado}km): ${fmt(valorTransporte)}\n` : ""}
• *TOTAL: ${fmt(valorTotal)}*
• *Valor por m²: ${fmt(valorM2)}*
• Pagamento: ${pgDesc}

Gostaria de uma proposta detalhada!`;

    return `https://wa.me/5593991910861?text=${encodeURIComponent(msg)}`;
  };

  // ── Download texto ────────────────────────────────────────────────────────
  const handleDownload = () => {
    toast.info("Gerando arquivo...");
    setTimeout(() => {
      const fechDesc =
        config.closureOption === "sem-fechamento" ? "Sem fechamento"
          : config.closureOption === "parcial" ? `Parcial 80% da altura`
            : `Total 100% da altura`;

      const content = [
        "ORÇAMENTO ESTIMADO — APEX STEEL FORGE",
        "=".repeat(46),
        "",
        "DIMENSÕES",
        "-".repeat(30),
        `Vão Livre        : ${config.vaoLivre}m`,
        `Profundidade     : ${config.profundidade}m`,
        `Área de Planta   : ${areaPlanta} m²`,
        "",
        "ESPECIFICAÇÕES",
        "-".repeat(30),
        `Estrutura        : ${config.pillarType === "com-pilar" ? `Com Pilar (pé-direito ${pedireito}m)` : "Sem Pilar"}`,
        `Telhado          : ${config.roofShape === "arco" ? "Arco" : "Duas Águas"}`,
        `Cobertura        : ${config.roofTileType === "termoacustica" ? "Termoacústica EPS 30mm" : "Telha Simples 0,43mm"}`,
        `Fechamento       : ${fechDesc}`,
        ...(temFechamento ? [`Área Fechamento  : ${fmtN(areaFechamento)} m²`] : []),
        `Serviço          : ${isMontado ? "Fabricação + Montagem" : "Apenas Fabricação"}`,
        `Distância        : ${config.distanceKm} km de Santarém — PA`,
        "",
        "RESUMO FINANCEIRO",
        "-".repeat(30),
        `Estrutura        : ${fmt(valorEstrutura)}`,
        `Cobertura        : ${fmt(valorCobertura)}`,
        ...(temFechamento ? [`Fechamento       : ${fmt(valorFechamento)}`] : []),
        ...(isMontado ? [`Montagem         : ${fmt(valorMontagem)}`] : []),
        ...(valorMobilizacaoEquipe > 0 ? [`Mobilização Eq.  : ${fmt(valorMobilizacaoEquipe)}`] : []),
        ...(valorTransporte > 0 ? [`Frete Material   : ${fmt(valorTransporte)}`] : []),
        "",
        `TOTAL ESTIMADO   : ${fmt(valorTotal)}`,
        `VALOR POR M²     : ${fmt(valorM2)}`,
        "",
        "FORMA DE PAGAMENTO",
        "-".repeat(30),
        ...(config.paymentType === "financiado"
          ? [
            "Opção Financiada:",
            `  Entrada (40%)  : ${fmt(entradaFinanciado)}`,
            `  Parcelas       : 24× ${fmt(parcelaFinanciado)} (2,5% a.m.)`,
          ]
          : [
            "Medições de Obra:",
            `  Entrada (5%)   : ${fmt(entrada5)}`,
            `  30 dias (25%)  : ${fmt(parcela30)}`,
            `  Saldo em obra  : ${fmt(saldoMedicoes)}`,
          ]),
        "",
        "=".repeat(46),
        "* Valores estimados. Orçamento final conforme especificações técnicas.",
        "* Mobilização cobrada apenas para km excedente de 65 km de Santarém — PA.",
      ].join("\n");

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

  const handleProposta = () =>
    toast.success("Solicitação enviada! Nossa equipe entrará em contato em breve.", { duration: 5000 });

  // ══ RENDER INDUSTRIAL ══════════════════════════════════════════════════════
  if (config.structureCategory === "industrial") {
    const allFilled =
      config.industrialName && config.industrialEmail &&
      config.industrialPhone && config.industrialUseType;

    const handleIndustrialSubmit = () => {
      if (!allFilled) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      toast.success(
        "Seu projeto industrial exige análise técnica especializada. Nossa equipe comercial entrará em contato em breve.",
        { duration: 8000 }
      );
    };

    return (
      <Card className="border-border bg-card">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="w-5 h-5" />
            Estrutura Industrial
          </CardTitle>
          <p className="text-sm text-white/80">Proposta técnica personalizada</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estruturas industriais possuem requisitos específicos que exigem análise técnica detalhada.
            Após o envio, nossa equipe entrará em contato.
          </p>

          <div className="bg-muted/30 p-3 rounded-lg space-y-1 text-sm">
            {[
              ["Nome", config.industrialName],
              ["CNPJ", config.industrialCnpj],
              ["E-mail", config.industrialEmail],
              ["Telefone", config.industrialPhone],
              ["Tipo de uso", config.industrialUseType],
            ].map(([label, value]) => (
              <p key={label}>
                <span className="text-muted-foreground">{label}:</span>{" "}
                <span className="text-foreground font-medium">{value || "—"}</span>
              </p>
            ))}
          </div>

          <Button
            onClick={handleIndustrialSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar para Análise Comercial
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(`https://wa.me/5593991910861?text=${encodeURIComponent("Olá! Preciso de um projeto industrial personalizado. Gostaria de falar com um especialista.")}`, "_blank")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Falar com Especialista no WhatsApp
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ══ RENDER AGRÍCOLA (SILOS) ════════════════════════════════════════════════
  if (config.structureCategory === "agricola") {
    const sacas = config.siloCapacityBags || 0;
    const volumeTon = (sacas * 60) / 1000;
    
    const baseSiloPrice = sacas * 40; // ~R$ 40 por saca
    const conicoPrice = config.siloType === "fundo-conico" ? baseSiloPrice * 0.30 : 0; // +30% para chaparia reforçada e estrutura do fundo cônico
    const passarelaPrice = config.siloPassarela ? 15000 : 0;
    const aeracaoPrice = config.siloAeracao ? sacas * 8 : 0;
    
    const valorTotalSilo = baseSiloPrice + conicoPrice + passarelaPrice + aeracaoPrice;
    
    const buildWhatsAppSilo = () => {
      const msg = `🌾 *Orçamento Silo Metálico — Apex Steel Forge*
      
📐 *Especificações:*
• Capacidade: ${sacas.toLocaleString("pt-BR")} sacas (${volumeTon} Toneladas)
• Fundo: ${config.siloType === "fundo-conico" ? "Cônico Elevado" : "Plano"}
• Passarela Superior: ${config.siloPassarela ? "Sim" : "Não"}
• Aeração/Termometria: ${config.siloAeracao ? "Sim" : "Não"}

💰 *Resumo Financeiro:*
• Silo Base: ${fmt(baseSiloPrice)}
${conicoPrice > 0 ? `• Adicional Fundo Cônico: ${fmt(conicoPrice)}\n` : ""}${passarelaPrice > 0 ? `• Passarela de Inspeção: ${fmt(passarelaPrice)}\n` : ""}${aeracaoPrice > 0 ? `• Sistema de Aeração: ${fmt(aeracaoPrice)}\n` : ""}
• *TOTAL ESTIMADO: ${fmt(valorTotalSilo)}*

Gostaria de uma proposta detalhada para este projeto agrícola!`;
      return `https://wa.me/5593991910861?text=${encodeURIComponent(msg)}`;
    };

    return (
      <Card className="border-border bg-card">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="w-5 h-5" />
            Resumo do Silo
          </CardTitle>
          <p className="text-sm text-white/80">Estimativa para armazenagem</p>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          <div className="bg-muted/30 rounded-lg p-3 grid grid-cols-2 gap-2 text-center text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Capacidade (Sacas)</p>
              <p className="font-bold text-foreground">{sacas.toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Volume (Toneladas)</p>
              <p className="font-bold text-primary">{volumeTon.toLocaleString("pt-BR")} t</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2.5">
            <LineItem
              label="Silo Estruturado"
              sub={`Fundo ${config.siloType === "fundo-conico" ? "Cônico (+30%)" : "Plano"}`}
              value={fmt(baseSiloPrice + conicoPrice)}
            />
            {config.siloPassarela && (
              <LineItem label="Passarela Superior" value={fmt(passarelaPrice)} />
            )}
            {config.siloAeracao && (
              <LineItem label="Aeração e Termometria" sub="R$ 8,00 / saca" value={fmt(aeracaoPrice)} />
            )}
          </div>

          <Separator className="bg-primary/20" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">Total do Investimento</span>
            <span className="text-2xl font-bold text-primary">{fmt(valorTotalSilo)}</span>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-2 pt-1">
            <Button
              onClick={() => window.open(buildWhatsAppSilo(), "_blank")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg font-semibold text-white"
            >
              Solicitar via WhatsApp
            </Button>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground space-y-1 mt-4">
            <p><strong>Incluso:</strong> Chaparia, teto, parafusos, vedação, projeto estrutural de fabricação.</p>
            <p><strong>Não incluso:</strong> Fundação civil (base do silo), frete e montagem no local.</p>
            <p>* Valores estimativos sujeitos a alteração técnica.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ══ RENDER COMERCIAL ═══════════════════════════════════════════════════════
  return (
    <Card className="border-border bg-card">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-primary-foreground">
          <Calculator className="w-5 h-5" />
          Resumo do Orçamento
        </CardTitle>
        <p className="text-sm text-primary-foreground/80">Atualizado em tempo real</p>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">

        {/* ── Dimensões ── */}
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
            <p className="text-muted-foreground text-xs">Área Total</p>
            <p className="font-bold text-primary">{areaPlanta} m²</p>
          </div>
        </div>

        {/* ── Área de fechamento ── */}
        {temFechamento && (
          <div className="bg-muted/20 rounded-lg p-3 grid grid-cols-2 gap-2 text-center text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Área Fechamento</p>
              <p className="font-bold text-foreground">{fmtN(areaFechamento)} m²</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Pé-direito</p>
              <p className="font-bold text-foreground">
                {pedireito}m {isParcial ? "(×80%)" : ""}
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* ── Itens de custo ── */}
        <div className="space-y-2.5">
          <LineItem
            label="Estrutura Metálica"
            sub={`R$ 180/m²${config.pillarType === "com-pilar" ? ` + R$ ${pedireito === 6 ? "50" : "65"}/m² (pilar ${pedireito}m)` : ""}`}
            value={fmt(valorEstrutura)}
          />
          <LineItem
            label={`Cobertura (${config.roofTileType === "termoacustica" ? "Termoacústica" : "Simples"} - ${config.roofShape === "arco" ? "Arco" : "Duas Águas"})`}
            sub={`R$ ${precoTelha}/m² × ${areaPlanta} m²`}
            value={fmt(valorCobertura)}
          />

          {temFechamento && (
            <>
              <LineItem
                label="Estrutura de Fechamento"
                sub={`R$ 85/m² × ${fmtN(areaFechamento)} m²`}
                value={fmt(valorEstFech)}
              />
              <LineItem
                label={`Telha Fechamento (${config.closureTileType === "termoacustica" ? "Termoacústica" : "Simples"})`}
                sub={`R$ ${precoTelhaFech}/m² × ${fmtN(areaFechamento)} m²`}
                value={fmt(valorTelhaFech)}
              />
            </>
          )}

          {isMontado && (
            <LineItem
              label="Montagem"
              sub={`Estrutura R$ 50/m²${temFechamento ? " · Fechamento R$ 25/m²" : ""}`}
              value={fmt(valorMontagem)}
            />
          )}

          {valorMobilizacaoEquipe > 0 && (
            <LineItem
              label="Mobilização de Equipe"
              sub={`R$ 20.000 × ${blocos} bloco${blocos > 1 ? "s" : ""} de 600 m² (fora de Santarém)`}
              value={fmt(valorMobilizacaoEquipe)}
            />
          )}

          {valorTransporte > 0 && (
            <LineItem
              label="Frete de Material"
              sub={`${numCargas} carga${numCargas > 1 ? "s" : ""} × ${kmCobrado} km (excedente) × R$ 18/km`}
              value={fmt(valorTransporte)}
            />
          )}
        </div>

        <Separator className="bg-primary/20" />

        {/* ── Totais ── */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">Total do Investimento</span>
            <span className="text-2xl font-bold text-primary">{fmt(valorTotal)}</span>
          </div>
          <div className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-sm text-muted-foreground">📊 Valor por m²</span>
            <span className="text-base font-bold text-foreground">{fmt(valorM2)}</span>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* ── Forma de Pagamento ── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            💰 Simulação de Pagamento
          </p>

          {config.paymentType === "financiado" ? (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm space-y-1.5">
              <p className="font-bold text-foreground">💳 Opção Financiada</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Entrada (40%)</span>
                <span className="font-semibold text-foreground text-right">{fmt(entradaFinanciado)}</span>
                <span className="text-muted-foreground">Parcelas (24×)</span>
                <span className="font-semibold text-primary text-right">{fmt(parcelaFinanciado)}/mês</span>
                <span className="text-muted-foreground">Juros</span>
                <span className="font-semibold text-foreground text-right">2,5% a.m.</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm space-y-1.5">
              <p className="font-bold text-foreground">🏗️ Medições de Obra</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Entrada (5%)</span>
                <span className="font-semibold text-foreground text-right">{fmt(entrada5)}</span>
                <span className="text-muted-foreground">30 dias (25%)</span>
                <span className="font-semibold text-foreground text-right">{fmt(parcela30)}</span>
                <span className="text-muted-foreground">Saldo em obra</span>
                <span className="font-semibold text-primary text-right">{fmt(saldoMedicoes)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Botões de ação ── */}
        <div className="space-y-2 pt-1">
          {/* WhatsApp principal */}
          <Button
            onClick={() => window.open(buildWhatsApp(), "_blank")}
            className="w-full bg-green-600 hover:bg-green-700 shadow-lg font-semibold"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Solicitar via WhatsApp
          </Button>

          {/* Grid 3 botões */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full text-xs gap-1 py-2"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar PDF
            </Button>
            <Button
              onClick={handleProposta}
              variant="outline"
              className="w-full text-xs gap-1 py-2"
            >
              <FileText className="w-3.5 h-3.5" />
              Proj. Estrutural
            </Button>
            <Button
              onClick={() => window.open(buildWhatsApp(true), "_blank")}
              variant="outline"
              className="w-full text-xs gap-1 py-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Especialista
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
          <p><strong>Incluso:</strong> Estrutura metálica, cobertura{temFechamento ? ", fechamento" : ""}{isMontado ? ", montagem" : ""}.</p>
          <p><strong>Não incluso:</strong> Fundação, piso, terraplanagem, projetos executivos.</p>
          <p>* Mobilização cobrada apenas pelos km que excedem 65 km de Santarém — PA.</p>
          <p>* Valores estimados. Orçamento final conforme especificações técnicas.</p>
        </div>
      </CardContent>
    </Card>
  );
};

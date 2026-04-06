import { useShed, VaoLivre, Peireito } from "@/contexts/ShedContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Building2, Factory, Columns2, Layers,
  Fence, Settings2, Truck, Ruler, CreditCard, Wheat
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Section header ───────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
    <div className="p-1.5 rounded-md bg-primary/10">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="font-semibold text-foreground">{title}</span>
  </div>
);

// Profundidades: 6 m a 120 m, passos de 6 m
const PROFUNDIDADES = Array.from({ length: 20 }, (_, i) => (i + 1) * 6);

export const ConfigPanel = () => {
  const { config, updateConfig } = useShed();
  const isComercial = config.structureCategory === "comercial";
  const isAgricola = config.structureCategory === "agricola";
  const temFechamento = config.closureOption !== "sem-fechamento";

  return (
    <div className="h-full overflow-y-auto bg-card">
      {/* Cabeçalho */}
      <div className="p-6 pb-4 border-b border-border bg-gradient-to-r from-card to-muted/20">
        <h2 className="text-xl font-bold text-foreground">Configure seu Galpão</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Preencha as opções para gerar seu orçamento estimado
        </p>
      </div>

      <div className="p-6 space-y-8">

        {/* ══ 1. CATEGORIA ════════════════════════════════════════════════════ */}
        <section>
          <SectionTitle icon={Building2} title="Tipo de Estrutura" />
          <div className="grid grid-cols-3 gap-2">
            {(["comercial", "industrial", "agricola"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => updateConfig({ structureCategory: cat })}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-xs font-semibold text-center h-[76px]",
                  config.structureCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 text-muted-foreground",
                )}
              >
                {cat === "comercial" && <Building2 className="w-5 h-5 mb-1.5" />}
                {cat === "industrial" && <Factory className="w-5 h-5 mb-1.5" />}
                {cat === "agricola" && <Wheat className="w-5 h-5 mb-1.5" />}
                {cat === "comercial" ? "Galpão Comercial" : cat === "industrial" ? "Industrial" : "Silos / Agro"}
              </button>
            ))}
          </div>
        </section>

        {/* ══ FLUXO COMERCIAL ═════════════════════════════════════════════════ */}
        {isComercial && (
          <>
            {/* ── 2. VÃO LIVRE ── */}
            <section>
              <SectionTitle icon={Ruler} title="Vão Livre" />
              <div className="grid grid-cols-4 gap-2">
                {([10, 14, 16, 20] as VaoLivre[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateConfig({ vaoLivre: v })}
                    className={cn(
                      "py-2.5 rounded-lg border-2 text-sm font-bold transition-all",
                      config.vaoLivre === v
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground",
                    )}
                  >
                    {v}m
                  </button>
                ))}
              </div>
            </section>

            {/* ── 3. PROFUNDIDADE ── */}
            <section>
              <SectionTitle icon={Ruler} title="Profundidade" />
              <Select
                value={config.profundidade.toString()}
                onValueChange={(v) => updateConfig({ profundidade: Number(v) })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFUNDIDADES.map((p) => (
                    <SelectItem key={p} value={p.toString()}>{p}m</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Área de planta:{" "}
                <span className="font-semibold text-primary">
                  {config.vaoLivre * config.profundidade} m²
                </span>
              </p>
            </section>

            {/* ── 4. TIPO DE ESTRUTURA (pilar) ── */}
            <section>
              <SectionTitle icon={Columns2} title="Tipo de Estrutura" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(["com-pilar", "sem-pilar"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateConfig({ pillarType: t })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all",
                      config.pillarType === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground",
                    )}
                  >
                    {t === "com-pilar" ? "Com Pilar" : "Sem Pilar"}
                  </button>
                ))}
              </div>

              {config.pillarType === "com-pilar" && (
                <div className="pl-4 border-l-2 border-primary/30 space-y-2">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Pé-direito
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {([6, 7] as Peireito[]).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => updateConfig({ peireito: h })}
                        className={cn(
                          "py-2 rounded-lg border-2 text-sm font-bold transition-all flex flex-col items-center",
                          config.peireito === h
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40 text-muted-foreground",
                        )}
                      >
                        <span>{h}m</span>
                        <span className="text-xs font-normal opacity-70">
                          +R$ {h === 6 ? "50" : "65"}/m²
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── 5. COBERTURA ── */}
            <section>
              <SectionTitle icon={Layers} title="Cobertura" />
              
              <Label className="text-sm text-muted-foreground mb-3 block">Material da Telha</Label>
              <RadioGroup
                value={config.roofTileType}
                onValueChange={(v) => updateConfig({ roofTileType: v as any })}
                className="space-y-3"
              >
                {[
                  {
                    id: "roof-simples", value: "simples",
                    title: "Telha Simples",
                    desc: "Espessura 0,43mm",
                    price: "R$ 45,00 / m²",
                  },
                  {
                    id: "roof-termoac", value: "termoacustica",
                    title: "Telha Termoacústica",
                    desc: "Núcleo EPS 30mm · 0,43mm + 0,35mm",
                    price: "R$ 135,00 / m²",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    htmlFor={opt.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                      config.roofTileType === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30",
                    )}
                  >
                    <RadioGroupItem value={opt.value} id={opt.id} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{opt.title}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      <p className="text-xs text-primary font-medium mt-1">{opt.price}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <div className="mt-4 pt-4 border-t border-border/50">
                <Label className="text-sm text-muted-foreground mb-3 block">Cor da Telha</Label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: "galvalume", color: "#e2e8f0", label: "Zinco" },
                    { value: "branco", color: "#f8fafc", label: "Branca" },
                    { value: "azul", color: "#0ea5e9", label: "Azul" },
                    { value: "verde", color: "#22c55e", label: "Verde" },
                    { value: "vermelho", color: "#ef4444", label: "Vermelha" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateConfig({ roofColor: opt.value as any })}
                      title={opt.label}
                      className={cn(
                        "h-10 rounded-lg border-2 transition-all flex items-center justify-center",
                        config.roofColor === opt.value
                          ? "border-primary scale-110 ring-2 ring-primary/20"
                          : "border-border/50 hover:scale-105"
                      )}
                      style={{ backgroundColor: opt.color }}
                    >
                      {config.roofColor === opt.value && (
                        <div className={`w-2.5 h-2.5 rounded-full ${opt.value === 'branco' || opt.value === 'galvalume' ? 'bg-slate-900' : 'bg-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 6. FECHAMENTO LATERAL — 3 opções diretas ── */}
            <section>
              <SectionTitle icon={Fence} title="Fechamento Lateral" />
              <div className="grid grid-cols-3 gap-2 mb-4">
                {([
                  { value: "sem-fechamento", label: "Sem Fechamento", sub: "" },
                  { value: "parcial", label: "Parcial", sub: "80% da altura" },
                  { value: "total", label: "Total", sub: "100% da altura" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateConfig({ closureOption: opt.value })}
                    className={cn(
                      "py-2.5 px-1 rounded-xl border-2 text-xs font-semibold transition-all flex flex-col items-center gap-0.5",
                      config.closureOption === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground",
                    )}
                  >
                    <span>{opt.label}</span>
                    {opt.sub && <span className="font-normal opacity-70">{opt.sub}</span>}
                  </button>
                ))}
              </div>

              {temFechamento && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                  {/* Portão */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Dimensões do Portão
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Largura (m)</Label>
                        <Input
                          type="number" min={1} step={0.5}
                          value={config.gateWidth}
                          onChange={(e) => updateConfig({ gateWidth: Number(e.target.value) })}
                          className="bg-background h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Altura (m)</Label>
                        <Input
                          type="number" min={1} step={0.5}
                          value={config.gateHeight}
                          onChange={(e) => updateConfig({ gateHeight: Number(e.target.value) })}
                          className="bg-background h-9 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Área do portão:{" "}
                      <span className="font-semibold text-primary">
                        {(config.gateWidth * config.gateHeight).toFixed(1)} m²
                      </span>
                    </p>
                  </div>

                  {/* Telha do fechamento */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Telha do Fechamento
                    </Label>
                    <RadioGroup
                      value={config.closureTileType}
                      onValueChange={(v) => updateConfig({ closureTileType: v as any })}
                      className="space-y-2"
                    >
                      {[
                        { id: "cl-simples", value: "simples", label: "Simples 0,43mm", price: "R$ 45/m²" },
                        { id: "cl-termoac", value: "termoacustica", label: "Termoacústica EPS 30mm", price: "R$ 135/m²" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          htmlFor={opt.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm",
                            config.closureTileType === opt.value
                              ? "border-primary bg-primary/5"
                              : "border-border",
                          )}
                        >
                          <RadioGroupItem value={opt.value} id={opt.id} />
                          <span>{opt.label}</span>
                          <span className="ml-auto text-primary font-medium text-xs">{opt.price}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </section>

            {/* ── 7. SERVIÇO ── */}
            <section>
              <SectionTitle icon={Settings2} title="Fabricação / Montagem" />
              <div className="space-y-3">
                {[
                  {
                    value: "fabricado",
                    title: "Apenas Fabricação",
                    desc: "Estrutura fabricada; montagem por conta do cliente",
                  },
                  {
                    value: "fabricado-montado",
                    title: "Fabricação + Montagem",
                    desc: "+R$ 50/m² planta · +R$ 25/m² fechamento (Mobilização de equipe p/ montagem fora de Santarém: R$ 20k/600m²)",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateConfig({ serviceType: opt.value as any })}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all text-left",
                      config.serviceType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground",
                    )}
                  >
                    <div className="font-bold">{opt.title}</div>
                    <div className="text-xs font-normal mt-0.5 opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* ── 8. LOGÍSTICA ── */}
            <section>
              <SectionTitle icon={Truck} title="Frete e Mobilização" />
              <Label className="text-sm text-muted-foreground mb-2 block">
                Distância de Santarém — PA (km)
              </Label>
              <Input
                type="number" min={0} step={1}
                value={config.distanceKm}
                onChange={(e) => updateConfig({ distanceKm: Number(e.target.value) })}
                className="bg-background"
                placeholder="Ex: 800"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {config.distanceKm <= 65
                  ? "✅ Dentro do raio de 65 km — isento de frete e de mobilização de equipe."
                  : `⚠️ Fora de 65km: Frete R$ 18/km por carga. Mobilização de equipe (se houver montagem): R$ 20.000 a cada 600m².`}
              </p>
            </section>

            {/* ── 9. FORMA DE PAGAMENTO ── */}
            <section>
              <SectionTitle icon={CreditCard} title="Forma de Pagamento" />
              <div className="space-y-3">
                {[
                  {
                    value: "financiado",
                    title: "💳 Financiado",
                    lines: ["40% de entrada", "Saldo em até 24 parcelas", "Juros de 2,5% ao mês"],
                  },
                  {
                    value: "medicoes",
                    title: "🏗️ Medições de Obra",
                    lines: ["5% de entrada", "25% em 30 dias", "Saldo em medições conforme evolução da obra"],
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateConfig({ paymentType: opt.value as any })}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl border-2 text-sm transition-all text-left",
                      config.paymentType === opt.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className={cn(
                      "font-bold mb-1",
                      config.paymentType === opt.value ? "text-primary" : "text-foreground",
                    )}>
                      {opt.title}
                    </div>
                    <ul className="space-y-0.5">
                      {opt.lines.map((l) => (
                        <li key={l} className="text-xs text-muted-foreground">• {l}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ══ FLUXO AGRÍCOLA (SILOS) ══════════════════════════════════════════ */}
        {isAgricola && (
          <>
            <section>
              <SectionTitle icon={Wheat} title="Capacidade do Silo" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[10000, 20000, 50000, 100000].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => updateConfig({ siloCapacityBags: cap })}
                      className={cn(
                        "py-3 rounded-lg border-2 text-sm font-bold transition-all",
                        config.siloCapacityBags === cap
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 text-muted-foreground",
                      )}
                    >
                      {cap.toLocaleString("pt-BR")} sacas
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                   <Label className="text-xs text-muted-foreground block mb-2">Capacidade personalizada em sacas (60kg)</Label>
                   <Input 
                      type="number" min={1000} step={1000}
                      value={config.siloCapacityBags}
                      onChange={(e) => updateConfig({ siloCapacityBags: Number(e.target.value) })}
                      className="bg-background"
                   />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle icon={Settings2} title="Configuração do Fundo" />
              <div className="grid grid-cols-2 gap-3 mb-2">
                {[
                  { value: "fundo-plano", label: "Fundo Plano" },
                  { value: "fundo-conico", label: "Fundo Cônico" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateConfig({ siloType: opt.value as any })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center",
                      config.siloType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground",
                    )}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {config.siloType === "fundo-conico" 
                  ? "Ideal para autolimpeza total e menor necessidade de obras civis complexas subterrâneas." 
                  : "Ideal para grandes volumes, requer fundação com canais de aeração embutidos."}
              </p>
            </section>

            <section>
              <SectionTitle icon={Layers} title="Acessórios e Opcionais" />
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={config.siloPassarela}
                    onChange={(e) => updateConfig({ siloPassarela: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Passarela Superior</p>
                    <p className="text-xs text-muted-foreground">+ R$ 15.000 / unidade</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={config.siloAeracao}
                    onChange={(e) => updateConfig({ siloAeracao: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Sistema de Aeração / Termometria</p>
                    <p className="text-xs text-muted-foreground">+ R$ 8 por saca</p>
                  </div>
                </label>
              </div>
            </section>
          </>
        )}

        {/* ══ FLUXO INDUSTRIAL ════════════════════════════════════════════════ */}
        {!isComercial && !isAgricola && (
          <section>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                ℹ️ Estruturas industriais requerem análise técnica especializada. Preencha o formulário abaixo e nossa equipe comercial entrará em contato.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { field: "industrialName", label: "Nome completo", type: "text", placeholder: "Seu nome" },
                { field: "industrialCnpj", label: "CNPJ", type: "text", placeholder: "00.000.000/0001-00" },
                { field: "industrialEmail", label: "E-mail", type: "email", placeholder: "email@empresa.com.br" },
                { field: "industrialPhone", label: "Telefone / WhatsApp", type: "tel", placeholder: "(93) 99999-9999" },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <Label className="text-sm mb-1 block">{label}</Label>
                  <Input
                    type={type}
                    value={(config as any)[field]}
                    onChange={(e) => updateConfig({ [field]: e.target.value } as any)}
                    placeholder={placeholder}
                    className="bg-background"
                  />
                </div>
              ))}

              <div>
                <Label className="text-sm mb-2 block">Tipo de uso da estrutura industrial</Label>
                <Select
                  value={config.industrialUseType}
                  onValueChange={(v) => updateConfig({ industrialUseType: v })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      ["alimenticio", "Alimentício"],
                      ["logistico", "Logístico"],
                      ["data-center", "Data Center"],
                      ["atacadista", "Atacadista"],
                      ["combustiveis", "Combustíveis"],
                      ["graos", "Armazenagem de grãos"],
                      ["portuario", "Portuário"],
                      ["modular", "Modular"],
                    ].map(([v, label]) => (
                      <SelectItem key={v} value={v}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

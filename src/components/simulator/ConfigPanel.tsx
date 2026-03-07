import { useShed, VaoLivre, Peireito } from "@/contexts/ShedContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, Factory, Columns2, Minus, Layers, Fence, Settings2, Truck, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
    <div className="p-1.5 rounded-md bg-primary/10">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="font-semibold text-foreground">{title}</span>
  </div>
);

// Mapa de profundidades em módulos de 6m
const PROFUNDIDADES = Array.from({ length: 20 }, (_, i) => (i + 1) * 6); // 6 a 120

export const ConfigPanel = () => {
  const { config, updateConfig } = useShed();

  const isComercial = config.structureCategory === "comercial";

  return (
    <div className="h-full overflow-y-auto bg-card">
      {/* Cabeçalho */}
      <div className="p-6 pb-4 border-b border-border bg-gradient-to-r from-card to-muted/20">
        <h2 className="text-xl font-bold text-foreground">Configure seu Galpão</h2>
        <p className="text-sm text-muted-foreground mt-1">Preencha as opções para gerar seu orçamento estimado</p>
      </div>

      <div className="p-6 space-y-8">
        {/* ── 1. TIPO DE ESTRUTURA ── */}
        <section>
          <SectionTitle icon={Building2} title="Tipo de Estrutura" />
          <div className="grid grid-cols-2 gap-3">
            {(["comercial", "industrial"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => updateConfig({ structureCategory: cat })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-semibold",
                  config.structureCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 text-muted-foreground"
                )}
              >
                {cat === "comercial" ? (
                  <Building2 className="w-6 h-6" />
                ) : (
                  <Factory className="w-6 h-6" />
                )}
                {cat === "comercial" ? "Comercial" : "Industrial"}
              </button>
            ))}
          </div>
        </section>

        {/* ── FLUXO COMERCIAL ── */}
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
                      "py-2 rounded-lg border-2 text-sm font-bold transition-all",
                      config.vaoLivre === v
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground"
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
                    <SelectItem key={p} value={p.toString()}>
                      {p}m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Área de planta: <span className="font-semibold text-primary">{config.vaoLivre * config.profundidade} m²</span>
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
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    {t === "com-pilar" ? "Com Pilar" : "Sem Pilar"}
                  </button>
                ))}
              </div>

              {config.pillarType === "com-pilar" && (
                <div className="pl-4 border-l-2 border-primary/30 space-y-2">
                  <Label className="text-sm text-muted-foreground mb-2 block">Pé-direito</Label>
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
                            : "border-border hover:border-primary/40 text-muted-foreground"
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

            {/* ── 5. TELHADO ── */}
            <section>
              <SectionTitle icon={Layers} title="Telhado" />
              <RadioGroup
                value={config.roofTileType}
                onValueChange={(v) => updateConfig({ roofTileType: v as any })}
                className="space-y-3"
              >
                <label
                  htmlFor="roof-simples"
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                    config.roofTileType === "simples"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <RadioGroupItem value="simples" id="roof-simples" className="mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Telha Simples</p>
                    <p className="text-xs text-muted-foreground">Espessura 0,43mm</p>
                    <p className="text-xs text-primary font-medium mt-1">R$ 45,00 / m²</p>
                  </div>
                </label>

                <label
                  htmlFor="roof-termoacustica"
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                    config.roofTileType === "termoacustica"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <RadioGroupItem value="termoacustica" id="roof-termoacustica" className="mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Telha Termoacústica</p>
                    <p className="text-xs text-muted-foreground">EPS 30mm + 0,43mm + 0,35mm</p>
                    <p className="text-xs text-primary font-medium mt-1">R$ 135,00 / m²</p>
                  </div>
                </label>
              </RadioGroup>
            </section>

            {/* ── 6. FECHAMENTO LATERAL ── */}
            <section>
              <SectionTitle icon={Fence} title="Fechamento Lateral" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(["sem-fechamento", "com-fechamento"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateConfig({ closureType: t })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all",
                      config.closureType === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    {t === "sem-fechamento" ? "Sem Fechamento" : "Com Fechamento"}
                  </button>
                ))}
              </div>

              {config.closureType === "com-fechamento" && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                  {/* Tipo de fechamento */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Tipo de Fechamento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["parcial", "total"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateConfig({ closureCoverage: t })}
                          className={cn(
                            "py-2 rounded-lg border-2 text-sm font-semibold transition-all flex flex-col items-center",
                            config.closureCoverage === t
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40 text-muted-foreground"
                          )}
                        >
                          <span>{t === "parcial" ? "Parcial" : "Total"}</span>
                          <span className="text-xs font-normal opacity-70">
                            {t === "parcial" ? "80% da altura" : "100% da altura"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portão */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Dimensões do Portão</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Largura (m)</Label>
                        <Input
                          type="number"
                          min={1}
                          step={0.5}
                          value={config.gateWidth}
                          onChange={(e) => updateConfig({ gateWidth: Number(e.target.value) })}
                          className="bg-background h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Altura (m)</Label>
                        <Input
                          type="number"
                          min={1}
                          step={0.5}
                          value={config.gateHeight}
                          onChange={(e) => updateConfig({ gateHeight: Number(e.target.value) })}
                          className="bg-background h-9 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Área do portão: <span className="font-semibold text-primary">{(config.gateWidth * config.gateHeight).toFixed(1)} m²</span>
                    </p>
                  </div>

                  {/* Telha do Fechamento */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Telha do Fechamento</Label>
                    <RadioGroup
                      value={config.closureTileType}
                      onValueChange={(v) => updateConfig({ closureTileType: v as any })}
                      className="space-y-2"
                    >
                      <label
                        htmlFor="closure-simples"
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm",
                          config.closureTileType === "simples" ? "border-primary bg-primary/5" : "border-border"
                        )}
                      >
                        <RadioGroupItem value="simples" id="closure-simples" />
                        <span>Simples 0,43mm</span>
                        <span className="ml-auto text-primary font-medium text-xs">R$ 45/m²</span>
                      </label>
                      <label
                        htmlFor="closure-termoac"
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm",
                          config.closureTileType === "termoacustica" ? "border-primary bg-primary/5" : "border-border"
                        )}
                      >
                        <RadioGroupItem value="termoacustica" id="closure-termoac" />
                        <span>Termoacústica EPS 30mm</span>
                        <span className="ml-auto text-primary font-medium text-xs">R$ 135/m²</span>
                      </label>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </section>

            {/* ── 7. FABRICAÇÃO / MONTAGEM ── */}
            <section>
              <SectionTitle icon={Settings2} title="Serviço" />
              <div className="grid grid-cols-1 gap-3">
                {(["fabricado", "fabricado-montado"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateConfig({ serviceType: t })}
                    className={cn(
                      "py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all text-left",
                      config.serviceType === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    {t === "fabricado" ? (
                      <>
                        <div className="font-bold">Somente Fabricado</div>
                        <div className="text-xs font-normal mt-0.5 opacity-70">Estrutura fabricada, montagem por conta do cliente</div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold">Fabricado + Montado</div>
                        <div className="text-xs font-normal mt-0.5 opacity-70">Inclui mão de obra de montagem (+R$ 50/m² planta +R$ 25/m² fechamento)</div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* ── 8. DISTÂNCIA / MOBILIZAÇÃO ── */}
            <section>
              <SectionTitle icon={Truck} title="Logística" />
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Distância de Santarém - PA (km)
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={config.distanceKm}
                  onChange={(e) => updateConfig({ distanceKm: Number(e.target.value) })}
                  className="bg-background"
                  placeholder="Ex: 800"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {config.distanceKm <= 60
                    ? "✅ Dentro do raio de 60 km — mobilização não cobrada"
                    : "⚠️ Fora do raio — custo de mobilização será adicionado"}
                </p>
              </div>
            </section>
          </>
        )}

        {/* ── FLUXO INDUSTRIAL ── */}
        {!isComercial && (
          <section>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                ℹ️ Estruturas industriais requerem análise personalizada. Preencha o formulário abaixo e nosso setor comercial entrará em contato.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-1 block">Nome completo</Label>
                <Input
                  value={config.industrialName}
                  onChange={(e) => updateConfig({ industrialName: e.target.value })}
                  placeholder="Seu nome"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">CNPJ</Label>
                <Input
                  value={config.industrialCnpj}
                  onChange={(e) => updateConfig({ industrialCnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">E-mail</Label>
                <Input
                  type="email"
                  value={config.industrialEmail}
                  onChange={(e) => updateConfig({ industrialEmail: e.target.value })}
                  placeholder="email@empresa.com.br"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">Telefone / WhatsApp</Label>
                <Input
                  value={config.industrialPhone}
                  onChange={(e) => updateConfig({ industrialPhone: e.target.value })}
                  placeholder="(93) 99999-9999"
                  className="bg-background"
                />
              </div>
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
                    <SelectItem value="alimenticio">Alimentício</SelectItem>
                    <SelectItem value="logistico">Logístico</SelectItem>
                    <SelectItem value="data-center">Data Center</SelectItem>
                    <SelectItem value="atacadista">Atacadista</SelectItem>
                    <SelectItem value="multiplos-pavimentos">Prédio de múltiplos pavimentos</SelectItem>
                    <SelectItem value="combustiveis">Combustíveis</SelectItem>
                    <SelectItem value="graos">Armazenagem de grãos</SelectItem>
                    <SelectItem value="portuario">Portuário</SelectItem>
                    <SelectItem value="modular">Modular</SelectItem>
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

import { useShed } from "@/contexts/ShedContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Ruler, Eye, Building2, MapPin, CreditCard } from "lucide-react";

export const ConfigPanel = () => {
  const { config, updateConfig } = useShed();

  return (
    <div className="h-full overflow-y-auto p-6 bg-card">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Configure seu Galpão</h2>

      <Accordion type="multiple" defaultValue={["dimensions", "visualization"]} className="space-y-2">
        {/* Dimensões */}
        <AccordionItem value="dimensions" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" />
              <span className="font-semibold">Parâmetros Dimensionais</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Comprimento */}
            <div>
              <Label className="text-foreground mb-2 block">
                Comprimento: <span className="text-primary font-bold">{config.length}m</span>
              </Label>
              <Slider
                min={6}
                max={200}
                step={6}
                value={[config.length]}
                onValueChange={(value) => updateConfig({ length: value[0] })}
              />
              <p className="text-xs text-muted-foreground mt-1">Múltiplos de 6 metros</p>
            </div>

            {/* Largura */}
            <div>
              <Label className="text-foreground mb-2 block">Largura</Label>
              <Select value={config.width.toString()} onValueChange={(v) => updateConfig({ width: Number(v) })}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10m</SelectItem>
                  <SelectItem value="15">15m</SelectItem>
                  <SelectItem value="20">20m</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Altura */}
            <div>
              <Label className="text-foreground mb-2 block">Altura (Pé-direito)</Label>
              <Select value={config.height.toString()} onValueChange={(v) => updateConfig({ height: Number(v) })}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6m (padrão)</SelectItem>
                  <SelectItem value="8">8m (+R$ 140/m²)</SelectItem>
                  <SelectItem value="10">10m (+R$ 280/m²)</SelectItem>
                  <SelectItem value="12">12m (+R$ 420/m²)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Adicional de R$ 70/m² por metro acima de 6m</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Visualização 3D */}
        <AccordionItem value="visualization" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span className="font-semibold">Visualização 3D</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Mostrar Paredes</Label>
              <Switch
                checked={config.showWalls}
                onCheckedChange={(checked) => updateConfig({ showWalls: checked })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Estrutura e Cobertura */}
        <AccordionItem value="structure" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">Opções Estruturais</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Tipo de Estrutura */}
            <div>
              <Label className="text-foreground mb-3 block">Tipo de Estrutura</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Viga I */}
                <button
                  type="button"
                  onClick={() => updateConfig({ structureType: "viga-i" })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${config.structureType === "viga-i"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                    }`}
                >
                  {/* Ícone Viga I */}
                  <svg viewBox="0 0 60 30" className="w-full mb-2" fill="currentColor">
                    <rect x="5" y="2" width="50" height="5" rx="1" className="text-primary" fill="currentColor" />
                    <rect x="26" y="7" width="8" height="16" rx="1" className="text-primary" fill="currentColor" />
                    <rect x="5" y="23" width="50" height="5" rx="1" className="text-primary" fill="currentColor" />
                  </svg>
                  <p className="text-xs font-semibold text-foreground">Viga I (Alma Cheia)</p>
                  <p className="text-xs text-muted-foreground mt-1">Robusta, para vãos menores com alta resistência</p>
                </button>

                {/* Treliça */}
                <button
                  type="button"
                  onClick={() => updateConfig({ structureType: "trelica" })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${config.structureType === "trelica"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                    }`}
                >
                  {/* Ícone Treliça */}
                  <svg viewBox="0 0 60 30" className="w-full mb-2" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="5" x2="55" y2="5" className="stroke-primary" stroke="currentColor" />
                    <line x1="5" y1="25" x2="55" y2="25" className="stroke-primary" stroke="currentColor" />
                    <line x1="5" y1="5" x2="5" y2="25" className="stroke-primary" stroke="currentColor" />
                    <line x1="20" y1="5" x2="20" y2="25" className="stroke-primary" stroke="currentColor" />
                    <line x1="35" y1="5" x2="35" y2="25" className="stroke-primary" stroke="currentColor" />
                    <line x1="50" y1="5" x2="50" y2="25" className="stroke-primary" stroke="currentColor" />
                    <line x1="5" y1="25" x2="20" y2="5" className="stroke-primary" stroke="currentColor" />
                    <line x1="20" y1="25" x2="35" y2="5" className="stroke-primary" stroke="currentColor" />
                    <line x1="35" y1="25" x2="50" y2="5" className="stroke-primary" stroke="currentColor" />
                  </svg>
                  <p className="text-xs font-semibold text-foreground">Treliça</p>
                  <p className="text-xs text-muted-foreground mt-1">Leve, econômica para grandes vãos sem pilares</p>
                </button>
              </div>
            </div>

            {/* Tipo de Cobertura */}
            <div>
              <Label className="text-foreground mb-3 block">Tipo de Cobertura (sem pintura)</Label>
              <RadioGroup value={config.roofType} onValueChange={(v) => updateConfig({ roofType: v as any })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metalica" id="metalica" />
                  <Label htmlFor="metalica" className="cursor-pointer">Telha Metálica Comum 0.43mm (+R$ 40/m²)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="termoacustica" id="termoacustica" />
                  <Label htmlFor="termoacustica" className="cursor-pointer">Telha Termoacústica (+R$ 130/m²)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Mezanino */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground">Adicionar Mezanino</Label>
                <Switch
                  checked={config.hasMezzanine}
                  onCheckedChange={(checked) => updateConfig({ hasMezzanine: checked })}
                />
              </div>

              {config.hasMezzanine && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Largura do Mezanino (m)</Label>
                    <Input
                      type="number"
                      value={config.mezzanineWidth}
                      onChange={(e) => updateConfig({ mezzanineWidth: Number(e.target.value) })}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Comprimento do Mezanino (m)</Label>
                    <Input
                      type="number"
                      value={config.mezzanineLength}
                      onChange={(e) => updateConfig({ mezzanineLength: Number(e.target.value) })}
                      className="bg-background"
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Logística */}
        <AccordionItem value="logistics" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-semibold">Logística e Terreno</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Cidade */}
            <div>
              <Label className="text-foreground mb-2 block">Cidade da Obra</Label>
              <Select value={config.city} onValueChange={(v) => updateConfig({ city: v })}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="santarem">Santarém - PA</SelectItem>
                  <SelectItem value="belem">Belém - PA</SelectItem>
                  <SelectItem value="manaus">Manaus - AM</SelectItem>
                  <SelectItem value="porto-velho">Porto Velho - RO</SelectItem>
                  <SelectItem value="rio-branco">Rio Branco - AC</SelectItem>
                  <SelectItem value="palmas">Palmas - TO</SelectItem>
                  <SelectItem value="cuiaba">Cuiabá - MT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Já possui terreno */}
            <div>
              <Label className="text-foreground mb-3 block">Já possui o terreno?</Label>
              <RadioGroup value={config.hasTerrain} onValueChange={(v) => updateConfig({ hasTerrain: v as any })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="has-terrain-sim" />
                  <Label htmlFor="has-terrain-sim" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="has-terrain-nao" />
                  <Label htmlFor="has-terrain-nao" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Necessita de Terraplanagem */}
            <div>
              <Label className="text-foreground mb-3 block">O terreno necessita de terraplanagem?</Label>
              <RadioGroup value={config.needsEarthworks} onValueChange={(v) => updateConfig({ needsEarthworks: v as any })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="earthworks-sim" />
                  <Label htmlFor="earthworks-sim" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="earthworks-nao" />
                  <Label htmlFor="earthworks-nao" className="cursor-pointer">Não (já terraplanado)</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2">
                O terreno deve ser entregue terraplanado pelo cliente
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pagamento */}
        <AccordionItem value="payment" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-semibold">Pagamento e Observações</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Forma de Pagamento */}
            <div>
              <Label className="text-foreground mb-3 block">Forma de Pagamento</Label>
              <RadioGroup value={config.paymentType} onValueChange={(v) => updateConfig({ paymentType: v as any })}>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="30-entrada" id="30-entrada" className="mt-1" />
                    <div>
                      <Label htmlFor="30-entrada" className="cursor-pointer font-semibold">
                        Financiamento Próprio - Entrada 30%
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Restante dividido em medições durante a obra
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="5-25-medicao" id="5-25-medicao" className="mt-1" />
                    <div>
                      <Label htmlFor="5-25-medicao" className="cursor-pointer font-semibold">
                        Condição Especial - 5% + 25% + Medição
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        5% na assinatura + 25% em 30 dias + restante por medição
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Observações */}
            <div>
              <Label className="text-foreground mb-2 block">Observações</Label>
              <Textarea
                value={config.observations}
                onChange={(e) => updateConfig({ observations: e.target.value })}
                placeholder="Requisitos especiais, dúvidas ou informações adicionais..."
                className="bg-background min-h-[100px]"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

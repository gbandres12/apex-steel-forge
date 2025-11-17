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
                step={1}
                value={[config.length]}
                onValueChange={(value) => updateConfig({ length: value[0] })}
              />
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
                  <SelectItem value="25">25m</SelectItem>
                  <SelectItem value="30">30m</SelectItem>
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
                  <SelectItem value="6">6m</SelectItem>
                  <SelectItem value="8">8m</SelectItem>
                  <SelectItem value="10">10m</SelectItem>
                  <SelectItem value="12">12m</SelectItem>
                </SelectContent>
              </Select>
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
            {/* Tipo de Cobertura */}
            <div>
              <Label className="text-foreground mb-3 block">Tipo de Cobertura</Label>
              <RadioGroup value={config.roofType} onValueChange={(v) => updateConfig({ roofType: v as any })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comum" id="comum" />
                  <Label htmlFor="comum" className="cursor-pointer">Telha Comum</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="termoacustica" id="termoacustica" />
                  <Label htmlFor="termoacustica" className="cursor-pointer">Telha Termoacústica</Label>
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
                  <SelectItem value="cuiaba">Cuiabá - MT</SelectItem>
                  <SelectItem value="varzea-grande">Várzea Grande - MT</SelectItem>
                  <SelectItem value="rondonopolis">Rondonópolis - MT</SelectItem>
                  <SelectItem value="sinop">Sinop - MT</SelectItem>
                  <SelectItem value="palmas">Palmas - TO</SelectItem>
                  <SelectItem value="porto-velho">Porto Velho - RO</SelectItem>
                  <SelectItem value="rio-branco">Rio Branco - AC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Terreno Nivelado */}
            <div>
              <Label className="text-foreground mb-3 block">O terreno está nivelado?</Label>
              <RadioGroup value={config.terrainLevel} onValueChange={(v) => updateConfig({ terrainLevel: v as any })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="terrain-sim" />
                  <Label htmlFor="terrain-sim" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="terrain-nao" />
                  <Label htmlFor="terrain-nao" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="avista" id="avista" />
                  <Label htmlFor="avista" className="cursor-pointer">À vista (100%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50-50" id="50-50" />
                  <Label htmlFor="50-50" className="cursor-pointer">50% entrada + 50% entrega</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30-70" id="30-70" />
                  <Label htmlFor="30-70" className="cursor-pointer">30% entrada + 70% entrega</Label>
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

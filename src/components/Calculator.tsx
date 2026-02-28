import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CalculatorProps {
  minArea?: number;
}

export const Calculator = ({ minArea = 100 }: CalculatorProps) => {
  const navigate = useNavigate();
  const [projectType, setProjectType] = useState("");
  const [area, setArea] = useState([Math.max(500, minArea)]);
  const [deadline, setDeadline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateSavings = () => {
    if (!projectType || !deadline) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    setShowResults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      toast.error("Por favor, preencha email e telefone para receber o relatório");
      return;
    }
    toast.success("Solicitação enviada! Nossa equipe entrará em contato em breve.");
  };

  const estimatedSavings = area[0] * 150;
  const timeReduction = Math.floor(area[0] / 50);

  return (
    <section id="contato" className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Simulação Rápida</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Estime o Custo do Seu Projeto
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha os dados abaixo para receber uma estimativa inicial. Sem compromisso.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 bg-card border-border">
          <div className="mb-8 text-center">
            <Button onClick={() => navigate("/simulador")} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Abrir Simulador 3D
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Visualize e configure seu projeto em 3D antes de solicitar orçamento
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="project-type" className="text-foreground mb-2 block">Tipo de Projeto</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="project-type" className="bg-background border-border">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="galpao">Galpão Industrial</SelectItem>
                    <SelectItem value="armazem">Armazém Logístico</SelectItem>
                    <SelectItem value="silo">Silo Agrícola</SelectItem>
                    <SelectItem value="edificio">Edifício Modular</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area" className="text-foreground mb-2 block">
                  Área aproximada: <span className="text-primary font-semibold">{area[0]} m²</span>
                </Label>
                <Slider id="area" min={100} max={10000} step={50} value={area} onValueChange={setArea} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="deadline" className="text-foreground mb-2 block">Prazo Desejado</Label>
                <Select value={deadline} onValueChange={setDeadline}>
                  <SelectTrigger id="deadline" className="bg-background border-border">
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Até 30 dias</SelectItem>
                    <SelectItem value="60">Até 60 dias</SelectItem>
                    <SelectItem value="90">Até 90 dias</SelectItem>
                    <SelectItem value="120">Até 120 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateSavings} className="w-full">Calcular Estimativa</Button>
            </div>

            <div className="flex flex-col justify-center">
              {showResults ? (
                <div className="space-y-6">
                  <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Economia Estimada</div>
                    <div className="text-3xl font-bold text-primary">R$ {estimatedSavings.toLocaleString("pt-BR")}</div>
                  </div>

                  <div className="bg-secondary p-6 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Redução de Prazo</div>
                    <div className="text-3xl font-bold text-foreground">{timeReduction} dias</div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground">Receba o estudo de viabilidade completo</p>
                    <Input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background border-border" />
                    <Input type="tel" placeholder="Seu telefone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-background border-border" />
                    <Button type="submit" className="w-full">Solicitar Orçamento</Button>
                  </form>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Preencha os campos ao lado para ver a estimativa</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

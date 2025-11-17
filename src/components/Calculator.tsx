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
import { toast } from "sonner";

export const Calculator = () => {
  const [projectType, setProjectType] = useState("");
  const [area, setArea] = useState([500]);
  const [deadline, setDeadline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Placeholder calculation - will be replaced with actual parameters later
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
    toast.success("Relatório enviado! Nossa equipe entrará em contato em breve.");
  };

  const estimatedSavings = area[0] * 150; // Placeholder formula
  const timeReduction = Math.floor(area[0] / 50); // Placeholder formula

  return (
    <section id="calculator" className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Descubra Quanto Você Pode Economizar.
          </h2>
          <p className="text-xl text-steel-light">
            Calculadora de Economia de Obra
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 bg-card border-border">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="project-type" className="text-foreground mb-2 block">
                  Tipo de Projeto
                </Label>
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
                  Área em m²: <span className="text-primary font-bold">{area[0]} m²</span>
                </Label>
                <Slider
                  id="area"
                  min={100}
                  max={10000}
                  step={50}
                  value={area}
                  onValueChange={setArea}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="text-foreground mb-2 block">
                  Prazo Desejado
                </Label>
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

              <Button 
                onClick={calculateSavings}
                className="w-full shadow-glow"
              >
                Calcular Economia
              </Button>
            </div>

            {/* Results Section */}
            <div className="flex flex-col justify-center">
              {showResults ? (
                <div className="space-y-6">
                  {/* Savings Display */}
                  <div className="bg-gradient-glow p-6 rounded-lg text-center">
                    <div className="text-sm text-primary-foreground mb-2">Economia Estimada</div>
                    <div className="text-4xl font-bold text-primary-foreground">
                      R$ {estimatedSavings.toLocaleString('pt-BR')}
                    </div>
                  </div>

                  {/* Time Reduction */}
                  <div className="bg-secondary p-6 rounded-lg text-center">
                    <div className="text-sm text-secondary-foreground mb-2">Redução de Prazo</div>
                    <div className="text-4xl font-bold text-foreground">
                      {timeReduction} dias
                    </div>
                  </div>

                  {/* Lead Capture Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
                    <p className="text-sm text-center text-muted-foreground">
                      Receba o estudo de viabilidade completo
                    </p>
                    <div>
                      <Input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Seu telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Receber Estudo Completo
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Preencha os campos ao lado para calcular sua economia</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

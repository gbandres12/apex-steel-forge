import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-structure.jpg";

export const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Problem-Focused Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Sua Obra Está <span className="text-primary">Sangrando Dinheiro</span> com Atrasos e Desperdícios?
          </h1>

          {/* Solution Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-steel-light leading-relaxed">
            Estruturas Metálicas com{" "}
            <span className="font-bold text-foreground">Preço Fechado em Contrato</span> e Entrega{" "}
            <span className="font-bold text-primary animate-glow-pulse">Até 40% Mais Rápida</span>.
            <br />
            <span className="text-base md:text-xl">
              Sem Surpresas. Sem Retrabalhos. Sem Dor de Cabeça.
            </span>
          </p>

          {/* CTA */}
          <div className="pt-8">
            <Button 
              onClick={scrollToCalculator}
              size="lg"
              className="text-lg px-8 py-6 shadow-glow hover:shadow-strong transition-all duration-300 transform hover:scale-105"
            >
              🔥 Monte Seu Galpão Agora (Simulador 3D Gratuito)
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>✅ Financiamento Próprio: Entrada de apenas 5%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>✅ +500 Galpões Entregues no Norte e Centro-Oeste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>✅ Garantia de Prazo em Contrato</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-steel-light rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

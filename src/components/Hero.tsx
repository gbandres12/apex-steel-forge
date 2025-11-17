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
            Cansado de <span className="text-primary">Atrasos</span>, <span className="text-primary">Desperdício</span> e{" "}
            <span className="text-primary">Custos Imprevisíveis</span> na Sua Obra?
          </h1>

          {/* Solution Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-steel-light leading-relaxed">
            Almeida Steel: A Engenharia de Estruturas Metálicas que Garante{" "}
            <span className="font-bold text-foreground">Prazo e Preço</span> com Precisão Digital.
            <br />
            Seu Projeto Entregue{" "}
            <span className="font-bold text-primary animate-glow-pulse">Até 40% Mais Rápido</span>.
          </p>

          {/* CTA */}
          <div className="pt-8">
            <Button 
              onClick={scrollToCalculator}
              size="lg"
              className="text-lg px-8 py-6 shadow-glow hover:shadow-strong transition-all duration-300 transform hover:scale-105"
            >
              Calcule Sua Economia Agora (Simulador 3D)
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Certificações ABNT e ISO</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Atuação Norte e Centro-Oeste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>+500 Projetos Entregues</span>
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

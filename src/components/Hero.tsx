import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-structure.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Engenharia de Estruturas Metálicas
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Construímos o Futuro com{" "}
            <span className="text-primary">Aço e Engenharia</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Projetos sob medida em estruturas metálicas para indústria, agronegócio e construção civil. 
            Mais de 15 anos de experiência no Norte e Centro-Oeste do Brasil, com compromisso de prazo e orçamento.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button onClick={scrollToContact} size="lg" className="text-lg px-8 py-6">
              Solicitar Orçamento
            </Button>
            <Button
              onClick={() => navigate("/simulador")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-border"
            >
              Simulador 3D
            </Button>
          </div>

          {/* Trust bar */}
          <div className="pt-12 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
            <span>✓ Preço fechado em contrato</span>
            <span>✓ +500 projetos entregues</span>
            <span>✓ Financiamento com entrada de 5%</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

import { useNavigate } from "react-router-dom";
import { AnimatedShaderHero } from "@/components/ui/animated-shader-hero";

export const Hero = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full">
      <AnimatedShaderHero
        trustBadge={{
          text: "Mais de 15 anos de excelência no setor",
          icons: ["✓"]
        }}
        headline={{
          line1: "Construímos o Futuro com",
          line2: "Aço e Engenharia"
        }}
        subtitle="Projetos sob medida em estruturas metálicas para indústria, agronegócio e construção civil. Mais de 15 anos de experiência no Norte e Centro-Oeste do Brasil, com compromisso de prazo e orçamento."
        buttons={{
          primary: {
            text: "Solicitar Orçamento",
            onClick: scrollToContact
          },
          secondary: {
            text: "Simulador 3D",
            onClick: () => navigate("/simulador")
          }
        }}
      >
        {/* Trust bar */}
        <div className="pt-12 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-foreground/80 font-medium tracking-wide border-t border-border/30 w-full max-w-2xl mx-auto">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Preço fechado em contrato</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> +500 projetos entregues</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Financiamento facilitado</span>
        </div>
      </AnimatedShaderHero>
    </section>
  );
};

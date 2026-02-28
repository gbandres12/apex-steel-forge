import { Card } from "@/components/ui/card";
import warehouseImg from "@/assets/warehouse.jpg";
import agroImg from "@/assets/agro.jpg";
import civilImg from "@/assets/civil.jpg";

const solutions = [
  {
    title: "Galpões Industriais e Armazéns",
    description:
      "Estruturas com vãos livres de até 60 metros, ideais para operações logísticas e industriais que exigem flexibilidade de layout interno.",
    image: warehouseImg,
    highlights: ["Vãos livres até 60 m", "Pé-direito até 12 m", "Montagem em 30–45 dias"],
  },
  {
    title: "Estruturas para o Agronegócio",
    description:
      "Barracões, silos e coberturas projetados para resistir às condições climáticas do Norte, com baixa necessidade de manutenção.",
    image: agroImg,
    highlights: ["Alta resistência a intempéries", "Pintura epóxi anticorrosiva", "Vida útil superior a 30 anos"],
  },
  {
    title: "Edifícios e Estruturas Mistas",
    description:
      "Projetos sob medida com precisão milimétrica, compatíveis com sistemas construtivos em concreto armado e alvenaria.",
    image: civilImg,
    highlights: ["Tolerância dimensional de 2 mm", "Compatível com concreto armado", "Projetos personalizados"],
  },
];

export const Solutions = () => {
  return (
    <section id="solucoes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Áreas de Atuação</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossas Soluções</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Atendemos os principais segmentos com projetos completos — do cálculo estrutural à montagem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-border hover:border-primary/40 transition-all duration-300 bg-card"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>

                <ul className="space-y-1.5 pt-2">
                  {solution.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

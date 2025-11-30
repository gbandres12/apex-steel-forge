import { Card } from "@/components/ui/card";
import warehouseImg from "@/assets/warehouse.jpg";
import agroImg from "@/assets/agro.jpg";
import civilImg from "@/assets/civil.jpg";

const solutions = [
  {
    title: "Galpões Industriais & Armazéns",
    description: "Para quem precisa de vãos livres de até 60m sem pilares internos atrapalhando a operação.",
    image: warehouseImg,
    highlights: ["✓ Vãos livres até 60 metros", "✓ Pé-direito de até 12 metros", "✓ Montagem em 30-45 dias"],
  },
  {
    title: "Estruturas para o Agro",
    description: "Silos, barracões e estruturas que aguentam safra após safra sem manutenção cara.",
    image: agroImg,
    highlights: ["✓ Resistência a intempéries", "✓ Pintura epóxi anticorrosiva", "✓ Vida útil superior a 30 anos"],
  },
  {
    title: "Edifícios & Estruturas Mistas",
    description: "Quando cada centímetro conta: precisão milimétrica para projetos que não toleram erro.",
    image: civilImg,
    highlights: ["✓ Tolerância dimensional de 2mm", "✓ Compatível com concreto armado", "✓ Projetos personalizados"],
  },
];

export const Solutions = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Soluções que Resolvem Problemas Reais.
          </h2>
          <p className="text-xl text-steel-light">
            Do Agro à Indústria Pesada
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <Card 
              key={index}
              className="group overflow-hidden border-border hover:border-primary transition-all duration-300 bg-card"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {solution.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 pt-2">
                  {solution.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-steel-light">{highlight}</span>
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

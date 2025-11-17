import { Card } from "@/components/ui/card";
import warehouseImg from "@/assets/warehouse.jpg";
import agroImg from "@/assets/agro.jpg";
import civilImg from "@/assets/civil.jpg";

const solutions = [
  {
    title: "Logística e Indústria",
    description: "Galpões, Armazéns e Coberturas de Grande Vão",
    image: warehouseImg,
    highlights: ["Vãos livres até 60m", "Montagem em 30 dias", "ROI em 18 meses"],
  },
  {
    title: "Agronegócio",
    description: "Silos, Tanques e Estruturas para Beneficiamento",
    image: agroImg,
    highlights: ["Resistência a intempéries", "Proteção anticorrosiva", "Manutenção mínima"],
  },
  {
    title: "Construção Civil",
    description: "Edifícios Modulares e Estruturas Mistas",
    image: civilImg,
    highlights: ["Precisão construtiva", "Flexibilidade arquitetônica", "Sustentabilidade"],
  },
];

export const Solutions = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Estruturas para Cada Desafio.
          </h2>
          <p className="text-xl text-steel-light">
            Nossas Soluções
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

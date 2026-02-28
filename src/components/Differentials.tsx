import speedIcon from "@/assets/speed-icon.jpg";
import precisionIcon from "@/assets/precision-icon.jpg";
import robustnessIcon from "@/assets/robustness-icon.jpg";

const differentials = [
  {
    icon: speedIcon,
    title: "Agilidade",
    headline: "Entrega até 40% mais rápida",
    description:
      "Estruturas pré-fabricadas em fábrica e montadas no local em semanas. Processo industrializado que reduz prazos, custos com mão de obra e imprevistos climáticos.",
  },
  {
    icon: precisionIcon,
    title: "Previsibilidade",
    headline: "Orçamento fechado em contrato",
    description:
      "Projeto detalhado antes da fabricação garante precisão nos custos. O valor acordado é o valor final — sem aditivos ou surpresas.",
  },
  {
    icon: robustnessIcon,
    title: "Durabilidade",
    headline: "Preparada para condições extremas",
    description:
      "Tratamento anticorrosivo de alto desempenho, dimensionado para o clima amazônico. Estruturas projetadas para durabilidade superior a 30 anos.",
  },
];

export const Differentials = () => {
  return (
    <section id="diferenciais" className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Por Que Nos Escolher</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Diferenciais
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compromisso com qualidade, prazo e transparência em cada etapa do projeto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-lg p-8 hover:border-primary/40 transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">
                <div className="relative w-28 h-28 rounded-lg overflow-hidden">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center space-y-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  {item.title}
                </span>
                <h3 className="text-xl font-bold">{item.headline}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

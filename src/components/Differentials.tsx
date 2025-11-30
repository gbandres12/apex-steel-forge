import speedIcon from "@/assets/speed-icon.jpg";
import precisionIcon from "@/assets/precision-icon.jpg";
import robustnessIcon from "@/assets/robustness-icon.jpg";

const differentials = [
  {
    icon: speedIcon,
    title: "⚡ 40% Mais Rápido",
    headline: "Enquanto Obra Convencional Enfrenta Chuva, Você Já Está Operando",
    description: "Estruturas pré-fabricadas em fábrica. Montagem em campo em semanas, não meses. Menos mão de obra, menos imprevistos.",
  },
  {
    icon: precisionIcon,
    title: "💰 Zero Surpresas no Orçamento",
    headline: "Preço Fechado = Sua Margem Protegida",
    description: "Chega de adicionais por 'imprevistos'. O aço é preciso: o que está no contrato é o que você paga. Ponto final.",
  },
  {
    icon: robustnessIcon,
    title: "🛡️ Estrutura que Enfrenta o Clima da Amazônia",
    headline: "Certificada para os Ambientes Mais Extremos",
    description: "Proteção anticorrosiva de alto desempenho. Projetada para umidade, calor e chuvas intensas do Norte do Brasil.",
  },
];

export const Differentials = () => {
  return (
    <section className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Por Que Nossos Clientes Nunca Voltam para o Concreto?
          </h2>
          <p className="text-xl text-steel-light max-w-2xl mx-auto">
            Três Vantagens Inegociáveis do Aço
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 hover:shadow-card"
            >
              {/* 3D Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={item.icon} 
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg shadow-strong"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Title Badge */}
              <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full mb-4">
                <span className="text-primary text-sm font-semibold">{item.title}</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{item.headline}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import speedIcon from "@/assets/speed-icon.jpg";
import precisionIcon from "@/assets/precision-icon.jpg";
import robustnessIcon from "@/assets/robustness-icon.jpg";

const differentials = [
  {
    icon: speedIcon,
    title: "Velocidade",
    headline: "Montagem Rápida",
    description: "Estruturas pré-fabricadas que reduzem o tempo de obra em semanas.",
  },
  {
    icon: precisionIcon,
    title: "Economia",
    headline: "Custo Fixo e Zero Desperdício",
    description: "Elimine surpresas no orçamento com a precisão do aço.",
  },
  {
    icon: robustnessIcon,
    title: "Robustez",
    headline: "Estruturas Certificadas",
    description: "Segurança e durabilidade garantidas para os ambientes mais exigentes do Norte e Centro-Oeste.",
  },
];

export const Differentials = () => {
  return (
    <section className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Precisão Milimétrica, Força Inabalável.
          </h2>
          <p className="text-xl text-steel-light max-w-2xl mx-auto">
            A Revolução da Construção
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

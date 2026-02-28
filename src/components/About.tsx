import { Shield, Users, Award, Clock } from "lucide-react";

const stats = [
  { icon: Clock, value: "15+", label: "Anos de Experiência" },
  { icon: Shield, value: "500+", label: "Projetos Entregues" },
  { icon: Users, value: "350+", label: "Clientes Atendidos" },
  { icon: Award, value: "100%", label: "Dentro do Orçamento" },
];

export const About = () => {
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-6">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest">Sobre a Empresa</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Engenharia de Estruturas Metálicas com Excelência e Compromisso
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A Almeida Engenharia é referência em projetos de estruturas metálicas no Norte e Centro-Oeste do Brasil. 
              Há mais de 15 anos, atuamos com rigor técnico e compromisso com prazos e orçamentos, entregando soluções 
              que atendem aos mais exigentes padrões de qualidade.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nossa equipe multidisciplinar reúne engenheiros, projetistas e montadores especializados, garantindo 
              acompanhamento integral — do projeto executivo à entrega final. Trabalhamos com transparência, 
              previsibilidade e respeito ao investimento dos nossos clientes.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 text-center space-y-3 hover:border-primary/40 transition-colors">
                <stat.icon className="w-8 h-8 text-primary mx-auto" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

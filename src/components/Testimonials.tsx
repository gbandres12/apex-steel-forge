import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "O galpão de 2.000 m² ficou pronto em 28 dias. A organização e o cumprimento do cronograma foram impecáveis.",
    author: "João Ribeiro",
    role: "CEO",
    company: "TransLog Santarém",
  },
  {
    quote:
      "Orçamento fechado e cumprido integralmente. Em mais de 20 anos contratando obras, foi a primeira vez que isso aconteceu.",
    author: "Maria Conceição",
    role: "Diretora",
    company: "AgroMais S.A.",
  },
  {
    quote:
      "Cinco anos de operação sem nenhum custo de manutenção estrutural. A qualidade do tratamento anticorrosivo é excepcional.",
    author: "Carlos Mendes",
    role: "Proprietário",
    company: "IndústriaMetal",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-industrial">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Depoimentos</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Resultados comprovados em projetos de diferentes portes e segmentos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <Card
              key={index}
              className="p-8 bg-card border-border hover:border-primary/40 transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/15" />
              <div className="space-y-4">
                <p className="text-foreground italic leading-relaxed text-sm">"{t.quote}"</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

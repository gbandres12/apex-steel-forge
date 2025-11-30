import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "O galpão de 2.000m² ficou pronto em 28 dias. Meus concorrentes ainda estavam fundindo pilares de concreto quando eu já estava operando.",
    author: "João Ribeiro",
    role: "CEO",
    company: "TransLog Santarém",
    result: "🏆 Entrega 3 semanas antes do prazo",
  },
  {
    quote: "Orçamento fechado de R$ 850 mil. Paguei exatamente R$ 850 mil. Zero adicionais. Primeira vez em 20 anos de obra que isso acontece.",
    author: "Maria Conceição",
    role: "Diretora",
    company: "AgroMais S.A.",
    result: "💰 100% no orçamento previsto",
  },
  {
    quote: "Estrutura de 5 anos, zero manutenção. Economizei o equivalente a um galpão novo só em custos de reparo que não tive.",
    author: "Carlos Mendes",
    role: "Proprietário",
    company: "IndústriaMetal",
    result: "⭐ R$ 120 mil economizados em manutenção",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-industrial">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Resultados que Falam Mais Alto que Promessas.
          </h2>
          <p className="text-xl text-steel-light">
            O Que Nossos Clientes Conquistaram
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 bg-card border-border hover:border-primary transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20" />
              
              <div className="space-y-4">
                <p className="text-foreground italic leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="pt-4 border-t border-border">
                  <p className="font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-steel-light">{testimonial.company}</p>
                </div>

                <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                  <span className="text-primary text-xs font-semibold">{testimonial.result}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Elements */}
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Galpões Montados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">15 Anos</div>
            <div className="text-sm text-muted-foreground">Construindo no Norte</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">R$ 0</div>
            <div className="text-sm text-muted-foreground">de Aditivos Inesperados</div>
          </div>
        </div>
      </div>
    </section>
  );
};

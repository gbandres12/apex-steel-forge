import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "O galpão foi entregue 3 semanas antes do prazo. Isso nos permitiu começar a operação mais cedo e recuperar o investimento rapidamente.",
    author: "João Silva",
    role: "Diretor de Operações",
    company: "LogNorte Transportes",
    result: "Entrega 3 semanas antecipada",
  },
  {
    quote: "A precisão das estruturas metálicas eliminou os retrabalhos que tínhamos com obras convencionais. Economia real de 35% no orçamento total.",
    author: "Maria Santos",
    role: "Gerente de Projetos",
    company: "AgroMais S.A.",
    result: "35% de economia",
  },
  {
    quote: "Estrutura robusta e certificada. Após 2 anos, zero manutenção necessária. Investimento que valeu cada centavo.",
    author: "Carlos Mendes",
    role: "Proprietário",
    company: "Indústria Metalmec",
    result: "Zero manutenção em 2 anos",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-industrial">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos que Sustentam o Crescimento da Região.
          </h2>
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
            <div className="text-sm text-muted-foreground">Projetos Entregues</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Anos de Experiência</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Clientes Satisfeitos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

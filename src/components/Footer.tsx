import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Almeida Engenharia</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Engenharia de estruturas metálicas com excelência, prazo e compromisso. Atuação no Norte e Centro-Oeste do Brasil.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm">Soluções</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Galpões Industriais</li>
              <li>Armazéns Logísticos</li>
              <li>Estruturas Agrícolas</li>
              <li>Edifícios Modulares</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm">Institucional</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/institucional" className="hover:text-foreground transition-colors">Sobre a Empresa</a></li>
              <li><a href="/institucional#projetos" className="hover:text-foreground transition-colors">Projetos Realizados</a></li>
              <li><a href="/institucional" className="hover:text-foreground transition-colors">Certificações</a></li>
              <li><a href="/institucional" className="hover:text-foreground transition-colors">Ver todos os serviços →</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>(93) 99191-0861</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@almeidaengenharia.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Norte e Centro-Oeste do Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Almeida Engenharia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

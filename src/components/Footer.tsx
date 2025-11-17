import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Almeida Steel</h3>
            <p className="text-sm text-muted-foreground">
              O Futuro da Construção é Feito de Aço.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Soluções</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Galpões Industriais</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Armazéns Logísticos</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Estruturas Agrícolas</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Edifícios Modulares</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Sobre Nós</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Projetos</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Certificações</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Blog</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>(XX) XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@almeidasteel.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span>Norte e Centro-Oeste do Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Almeida Steel. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

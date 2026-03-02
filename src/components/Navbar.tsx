import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Início", id: "hero" },
    { label: "Sobre", id: "sobre" },
    { label: "Diferenciais", id: "diferenciais" },
    { label: "Soluções", id: "solucoes" },
    { label: "Projetos", id: "projetos" },
    { label: "Contato", id: "contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <button onClick={() => scrollTo("hero")} className="flex items-center">
          <img src="/ALMEIDA Engenharia 05.png" alt="Almeida Engenharia" className="h-10 w-auto" />
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <Button size="sm" onClick={() => navigate("/simulador")}>
              Simulador 3D
            </Button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button size="sm" className="w-full" onClick={() => { setIsOpen(false); navigate("/simulador"); }}>
            Simulador 3D
          </Button>
        </div>
      )}
    </nav>
  );
};

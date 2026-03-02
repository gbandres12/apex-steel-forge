import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Differentials } from "@/components/Differentials";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ClientLogos } from "@/components/ClientLogos";
import { Testimonials } from "@/components/Testimonials";
import { Calculator } from "@/components/Calculator";
import { Footer } from "@/components/Footer";
import { MessageCircle, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/warehouse.jpg";

const NavbarLanding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Diferenciais", id: "diferenciais" },
    { label: "Projetos", id: "projetos" },
    { label: "Depoimentos", id: "depoimentos" },
    { label: "Orçamento", id: "contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scrollTo("hero-landing")} className="text-xl font-bold text-primary tracking-tight">
            Almeida Engenharia
          </button>
        </div>

        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.id}>
              <button onClick={() => scrollTo(link.id)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <Link to="/institucional" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre a Empresa
            </Link>
          </li>
          <li>
            <Button size="sm" onClick={() => navigate("/simulador")}>Simulador 3D</Button>
          </li>
        </ul>

        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          {links.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </button>
          ))}
          <Link to="/institucional" className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sobre a Empresa
          </Link>
          <Button size="sm" className="w-full" onClick={() => { setIsOpen(false); navigate("/simulador"); }}>
            Simulador 3D
          </Button>
        </div>
      )}
    </nav>
  );
};

const HeroLanding = ({ porte }: { porte: string }) => {
  const isMedio = porte === "medio";

  return (
    <section id="hero-landing" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            {isMedio ? "Galpões de 1.000 a 3.000 m²" : "Galpões acima de 3.000 m²"}
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {isMedio ? (
              <>Galpões Logísticos <span className="text-primary">Sob Medida</span> — Entrega em até 45 Dias</>
            ) : (
              <>Projetos de <span className="text-primary">Grande Porte</span> — Engenharia para Operações de Escala</>
            )}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {isMedio
              ? "Centros de distribuição, armazéns e operações logísticas com estrutura metálica de alta performance. Preço fechado em contrato, sem surpresas."
              : "Grandes centros logísticos e plantas industriais com vãos livres de até 60m. Projeto, fabricação e montagem com equipe própria e cronograma garantido."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
              size="lg"
              className="text-lg px-8 py-6"
            >
              Solicitar Orçamento
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-border"
            >
              <a href="https://wa.me/5593991910861" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" /> Falar com Engenheiro
              </a>
            </Button>
          </div>

          <div className="pt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            <span>✓ Preço fechado em contrato</span>
            <span>✓ {isMedio ? "Entrega em até 45 dias" : "Cronograma garantido"}</span>
            <span>✓ Financiamento com entrada de 5%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const GalpaoLogistico = () => {
  const [searchParams] = useSearchParams();
  const porte = searchParams.get("porte") || "medio";
  const minArea = porte === "grande" ? 3000 : 1000;

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />
      <HeroLanding porte={porte} />
      <Differentials />
      <ProjectGallery />
      <ClientLogos />
      <Testimonials />
      <Calculator minArea={minArea} />
      <Footer />

      {/* WhatsApp Flutuante */}
      <a
        href="https://wa.me/5593991910861"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default GalpaoLogistico;

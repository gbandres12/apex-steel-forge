import { useNavigate } from "react-router-dom";
import { Warehouse, Building2, ArrowRight, Wheat } from "lucide-react";
import heroImage from "@/assets/hero-structure.jpg";

const Splash = () => {
  const navigate = useNavigate();

  const handleSelect = (porte: "comercial" | "industrial" | "agricola") => {
    localStorage.setItem("porte-galpao", porte);
    navigate(`/galpao-logistico?porte=${porte}`);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center max-w-4xl">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 tracking-tight">
          Almeida Engenharia
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-16">
          Estruturas Metálicas de Alto Desempenho
        </p>

        {/* Question */}
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Qual o porte do galpão
          <br />
          <span className="text-primary">que você precisa?</span>
        </h2>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
          Selecione o tamanho ideal para receber uma proposta personalizada com preço fechado em contrato.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Card Médio */}
          <button
            onClick={() => handleSelect("comercial")}
            className="group bg-card border border-border rounded-xl p-8 text-left hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Warehouse className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Galpão <span className="text-primary">Comercial</span>
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Operações médias, centros de distribuição regional e armazéns logísticos.
            </p>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
              Selecionar <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          {/* Card Grande */}
          <button
            onClick={() => handleSelect("industrial")}
            className="group bg-card border border-border rounded-xl p-8 text-left hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Building2 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Galpão <span className="text-primary">Industrial</span>
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Grandes centros logísticos, plantas industriais e operações de grande escala.
            </p>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
              Selecionar <ArrowRight className="w-4 h-4" />
            </span>
          </button>
          {/* Card Agrícola */}
          <button
            onClick={() => handleSelect("agricola")}
            className="group bg-card border border-border rounded-xl p-8 text-left hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Wheat className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Silos <span className="text-primary">Agrícolas</span>
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Armazenagem de grãos com alta capacidade, aeração e termometria.
            </p>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
              Selecionar <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Link institucional */}
        <a
          onClick={() => navigate("/institucional")}
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors inline-flex items-center gap-1"
        >
          Conheça a Almeida Engenharia <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default Splash;

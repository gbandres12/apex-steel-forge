import { MapPin } from "lucide-react";
import obraGalpaoGrande from "@/assets/obra-galp-grande.jpg";
import obraCobertura from "@/assets/obra-cobertura-arqueada.jpg";
import obraMontagem from "@/assets/obra-montagem-galpao.jpg";
import obraTanques from "@/assets/obra-tanques-industriais.jpg";

const projects = [
  {
    id: 1,
    name: "Galpão Logístico — Montagem em Grande Porte",
    location: "Santarém, PA",
    area: "3.200 m²",
    image: obraGalpaoGrande,
  },
  {
    id: 2,
    name: "Cobertura Metálica Arqueada",
    location: "Santarém, PA",
    area: "1.800 m²",
    image: obraCobertura,
  },
  {
    id: 3,
    name: "Montagem de Estrutura Metálica",
    location: "Santarém, PA",
    area: "2.400 m²",
    image: obraMontagem,
  },
  {
    id: 4,
    name: "Tanques e Estruturas Industriais",
    location: "Santarém, PA",
    area: "4.500 m²",
    image: obraTanques,
  },
];

export const ProjectGallery = () => {
  return (
    <section id="projetos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Portfólio</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projetos Realizados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Obras entregues em Santarém e região — estrutura metálica com qualidade e prazo garantidos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/40 transition-all duration-300 bg-card"
            >
              {/* Imagem */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay escuro no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{project.location}</span>
                  </div>
                  <span className="text-primary text-sm font-semibold">{project.area}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

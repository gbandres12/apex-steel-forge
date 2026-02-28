import { Card } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";

const projects = [
  { id: 1, name: "Galpão Industrial LogNorte", location: "Santarém, PA", area: "2.000 m²" },
  { id: 2, name: "Armazém Logístico TransAmazônia", location: "Manaus, AM", area: "3.500 m²" },
  { id: 3, name: "Estrutura Agrícola AgroMais", location: "Itaituba, PA", area: "1.800 m²" },
  { id: 4, name: "Cobertura Industrial MetalPará", location: "Belém, PA", area: "4.200 m²" },
  { id: 5, name: "Galpão Comercial Centro-Oeste", location: "Cuiabá, MT", area: "2.800 m²" },
  { id: 6, name: "Montagem em Campo – Fase 1", location: "Altamira, PA", area: "5.000 m²" },
];

export const ProjectGallery = () => {
  return (
    <section id="projetos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Portfólio</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projetos Realizados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Da Amazônia ao Centro-Oeste — conheça algumas das nossas entregas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden border-border hover:border-primary/40 transition-all duration-300 bg-card"
            >
              <div className="relative h-56 bg-muted flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Building2 className="w-12 h-12 mb-2 opacity-30" />
                  <p className="text-xs opacity-60">Foto em breve</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{project.location}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <span className="text-primary text-sm font-semibold">{project.area}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Card } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Galpão Industrial LogNorte",
    location: "Santarém, PA",
    area: "2.000 m²",
    placeholder: true,
  },
  {
    id: 2,
    name: "Armazém Logístico TransAmazônia",
    location: "Manaus, AM",
    area: "3.500 m²",
    placeholder: true,
  },
  {
    id: 3,
    name: "Estrutura Agrícola AgroMais",
    location: "Itaituba, PA",
    area: "1.800 m²",
    placeholder: true,
  },
  {
    id: 4,
    name: "Cobertura Industrial MetalPará",
    location: "Belém, PA",
    area: "4.200 m²",
    placeholder: true,
  },
  {
    id: 5,
    name: "Galpão Comercial Centro-Oeste",
    location: "Cuiabá, MT",
    area: "2.800 m²",
    placeholder: true,
  },
  {
    id: 6,
    name: "Montagem em Campo - Fase 1",
    location: "Altamira, PA",
    area: "5.000 m²",
    placeholder: true,
  },
];

export const ProjectGallery = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos que Transformam Regiões.
          </h2>
          <p className="text-xl text-steel-light">
            Da Amazônia ao Centro-Oeste: Estruturas Comprovadas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="group overflow-hidden border-border hover:border-primary transition-all duration-300 bg-card"
            >
              {/* Placeholder Image */}
              <div className="relative h-64 bg-gradient-to-br from-muted to-steel-dark flex items-center justify-center overflow-hidden">
                {project.placeholder && (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="w-16 h-16 mb-2 opacity-30" />
                    <p className="text-sm">Imagem do projeto</p>
                    <p className="text-xs opacity-70">(em breve)</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{project.location}</span>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                    <span className="text-primary text-sm font-semibold">
                      📐 {project.area}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Quer ver seu projeto aqui? Entre em contato.
          </p>
          <a 
            href="https://wa.me/5593991910861" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold"
          >
            💬 WhatsApp: (93) 99191-0861
          </a>
        </div>
      </div>
    </section>
  );
};

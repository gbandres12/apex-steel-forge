const clients = [
    { name: "Raízen", file: "/logo-clientes/raizen logo.png" },
    { name: "Cargill", file: "/logo-clientes/Cargill-Logo-R-Black-and-Leaf-Green-RGB.jpg" },
    { name: "Ipiranga", file: "/logo-clientes/Ipiranga_Logo.jpg" },
    { name: "Alcoa", file: "/logo-clientes/images.png" },
    { name: "TomaSsom", file: "/logo-clientes/images.jpeg" },
    { name: "TV TuView Mídia", file: "/logo-clientes/ba696b28ba884a80bf39f559b372fadd.png" },
];

export const ClientLogos = () => {
    return (
        <section className="py-14 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-10">
                    Empresas que já confiaram na Almeida Engenharia
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                    {clients.map((client) => (
                        <div
                            key={client.name}
                            className="flex items-center justify-center w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                            title={client.name}
                        >
                            <img
                                src={client.file}
                                alt={`Logo ${client.name}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

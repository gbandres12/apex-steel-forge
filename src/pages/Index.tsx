import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Differentials } from "@/components/Differentials";
import { Solutions } from "@/components/Solutions";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Testimonials } from "@/components/Testimonials";
import { Calculator } from "@/components/Calculator";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Differentials />
      <Solutions />
      <ProjectGallery />
      <Testimonials />
      <Calculator />
      <Footer />
    </div>
  );
};

export default Index;

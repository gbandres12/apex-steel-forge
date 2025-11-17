import { Hero } from "@/components/Hero";
import { Differentials } from "@/components/Differentials";
import { Solutions } from "@/components/Solutions";
import { Testimonials } from "@/components/Testimonials";
import { Calculator } from "@/components/Calculator";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Differentials />
      <Solutions />
      <Testimonials />
      <Calculator />
      <Footer />
    </div>
  );
};

export default Index;

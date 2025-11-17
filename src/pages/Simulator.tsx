import { ShedProvider } from "@/contexts/ShedContext";
import { ConfigPanel } from "@/components/simulator/ConfigPanel";
import { ShedVisualizer } from "@/components/simulator/ShedVisualizer";
import { SummaryCard } from "@/components/simulator/SummaryCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Simulator = () => {
  const navigate = useNavigate();

  return (
    <ShedProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border py-4 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Simulador 3D de Galpões</h1>
                <p className="text-sm text-muted-foreground">Configure e visualize seu projeto em tempo real</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">Almeida Steel</div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-[400px_1fr] gap-0">
          {/* Left Panel - Configuration */}
          <div className="border-r border-border overflow-hidden">
            <ConfigPanel />
          </div>

          {/* Right Panel - 3D View + Summary */}
          <div className="flex flex-col">
            {/* 3D Visualizer */}
            <div className="flex-1 min-h-[500px]">
              <ShedVisualizer />
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-gradient-steel border-t border-border">
              <SummaryCard />
            </div>
          </div>
        </div>
      </div>
    </ShedProvider>
  );
};

export default Simulator;

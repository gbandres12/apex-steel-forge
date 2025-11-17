import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useShed } from "@/contexts/ShedContext";
import * as THREE from "three";

const ShedStructure = () => {
  const { config } = useShed();
  const structureColor = "#8B0000"; // Vermelho escuro
  const roofColor = config.roofType === "termoacustica" ? "#C0C0C0" : "#808080";

  const pillarCount = Math.ceil(config.length / 5); // Pilares a cada 5m
  const pillarPositions: [number, number, number][] = [];

  // Posições dos pilares nas quatro quinas
  for (let i = 0; i < pillarCount; i++) {
    const x = (i / (pillarCount - 1)) * config.length - config.length / 2;
    pillarPositions.push([x, config.height / 2, -config.width / 2]);
    pillarPositions.push([x, config.height / 2, config.width / 2]);
  }

  return (
    <group>
      {/* Pilares */}
      {pillarPositions.map((pos, idx) => (
        <mesh key={`pillar-${idx}`} position={pos}>
          <boxGeometry args={[0.3, config.height, 0.3]} />
          <meshStandardMaterial color={structureColor} />
        </mesh>
      ))}

      {/* Vigas longitudinais */}
      <mesh position={[0, config.height, -config.width / 2]}>
        <boxGeometry args={[config.length, 0.3, 0.3]} />
        <meshStandardMaterial color={structureColor} />
      </mesh>
      <mesh position={[0, config.height, config.width / 2]}>
        <boxGeometry args={[config.length, 0.3, 0.3]} />
        <meshStandardMaterial color={structureColor} />
      </mesh>

      {/* Vigas transversais */}
      {Array.from({ length: pillarCount }).map((_, i) => {
        const x = (i / (pillarCount - 1)) * config.length - config.length / 2;
        return (
          <mesh key={`beam-${i}`} position={[x, config.height, 0]}>
            <boxGeometry args={[0.3, 0.3, config.width]} />
            <meshStandardMaterial color={structureColor} />
          </mesh>
        );
      })}

      {/* Cobertura */}
      <mesh position={[0, config.height + 1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[config.length, 0.1, config.width]} />
        <meshStandardMaterial color={roofColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Paredes (se ativado) */}
      {config.showWalls && (
        <>
          {/* Parede frontal */}
          <mesh position={[-config.length / 2, config.height / 2, 0]}>
            <boxGeometry args={[0.1, config.height, config.width]} />
            <meshStandardMaterial color="#DCDCDC" transparent opacity={0.3} />
          </mesh>
          {/* Parede traseira */}
          <mesh position={[config.length / 2, config.height / 2, 0]}>
            <boxGeometry args={[0.1, config.height, config.width]} />
            <meshStandardMaterial color="#DCDCDC" transparent opacity={0.3} />
          </mesh>
          {/* Paredes laterais */}
          <mesh position={[0, config.height / 2, -config.width / 2]}>
            <boxGeometry args={[config.length, config.height, 0.1]} />
            <meshStandardMaterial color="#DCDCDC" transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, config.height / 2, config.width / 2]}>
            <boxGeometry args={[config.length, config.height, 0.1]} />
            <meshStandardMaterial color="#DCDCDC" transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* Mezanino (se ativado) */}
      {config.hasMezzanine && (
        <group>
          <mesh position={[0, config.height / 2, 0]}>
            <boxGeometry args={[config.mezzanineLength, 0.2, config.mezzanineWidth]} />
            <meshStandardMaterial color="#A9A9A9" />
          </mesh>
          {/* Pilares do mezanino */}
          {[
            [-config.mezzanineLength / 2, config.height / 4, -config.mezzanineWidth / 2],
            [config.mezzanineLength / 2, config.height / 4, -config.mezzanineWidth / 2],
            [-config.mezzanineLength / 2, config.height / 4, config.mezzanineWidth / 2],
            [config.mezzanineLength / 2, config.height / 4, config.mezzanineWidth / 2],
          ].map((pos, idx) => (
            <mesh key={`mez-pillar-${idx}`} position={pos as [number, number, number]}>
              <boxGeometry args={[0.2, config.height / 2, 0.2]} />
              <meshStandardMaterial color={structureColor} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export const ShedVisualizer = () => {
  const { config } = useShed();
  const maxDimension = Math.max(config.length, config.width, config.height);

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-100">
      <Canvas
        camera={{
          position: [maxDimension * 1.5, maxDimension * 0.8, maxDimension * 1.5],
          fov: 50,
        }}
      >
        {/* Iluminação */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Controles de órbita */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={maxDimension * 3}
        />

        {/* Grid (piso de concreto) */}
        <Grid
          args={[config.length * 2, config.width * 2]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#8d8d8d"
          fadeDistance={maxDimension * 3}
          fadeStrength={1}
          followCamera={false}
          position={[0, 0, 0]}
        />

        {/* Estrutura do galpão */}
        <ShedStructure />
      </Canvas>
    </div>
  );
};

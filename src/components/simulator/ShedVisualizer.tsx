import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useShed } from "@/contexts/ShedContext";
import * as THREE from "three";
import { RectangularTruss } from "./RectangularTruss";
import { IBeamTruss } from "./IBeamTruss";
import { Environment } from "./Environment";

const ShedStructure = () => {
  const { config } = useShed();
  const structureColor = "#8B0000"; // Vermelho escuro
  const roofColor = config.roofType === "termoacustica" ? "#C0C0C0" : "#808080";

  const pillarSpacing = 6; // Pilares a cada 6m (múltiplos de 6)
  const pillarCount = Math.ceil(config.length / pillarSpacing) + 1;
  const pillarPositions: [number, number, number][] = [];

  // Posições dos pilares nas laterais
  for (let i = 0; i < pillarCount; i++) {
    const x = (i * pillarSpacing) - config.length / 2;
    pillarPositions.push([x, config.height / 2, -config.width / 2]);
    pillarPositions.push([x, config.height / 2, config.width / 2]);
  }

  // Número de treliças (uma a cada 6m)
  const trussCount = Math.floor(config.length / 6);
  const trussPositions: [number, number, number][] = [];

  for (let i = 0; i < trussCount; i++) {
    const x = (i * 6) - config.length / 2 + 3; // Centralizar entre pilares
    trussPositions.push([x, config.height + 0.75, 0]);
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

      {/* Vigas / Treliças transversais */}
      {Array.from({ length: pillarCount }).map((_, i) => {
        const x = (i * pillarSpacing) - config.length / 2;
        if (config.structureType === "viga-i") {
          // Viga I posicionada no topo dos pilares
          return (
            <IBeamTruss
              key={`ibeam-${i}`}
              width={config.width}
              position={[x, config.height + 0.4, 0]}
            />
          );
        } else {
          // Treliça retangular
          return (
            <RectangularTruss
              key={`truss-${i}`}
              width={config.width}
              height={1.5}
              position={[x, config.height + 0.75, 0]}
            />
          );
        }
      })}

      {/* Cobertura - levemente acima das treliças */}
      <mesh position={[0, config.height + 1.6, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[config.length, 0.08, config.width]} />
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
    <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-100">
      <Canvas
        shadows
        camera={{
          position: [maxDimension * 1.8, maxDimension * 1.2, maxDimension * 1.8],
          fov: 50,
        }}
      >
        {/* Iluminação melhorada com sombras */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 30]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <directionalLight position={[-20, 20, -20]} intensity={0.3} />
        <hemisphereLight args={["#87CEEB", "#6B8E23", 0.4]} />

        {/* Controles de órbita */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={maxDimension * 4}
          maxPolarAngle={Math.PI / 2.1} // Limitar rotação para não ir abaixo do chão
        />

        {/* Ambiente (árvores, plantas, terreno) */}
        <Environment shedLength={config.length} shedWidth={config.width} />

        {/* Estrutura do galpão */}
        <ShedStructure />
      </Canvas>
    </div>
  );
};

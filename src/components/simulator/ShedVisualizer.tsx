import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useShed } from "@/contexts/ShedContext";
import * as THREE from "three";
import { Environment } from "./Environment";
import { GabledTruss } from "./GabledTruss";
import { SiloStructure } from "./SiloStructure";

// ─── Gabled roof surface (duas águas) ────────────────────────────────────────
interface RoofProps {
  span: number;
  length: number;
  rise: number;
  color: string;
}

const GabledRoof = ({ span, length, rise, color }: RoofProps) => {
  const half = span / 2;
  const slopeLength = Math.sqrt(half * half + rise * rise);
  const angle = Math.atan2(rise, half);

  return (
    <group>
      {/* Left side (negative z) */}
      <mesh position={[0, rise / 2, -half / 2]} rotation={[-Math.PI / 2 - angle, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[length, slopeLength]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.4} metalness={0.55} />
      </mesh>

      {/* Right side (positive z) */}
      <mesh position={[0, rise / 2, half / 2]} rotation={[-Math.PI / 2 + angle, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[length, slopeLength]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.4} metalness={0.55} />
      </mesh>
    </group>
  );
};

// ─── Purlins positions for gabled roof ───────────────────────────────────────
function gabledPurlinPositions(span: number, rise: number, count = 7) {
  const half = span / 2;
  const slopeAngle = Math.atan2(rise, half);
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const z = -half + t * span;
    const y = rise - Math.abs(z / half) * rise;
    const rotX = z < 0 ? slopeAngle : -slopeAngle;
    return { z, y, rotation: [rotX, 0, 0] as [number, number, number] };
  });
}

// ─── Full shed structure ──────────────────────────────────────────────────────
const ShedStructure = () => {
  const { config } = useShed();

  const length = config.profundidade;
  const span = config.vaoLivre;
  const colH = config.pillarType === "com-pilar" ? config.peireito : 6;
  const rise = Math.max(1.2, span * 0.22); // ≈ 22% do vão, mín 1,2 m

  const roofColor = config.roofTileType === "termoacustica" ? "#C8C8C8" : "#A0A8B0";
  const steel = "#8B1010";

  // Grade de pilares: a cada 6 m ao longo de X
  const colSpacing = 6;
  const colCount = Math.ceil(length / colSpacing) + 1;
  const colPositionsX: number[] = Array.from(
    { length: colCount },
    (_, i) => i * colSpacing - length / 2
  );

  const purlinPos = gabledPurlinPositions(span, rise);

  const showWalls = config.closureOption !== "sem-fechamento";
  const wallFactor = config.closureOption === "parcial" ? 0.8 : 1.0;
  const wallH = colH * wallFactor;

  return (
    <group>
      {/* ── Pilares ── */}
      {colPositionsX.map((cx) => (
        <group key={`cols-${cx}`}>
          <mesh position={[cx, colH / 2, -span / 2]}>
            <boxGeometry args={[0.25, colH, 0.25]} />
            <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[cx, colH / 2, span / 2]}>
            <boxGeometry args={[0.25, colH, 0.25]} />
            <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Viga de cumeeira */}
          <mesh position={[cx, colH, 0]}>
            <boxGeometry args={[0.2, 0.2, span]} />
            <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Vigas longitudinais de beiral ── */}
      <mesh position={[0, colH, -span / 2]}>
        <boxGeometry args={[length, 0.2, 0.2]} />
        <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, colH, span / 2]}>
        <boxGeometry args={[length, 0.2, 0.2]} />
        <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* ── Tesouras (uma por linha de pilares) ── */}
      {colPositionsX.map((cx) => (
        <GabledTruss
          key={`truss-${cx}`}
          span={span}
          riseHeight={rise}
          position={[cx, colH, 0]}
        />
      ))}

      {/* ── Terças ── */}
      {purlinPos.map(({ z, y, rotation }, idx) => (
        <mesh key={`purlin-${idx}`} position={[0, colH + y - 0.05, z]} rotation={rotation}>
          <boxGeometry args={[length, 0.12, 0.12]} />
          <meshStandardMaterial color={steel} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* ── Superfície do telhado ── */}
      <group position={[0, colH, 0]}>
        <GabledRoof span={span} length={length} rise={rise} color={roofColor} />
      </group>

      {/* ── Fechamento lateral ── */}
      {showWalls && (
        <>
          <mesh position={[-length / 2, wallH / 2, 0]}>
            <boxGeometry args={[0.08, wallH, span]} />
            <meshStandardMaterial color="#B0C4DE" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[length / 2, wallH / 2, 0]}>
            <boxGeometry args={[0.08, wallH, span]} />
            <meshStandardMaterial color="#B0C4DE" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, wallH / 2, -span / 2]}>
            <boxGeometry args={[length, wallH, 0.08]} />
            <meshStandardMaterial color="#B0C4DE" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, wallH / 2, span / 2]}>
            <boxGeometry args={[length, wallH, 0.08]} />
            <meshStandardMaterial color="#B0C4DE" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  );
};



// ─── Main exported component ──────────────────────────────────────────────────
export const ShedVisualizer = () => {
  const { config } = useShed();
  const length = config.profundidade;
  const span = config.vaoLivre;
  const colH = config.pillarType === "com-pilar" ? config.peireito : 6;
  const isAgricola = config.structureCategory === "agricola";
  const isIndustrial = config.structureCategory === "industrial";

  let maxDim = Math.max(length, span, colH);
  if (isAgricola) {
    const volumeM3 = config.siloCapacityBags * 0.075;
    const diameter = Math.max(4, Math.pow(volumeM3, 0.35));
    const cylinderHeight = Math.max(3, volumeM3 / (Math.PI * Math.pow(diameter / 2, 2)));
    maxDim = Math.max(diameter, cylinderHeight) * 1.2;
  }

  const camDist = maxDim * 1.6;

  return (
    // Wrapper relativo para permitir overlay sobre o Canvas
    <div className="w-full h-full relative">
      {/* Canvas fica sempre montado — evita destruição do contexto WebGL */}
      <div
        className="w-full h-full"
        style={{
          // Quando industrial, ocultamos o canvas atrás do overlay mas não o desmontamos
          visibility: isIndustrial ? "hidden" : "visible",
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-slate-200 to-slate-50">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
              powerPreference: "high-performance",
            }}
            camera={{
              position: [camDist * 1.1, camDist * 0.55, camDist * 0.9],
              fov: 48,
            }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[60, 80, 40]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0005}
              shadow-camera-far={300}
              shadow-camera-left={-80}
              shadow-camera-right={80}
              shadow-camera-top={80}
              shadow-camera-bottom={-80}
            />
            <directionalLight position={[-30, 30, -20]} intensity={0.5} />
            <hemisphereLight args={["#ffffff", "#e2e8f0", 0.6]} />

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={8}
              maxDistance={maxDim * 5}
              maxPolarAngle={Math.PI / 2.05}
            />

            <Environment
              shedLength={isAgricola ? maxDim : length}
              shedWidth={isAgricola ? maxDim : span}
            />
            {isAgricola ? <SiloStructure /> : <ShedStructure />}
          </Canvas>
        </div>
      </div>

      {/* Overlay Industrial — não desmonta o Canvas, apenas cobre */}
      {isIndustrial && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center text-slate-400 space-y-4">
            <div className="text-6xl">🏭</div>
            <p className="text-lg font-semibold text-slate-300">Estrutura Industrial</p>
            <p className="text-sm max-w-xs">
              Preencha o formulário ao lado para solicitar proposta personalizada com análise
              técnica.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

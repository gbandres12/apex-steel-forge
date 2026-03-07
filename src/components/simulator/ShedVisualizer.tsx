import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useShed } from "@/contexts/ShedContext";
import * as THREE from "three";
import { Environment } from "./Environment";
import { ArchedTruss } from "./ArchedTruss";

// ─── Curved roof surface (barrel vault) ──────────────────────────────────────
interface CurvedRoofProps {
  span: number;      // vão livre (width = Z axis)
  length: number;    // profundidade (X axis)
  rise: number;      // apex height above column tops
  color: string;
}

const CurvedRoof = ({ span, length, rise, color }: CurvedRoofProps) => {
  const geometry = useMemo(() => {
    const SEG_RADIAL = 32;   // smoothness of the arch curve
    const SEG_LENGTH = Math.max(4, Math.round(length / 6)); // segments along length

    const half = span / 2;
    // Circle radius: R = (half² + rise²) / (2 * rise)
    const R = (half * half + rise * rise) / (2 * rise);

    // Total arc angle
    const halfAngle = Math.asin(half / R);   // angle from bottom (π) to edge
    const startAngle = Math.PI - halfAngle;
    const endAngle = Math.PI + halfAngle;
    const arcSpan = endAngle - startAngle; // always ≤ π

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Y offset so that the base of the arch (at the columns) is at y=0
    const archCenterY = R - rise;

    for (let j = 0; j <= SEG_LENGTH; j++) {
      const x = (j / SEG_LENGTH) * length - length / 2;
      const u = j / SEG_LENGTH;

      for (let i = 0; i <= SEG_RADIAL; i++) {
        const t = i / SEG_RADIAL;
        const ang = startAngle + t * arcSpan;

        // In the cross-section plane (ZY):
        //   Z = R * cos(ang)   → runs from -half to +half
        //   Y = R * sin(ang) - archCenterY  → 0 at edges, rise at apex
        const z = R * Math.cos(ang);
        const y = R * Math.sin(ang) - archCenterY;

        positions.push(x, y, z);

        // Normal points outward along the arc radius
        const ny = Math.sin(ang);
        const nz = Math.cos(ang);
        normals.push(0, ny, nz);

        uvs.push(u, t);
      }
    }

    // Build triangle indices
    const cols = SEG_RADIAL + 1;
    for (let j = 0; j < SEG_LENGTH; j++) {
      for (let i = 0; i < SEG_RADIAL; i++) {
        const a = j * cols + i;
        const b = a + 1;
        const c = (j + 1) * cols + i;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }, [span, length, rise]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.55}
      />
    </mesh>
  );
};

// ─── Full shed structure ──────────────────────────────────────────────────────
const ShedStructure = () => {
  const { config } = useShed();

  const length = config.profundidade;   // runs along X
  const span = config.vaoLivre;       // runs along Z (clear span)
  const colH = config.pillarType === "com-pilar" ? config.peireito : 6;
  const rise = Math.max(1.2, span * 0.22); // arch rise ≈ 22% of span, min 1.2m

  const roofColor =
    config.roofTileType === "termoacustica" ? "#C8C8C8" : "#A0A8B0";
  const steel = "#8B1010";

  // Column grid: every 6 m along X, two per row (left & right of span)
  const colSpacing = 6;
  const colCount = Math.ceil(length / colSpacing) + 1;
  const colPositionsX: number[] = Array.from(
    { length: colCount },
    (_, i) => i * colSpacing - length / 2
  );

  // Purlins (terças) running along X, distributed along the arc
  const PURLIN_COUNT = 7;

  const purlinArcPositions = useMemo(() => {
    const half = span / 2;
    const R = (half * half + rise * rise) / (2 * rise);
    const archCenterY = R - rise;
    const halfAngle = Math.asin(half / R);
    const startAngle = Math.PI - halfAngle;
    const arcSpan = 2 * halfAngle;

    return Array.from({ length: PURLIN_COUNT }, (_, i) => {
      const t = i / (PURLIN_COUNT - 1);
      const ang = startAngle + t * arcSpan;
      const z = Math.round(10000 * (span / 2) * Math.cos(Math.PI - ang)) / 10000; // flip for our coord
      const y = (Math.sin(ang) * R) - archCenterY;
      return { z, y };
    });
  }, [span, rise]);

  const showWalls = config.closureOption !== "sem-fechamento";
  const wallFactor = config.closureOption === "parcial" ? 0.8 : 1.0;
  const wallH = colH * wallFactor;

  return (
    <group>
      {/* ── Columns ── */}
      {colPositionsX.map((cx) => (
        <group key={`cols-${cx}`}>
          {/* Left column */}
          <mesh position={[cx, colH / 2, -span / 2]}>
            <boxGeometry args={[0.25, colH, 0.25]} />
            <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Right column */}
          <mesh position={[cx, colH / 2, span / 2]}>
            <boxGeometry args={[0.25, colH, 0.25]} />
            <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Top rail connecting the two columns */}
          <mesh position={[cx, colH, 0]}>
            <boxGeometry args={[0.2, 0.2, span]} />
            <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Side longitudinal rails (eaves beams) ── */}
      <mesh position={[0, colH, -span / 2]}>
        <boxGeometry args={[length, 0.2, 0.2]} />
        <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, colH, span / 2]}>
        <boxGeometry args={[length, 0.2, 0.2]} />
        <meshStandardMaterial color={steel} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* ── Arched truss frames (one per column line) ── */}
      {colPositionsX.map((cx) => (
        <ArchedTruss
          key={`truss-${cx}`}
          span={span}
          riseHeight={rise}
          position={[cx, colH, 0]}
        />
      ))}

      {/* ── Purlins (terças) along the arch, running the full length ── */}
      {purlinArcPositions.map(({ z, y }, idx) => (
        <mesh key={`purlin-${idx}`} position={[0, colH + y, z]}>
          <boxGeometry args={[length, 0.12, 0.12]} />
          <meshStandardMaterial color={steel} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* ── Curved roof surface ── */}
      <group position={[0, colH, 0]}>
        <CurvedRoof span={span} length={length} rise={rise} color={roofColor} />
      </group>

      {/* ── Lateral closure walls ── */}
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
  const maxDim = Math.max(length, span, colH);

  // Camera: positioned to reveal the arch — lower & slightly front/side
  const camDist = maxDim * 1.5;

  if (config.structureCategory === "industrial") {
    return (
      <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-400 space-y-4">
          <div className="text-6xl">🏭</div>
          <p className="text-lg font-semibold text-slate-300">Estrutura Industrial</p>
          <p className="text-sm max-w-xs">Preencha o formulário ao lado para solicitar proposta personalizada com análise técnica.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-100">
      <Canvas
        shadows
        camera={{
          position: [camDist * 1.1, camDist * 0.55, camDist * 0.9],
          fov: 48,
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[60, 60, 40]}
          intensity={1.3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={300}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />
        <directionalLight position={[-30, 30, -20]} intensity={0.35} />
        <hemisphereLight args={["#87CEEB", "#6B8E23", 0.45]} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={8}
          maxDistance={maxDim * 5}
          maxPolarAngle={Math.PI / 2.05}
        />

        <Environment shedLength={length} shedWidth={span} />
        <ShedStructure />
      </Canvas>
    </div>
  );
};

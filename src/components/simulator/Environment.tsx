import { useMemo } from "react";
import * as THREE from "three";

interface EnvironmentProps {
  shedLength: number;
  shedWidth: number;
}

const Tree = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const trunkHeight = 3 * scale;
  const crownRadius = 2 * scale;
  
  return (
    <group position={position}>
      {/* Tronco */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.3 * scale, 0.4 * scale, trunkHeight, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Copa - camadas de folhagem */}
      <mesh position={[0, trunkHeight + crownRadius * 0.5, 0]}>
        <sphereGeometry args={[crownRadius, 8, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, trunkHeight + crownRadius * 0.8, 0]}>
        <sphereGeometry args={[crownRadius * 0.8, 8, 8]} />
        <meshStandardMaterial color="#2E8B57" />
      </mesh>
      <mesh position={[0, trunkHeight + crownRadius * 1.1, 0]}>
        <sphereGeometry args={[crownRadius * 0.6, 8, 8]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
    </group>
  );
};

const Bush = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.5 * scale, 0]} scale={[1, 0.7, 1]}>
        <sphereGeometry args={[0.8 * scale, 8, 6]} />
        <meshStandardMaterial color="#3CB371" />
      </mesh>
    </group>
  );
};

export const Environment = ({ shedLength, shedWidth }: EnvironmentProps) => {
  // Gerar posições aleatórias mas fixas para árvores e arbustos
  const { treePositions, bushPositions } = useMemo(() => {
    const minDistance = 8; // Distância mínima do galpão
    const trees: Array<{ pos: [number, number, number]; scale: number }> = [];
    const bushes: Array<{ pos: [number, number, number]; scale: number }> = [];
    
    const areaSize = Math.max(shedLength, shedWidth) * 1.5;
    
    // Gerar 10 árvores
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
      const distance = minDistance + Math.random() * (areaSize / 2);
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const scale = 0.8 + Math.random() * 0.6;
      
      trees.push({ pos: [x, 0, z], scale });
    }
    
    // Gerar 20 arbustos
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = minDistance + Math.random() * areaSize;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const scale = 0.6 + Math.random() * 0.8;
      
      bushes.push({ pos: [x, 0, z], scale });
    }
    
    return { treePositions: trees, bushPositions: bushes };
  }, [shedLength, shedWidth]);

  const groundSize = Math.max(shedLength, shedWidth) * 3;

  return (
    <group>
      {/* Terreno com textura */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[groundSize, groundSize, 32, 32]} />
        <meshStandardMaterial 
          color="#7A6F47" 
          roughness={0.9}
        />
      </mesh>

      {/* Grama ao redor (mais próximo do galpão) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[groundSize * 0.6, groundSize * 0.6, 16, 16]} />
        <meshStandardMaterial 
          color="#6B8E23" 
          roughness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Árvores */}
      {treePositions.map((tree, idx) => (
        <Tree key={`tree-${idx}`} position={tree.pos} scale={tree.scale} />
      ))}

      {/* Arbustos */}
      {bushPositions.map((bush, idx) => (
        <Bush key={`bush-${idx}`} position={bush.pos} scale={bush.scale} />
      ))}
    </group>
  );
};

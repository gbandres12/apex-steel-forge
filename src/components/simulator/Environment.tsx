import * as THREE from "three";

interface EnvironmentProps {
  shedLength: number;
  shedWidth: number;
}

export const Environment = ({ shedLength, shedWidth }: EnvironmentProps) => {
  const maxDim = Math.max(shedLength, shedWidth);
  const groundSize = maxDim * 5;

  return (
    <group>
      {/* Grid helper for scale */}
      <gridHelper 
        args={[groundSize, Math.max(10, Math.floor(groundSize / 2)), 0x000000, 0x000000]} 
        position={[0, 0.01, 0]} 
      />
      
      {/* Clean floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial 
          color="#f4f4f5" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

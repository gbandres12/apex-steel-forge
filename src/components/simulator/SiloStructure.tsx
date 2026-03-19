import { useShed } from "@/contexts/ShedContext";
import * as THREE from "three";
import { useMemo } from "react";

export const SiloStructure = () => {
  const { config } = useShed();
  
  // Approximate proportions based on capacity
  // 1 bag (saca) = ~0.075 cubic meters
  const volumeM3 = config.siloCapacityBags * 0.075;
  
  // Pick a realistic diameter based on capacity
  const diameter = Math.max(4, Math.pow(volumeM3, 0.35));
  const radius = diameter / 2;
  // Volume of cylinder V = PI * r^2 * h  => h = V / (PI * r^2)
  const cylinderHeight = Math.max(3, volumeM3 / (Math.PI * radius * radius));
  const roofHeight = radius * 0.6; // 30-degree slope approx
  const isConico = config.siloType === "fundo-conico";
  const bottomHeight = isConico ? radius * 0.8 : 0;
  
  const steelPath = "#E2E8F0"; // Chaparia galvanizada clara
  const darkSteel = "#64748B"; // Estrutura de suporte e passarela

  return (
    <group position={[0, isConico ? bottomHeight : 0, 0]}>
      {/* Corpo Cilíndrico */}
      <mesh position={[0, cylinderHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
        <meshStandardMaterial color={steelPath} roughness={0.6} metalness={0.7} />
      </mesh>
      
      {/* Teto Cônico */}
      <mesh position={[0, cylinderHeight + roofHeight / 2, 0]} castShadow receiveShadow>
        <coneGeometry args={[radius * 1.05, roofHeight, 32]} />
        <meshStandardMaterial color={steelPath} roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Fundo Cônico Elevado (se aplicável) */}
      {isConico && (
        <>
          <mesh position={[0, -bottomHeight / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[radius, 0.5, bottomHeight, 32]} />
            <meshStandardMaterial color={steelPath} roughness={0.6} metalness={0.7} />
          </mesh>
          {/* Suportes do fundo cônico (pilares em anel) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const px = Math.cos(angle) * (radius - 0.2);
            const pz = Math.sin(angle) * (radius - 0.2);
            return (
              <mesh key={`pilar-${i}`} position={[px, -bottomHeight / 2, pz]} castShadow receiveShadow>
                <cylinderGeometry args={[0.15, 0.15, bottomHeight, 8]} />
                <meshStandardMaterial color={darkSteel} roughness={0.7} metalness={0.5} />
              </mesh>
            );
          })}
        </>
      )}

      {/* Escada Marinheiro Lateral */}
      <mesh position={[radius + 0.3, cylinderHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, cylinderHeight, 0.4]} />
        <meshStandardMaterial color={darkSteel} roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Passarela (se aplicável) */}
      {config.siloPassarela && (
         <mesh position={[0, cylinderHeight + roofHeight * 1.05, 0]} castShadow receiveShadow>
           <boxGeometry args={[radius * 3, 0.2, 1.2]} />
           <meshStandardMaterial color={darkSteel} roughness={0.7} metalness={0.5} />
         </mesh>
      )}
    </group>
  );
};

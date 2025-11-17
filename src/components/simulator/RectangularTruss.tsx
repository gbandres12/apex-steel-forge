import { useMemo } from "react";

interface RectangularTrussProps {
  width: number;
  height: number;
  position: [number, number, number];
}

export const RectangularTruss = ({ width, height, position }: RectangularTrussProps) => {
  const structureColor = "#8B0000"; // Vermelho escuro
  const barThickness = 0.15;
  const trussHeight = 1.5;

  // Criar a estrutura da treliça
  const trussElements = useMemo(() => {
    const elements = [];
    const numVerticals = 5; // Número de montantes verticais
    const spacing = width / (numVerticals - 1);
    const internalWidth = width * 0.95; // Reduzir 5% para evitar sobras nas laterais

    // Vigas superiores e inferiores (internas)
    elements.push(
      // Viga superior
      { pos: [0, trussHeight / 2, 0], args: [barThickness, barThickness, internalWidth] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number] },
      // Viga inferior
      { pos: [0, -trussHeight / 2, 0], args: [barThickness, barThickness, internalWidth] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number] },
    );

    // Montantes verticais
    for (let i = 0; i < numVerticals; i++) {
      const z = -internalWidth / 2 + i * (internalWidth / (numVerticals - 1));
      
      elements.push(
        { pos: [0, 0, z], args: [barThickness, trussHeight, barThickness] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] }
      );
    }

    // Diagonais para reforço estrutural
    for (let i = 0; i < numVerticals - 1; i++) {
      const z1 = -internalWidth / 2 + i * (internalWidth / (numVerticals - 1));
      const z2 = -internalWidth / 2 + (i + 1) * (internalWidth / (numVerticals - 1));
      const zMid = (z1 + z2) / 2;
      const segmentSpacing = internalWidth / (numVerticals - 1);
      const diagonalLength = Math.sqrt(Math.pow(segmentSpacing, 2) + Math.pow(trussHeight, 2));
      const angle = Math.atan2(trussHeight, segmentSpacing);

      // Diagonal ascendente
      elements.push({
        pos: [0, 0, zMid],
        args: [barThickness, barThickness, diagonalLength] as [number, number, number],
        rotation: [angle, 0, Math.PI / 2] as [number, number, number]
      });

      // Diagonal descendente
      elements.push({
        pos: [0, 0, zMid],
        args: [barThickness, barThickness, diagonalLength] as [number, number, number],
        rotation: [-angle, 0, Math.PI / 2] as [number, number, number]
      });
    }

    return elements;
  }, [width, trussHeight]);

  return (
    <group position={position}>
      {trussElements.map((element, idx) => (
        <mesh key={`truss-element-${idx}`} position={element.pos} rotation={element.rotation}>
          <boxGeometry args={element.args} />
          <meshStandardMaterial color={structureColor} />
        </mesh>
      ))}
    </group>
  );
};

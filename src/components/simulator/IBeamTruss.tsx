interface IBeamTrussProps {
    width: number;
    position: [number, number, number];
}

// Representa uma viga I (alma cheia) transversal ao vão
export const IBeamTruss = ({ width, position }: IBeamTrussProps) => {
    const color = "#8B0000";
    const flangeThick = 0.18;  // mesa (flange)
    const webThick = 0.1;      // alma
    const beamHeight = 0.8;    // altura total da viga I

    return (
        <group position={position}>
            {/* Flange superior */}
            <mesh position={[0, beamHeight / 2, 0]}>
                <boxGeometry args={[flangeThick, flangeThick, width]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Alma (web) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[webThick, beamHeight, width]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Flange inferior */}
            <mesh position={[0, -beamHeight / 2, 0]}>
                <boxGeometry args={[flangeThick, flangeThick, width]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
};

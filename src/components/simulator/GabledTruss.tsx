import { useMemo } from "react";
import * as THREE from "three";

interface GabledTrussProps {
    span: number;
    riseHeight?: number;
    position: [number, number, number];
}

export const GabledTruss = ({ span, riseHeight = 2.5, position }: GabledTrussProps) => {
    const structureColor = "#8B1010";
    const barR = 0.07;
    const chordR = 0.09;

    const members = useMemo(() => {
        const list: any[] = [];
        const half = span / 2;

        const tube = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, r = barR, key = "") => {
            const start = new THREE.Vector3(ax, ay, az);
            const end = new THREE.Vector3(bx, by, bz);
            const dir = new THREE.Vector3().subVectors(end, start);
            const length = dir.length();
            if (length === 0) return null;
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            const up = new THREE.Vector3(0, 1, 0);
            const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
            return { mid, length, quat, r, key };
        };

        // Bottom chord
        list.push(tube(0, 0, -half, 0, 0, half, chordR, "chord"));

        // Top rafters (as duas águas)
        list.push(tube(0, 0, -half, 0, riseHeight, 0, chordR, "rafter-L"));
        list.push(tube(0, 0, half, 0, riseHeight, 0, chordR, "rafter-R"));

        const segments = Math.max(3, Math.floor(half / 1.5));
        
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const zLeft = -half * (1 - t);
            const yCurrent = riseHeight * t;
            
            const zRight = half * (1 - t);

            // Verticals
            list.push(tube(0, 0, zLeft, 0, yCurrent, zLeft, barR, `vL-${i}`));
            list.push(tube(0, 0, zRight, 0, yCurrent, zRight, barR, `vR-${i}`));

            // Diagonals
            if (i < segments) {
                const tNext = (i + 1) / segments;
                const zNextL = -half * (1 - tNext);
                const zNextR = half * (1 - tNext);
                const yNext = riseHeight * tNext;
                
                list.push(tube(0, 0, zNextL, 0, yCurrent, zLeft, barR * 0.8, `dL-${i}`));
                list.push(tube(0, 0, zNextR, 0, yCurrent, zRight, barR * 0.8, `dR-${i}`));
            }
        }
        
        // center post
        list.push(tube(0, 0, 0, 0, riseHeight, 0, barR, "center"));
        
        return list.filter(Boolean);
    }, [span, riseHeight]);

    return (
        <group position={position}>
            {members.map((m) => (
                <mesh key={m.key} position={[m.mid.x, m.mid.y, m.mid.z]} quaternion={m.quat}>
                    <cylinderGeometry args={[m.r, m.r, m.length, 6]} />
                    <meshStandardMaterial color={structureColor} roughness={0.4} metalness={0.7} />
                </mesh>
            ))}
        </group>
    );
};

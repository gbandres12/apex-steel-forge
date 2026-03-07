import { useMemo } from "react";
import * as THREE from "three";

interface ArchedTrussProps {
    /** Overall span (vão livre) in metres */
    span: number;
    /** Height of arch apex above the base chord, in metres */
    riseHeight?: number;
    /** Position of this truss in the scene */
    position: [number, number, number];
}

/**
 * A single arched / barrel-vault truss frame.
 * The arch runs along the Z axis (span direction).
 * The truss sits on top of the column caps and is
 * replicated every 6 m along the X axis by ShedVisualizer.
 */
export const ArchedTruss = ({ span, riseHeight = 2.5, position }: ArchedTrussProps) => {
    const structureColor = "#8B0000";
    const barR = 0.07; // tube radius for thin members
    const chordR = 0.09; // tube radius for main chord

    /** Build a tube mesh from pointA to pointB */
    const tube = (
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number,
        r = barR,
        key = ""
    ) => {
        const start = new THREE.Vector3(ax, ay, az);
        const end = new THREE.Vector3(bx, by, bz);
        const dir = new THREE.Vector3().subVectors(end, start);
        const length = dir.length();
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        // Quaternion to rotate cylinder (default along Y) to dir
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());

        return { mid, length, quat, r, key };
    };

    const members = useMemo(() => {
        const list: ReturnType<typeof tube>[] = [];

        const half = span / 2;
        // Arch radius from circle formula
        const R = (half * half + riseHeight * riseHeight) / (2 * riseHeight);
        // archCenterY: distance from chord (y=0) to circle center (below chord)
        const archCenterY = R - riseHeight;
        // halfAngle: angle from apex (π/2) to each edge
        const halfAngle = Math.asin(half / R);

        const SEG = 12; // arc segments

        // ── Bottom chord (straight) ─────────────────────────────────────────────
        list.push(tube(0, 0, -half, 0, 0, half, chordR, "chord"));

        // ── Top arch members ────────────────────────────────────────────────────
        for (let i = 0; i < SEG; i++) {
            const t0 = i / SEG;
            const t1 = (i + 1) / SEG;

            // Sweep through the TOP of the circle (π/2 = apex)
            // at t=0 → left edge, t=0.5 → apex, t=1 → right edge
            const ang0 = (Math.PI / 2 + halfAngle) + t0 * (-2 * halfAngle);
            const ang1 = (Math.PI / 2 + halfAngle) + t1 * (-2 * halfAngle);

            const z0 = R * Math.cos(ang0);
            const y0 = R * Math.sin(ang0) - archCenterY; // 0 at edges, riseHeight at apex
            const z1 = R * Math.cos(ang1);
            const y1 = R * Math.sin(ang1) - archCenterY;

            list.push(tube(0, y0, z0, 0, y1, z1, chordR, `arc-${i}`));

            // ── Verticals from chord to arch ──
            const zm = (z0 + z1) / 2;
            const ym = (y0 + y1) / 2;
            if (Math.abs(zm) < half * 0.92) {
                list.push(tube(0, 0, zm, 0, ym, zm, barR, `vert-${i}`));
            }

            // ── Diagonals for bracing ──
            if (i < SEG - 1) {
                const angD0 = (Math.PI / 2 + halfAngle) + ((i + 0.5) / SEG) * (-2 * halfAngle);
                const angD1 = (Math.PI / 2 + halfAngle) + ((i + 1.5) / SEG) * (-2 * halfAngle);
                const zd0 = R * Math.cos(angD0);
                const yd0 = R * Math.sin(angD0) - archCenterY;
                const zd1 = R * Math.cos(angD1);
                list.push(tube(0, yd0, zd0, 0, 0, zd1, barR * 0.8, `diag-${i}`));
            }
        }

        return list.map((m, idx) => ({ ...m, key: m.key || `m-${idx}` }));
    }, [span, riseHeight]);

    return (
        <group position={position}>
            {members.map((m) => (
                <mesh
                    key={m.key}
                    position={[m.mid.x, m.mid.y, m.mid.z]}
                    quaternion={m.quat}
                >
                    <cylinderGeometry args={[m.r, m.r, m.length, 6]} />
                    <meshStandardMaterial color={structureColor} roughness={0.5} metalness={0.6} />
                </mesh>
            ))}
        </group>
    );
};

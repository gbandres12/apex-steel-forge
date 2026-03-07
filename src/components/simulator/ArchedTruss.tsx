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
        // Arch radius — using circle formula: R = (half² + rise²) / (2 * rise)
        const R = (half * half + riseHeight * riseHeight) / (2 * riseHeight);
        const archCenterY = -R + riseHeight; // y-coord of circle center relative to chord base

        const SEG = 12; // arc segments

        // ── Bottom chord (straight) ─────────────────────────────────────────────
        list.push(tube(0, 0, -half, 0, 0, half, chordR, "chord"));

        // ── Top arch members ────────────────────────────────────────────────────
        for (let i = 0; i < SEG; i++) {
            const t0 = i / SEG;
            const t1 = (i + 1) / SEG;

            // angle mapped so that at t=0 → left end, t=0.5 → apex, t=1 → right end
            const ang0 = Math.PI + t0 * Math.PI; // π → 2π (bottom half of circle flipped upward)
            const ang1 = Math.PI + t1 * Math.PI;

            // Positions on the circle (centered at archCenterY on Y, zero on Z needs remapping)
            // We use ZY plane: Z = R*cos(ang), Y = R*sin(ang) + (R - riseHeight)
            const z0 = R * Math.cos(ang0);
            const y0 = R * Math.sin(ang0) + (R - riseHeight);
            const z1 = R * Math.cos(ang1);
            const y1 = R * Math.sin(ang1) + (R - riseHeight);

            list.push(tube(0, y0, z0, 0, y1, z1, chordR, `arc-${i}`));

            // ── Verticals from chord to arch ──
            const zm = (z0 + z1) / 2;
            const ym = (y0 + y1) / 2;
            // only draw if not near the ends (already have pillar there)
            if (Math.abs(zm) < half * 0.92) {
                list.push(tube(0, 0, zm, 0, ym, zm, barR, `vert-${i}`));
            }

            // ── Diagonals for bracing ──
            if (i < SEG - 1) {
                const ang2 = Math.PI + (i + 0.5) / SEG * Math.PI;
                const ang3 = Math.PI + (i + 1.5) / SEG * Math.PI;
                const zd0 = R * Math.cos(ang2);
                const yd0 = R * Math.sin(ang2) + (R - riseHeight);
                const zd1 = R * Math.cos(ang3);
                const yd1 = R * Math.sin(ang3) + (R - riseHeight);
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

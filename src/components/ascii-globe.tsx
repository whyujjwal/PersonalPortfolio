"use client";

import { useEffect, useRef } from "react";

const WIDTH = 60; // Output width
const HEIGHT = 30; // Output height
const K = 40; // Projection factor

// ASCII shading characters from dark to light
const SHADES = " .:-=+*#%@";

interface Point3D {
    x: number;
    y: number;
    z: number;
}

export function AsciiGlobe({ className = "" }: { className?: string }) {
    const preRef = useRef<HTMLPreElement>(null);
    const requestRef = useRef<number | null>(null);
    const inViewRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                inViewRef.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let A = 0; // Rotation angle

        // Pre-calculate sphere points
        const points: Point3D[] = [];
        const step = 0.15; // Density of points

        for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += step) {
            const r = Math.cos(lat);
            const y = Math.sin(lat);
            // More points at equator, fewer at poles
            const lonStep = step / (r + 0.05);
            for (let lon = 0; lon <= 2 * Math.PI; lon += lonStep) {
                points.push({
                    x: r * Math.cos(lon),
                    y: y,
                    z: r * Math.sin(lon)
                });
            }
        }

        const render = () => {
            if (!preRef.current || !inViewRef.current || document.hidden) {
                requestRef.current = requestAnimationFrame(render);
                return;
            }

            // Buffer for the frame
            const output = new Array(WIDTH * HEIGHT).fill(" ");
            const zBuffer = new Array(WIDTH * HEIGHT).fill(-Infinity);

            const cosA = Math.cos(A);
            const sinA = Math.sin(A);

            // Light vector (approximating from top-left)
            const lx = 0.5;
            const ly = -0.5;
            const lz = -1;
            const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);

            for (const p of points) {
                // Rotate around Y axis
                const x = p.x * cosA - p.z * sinA;
                const y = p.y;
                const z = p.x * sinA + p.z * cosA;

                // Project to 2D
                const ooz = 1 / (z + 2.5); // One over z (perspective)

                // x projection: center is WIDTH/2
                // We multiply by 1.8 for X to account for char aspect ratio (approx 0.55)
                const xp = Math.floor(WIDTH / 2 + K * ooz * x * 1.8);
                const yp = Math.floor(HEIGHT / 2 - K * ooz * y); // minus y because screen coords

                const idx = xp + yp * WIDTH;

                if (idx >= 0 && idx < WIDTH * HEIGHT) {
                    if (ooz > zBuffer[idx]) {
                        zBuffer[idx] = ooz;

                        // Calculate lighting
                        // Normal at surface point is just the point coordinates (unit sphere)
                        // Rotated normal:
                        const nx = x;
                        const ny = y;
                        const nz = z;

                        // Dot product with light
                        const L = (nx * lx + ny * ly + nz * lz) / lLen;

                        if (L > 0) {
                            const shadeIdx = Math.floor(L * (SHADES.length - 1));
                            output[idx] = SHADES[Math.max(0, shadeIdx)];
                        } else {
                            output[idx] = "."; // Dim ambient
                        }
                    }
                }
            }

            // Add "equator" ring or satellite for extra flair?
            // Let's keep it simple first: just the sphere.

            // Convert buffer to string
            let string = "";
            for (let j = 0; j < HEIGHT; j++) {
                for (let i = 0; i < WIDTH; i++) {
                    string += output[i + j * WIDTH];
                }
                string += "\n";
            }

            preRef.current.textContent = string;

            A += 0.015; // Spin speed
            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);

        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className={`ascii-globe ${className}`.trim()} data-reveal>
            <p className="ascii-globe-label">{"// global_systems"}</p>
            <pre ref={preRef} className="ascii-globe-pre" aria-hidden="true">
                Initializing...
            </pre>
            <p className="ascii-globe-note">projection: orthographic</p>
        </div>
    );
}

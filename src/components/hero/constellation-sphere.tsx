"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  IcosahedronGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Vector3,
  AdditiveBlending,
  Points,
  LineSegments,
} from "three";

const POINT_COUNT_DETAIL = 3;
const CONNECTION_OPACITY = 0.06;
const POINT_SIZE = 2.5;
const ROTATION_SPEED = 0.08;
const MOUSE_INFLUENCE = 0.4;

export function ConstellationSphere() {
  const pointsRef = useRef<Points>(null);
  const linesRef = useRef<LineSegments>(null);
  const mouse = useRef(new Vector2(0, 0));
  const { viewport } = useThree();

  const { positions, linePositions, originalPositions } = useMemo(() => {
    const ico = new IcosahedronGeometry(1.8, POINT_COUNT_DETAIL);
    const posArr = ico.attributes.position.array as Float32Array;
    const origPositions = new Float32Array(posArr);

    const indexArr = ico.index?.array;
    const linePos: number[] = [];

    if (indexArr) {
      const edgeSet = new Set<string>();
      for (let i = 0; i < indexArr.length; i += 3) {
        const edges = [
          [indexArr[i], indexArr[i + 1]],
          [indexArr[i + 1], indexArr[i + 2]],
          [indexArr[i + 2], indexArr[i]],
        ];
        for (const [a, b] of edges) {
          const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            linePos.push(
              posArr[a * 3], posArr[a * 3 + 1], posArr[a * 3 + 2],
              posArr[b * 3], posArr[b * 3 + 1], posArr[b * 3 + 2]
            );
          }
        }
      }
    }

    ico.dispose();

    return {
      positions: posArr,
      linePositions: new Float32Array(linePos),
      originalPositions: origPositions,
    };
  }, []);

  const pointsGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const linesGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  useFrame(({ pointer, clock }) => {
    mouse.current.lerp(pointer, 0.05);

    if (pointsRef.current && linesRef.current) {
      const t = clock.getElapsedTime() * ROTATION_SPEED;
      pointsRef.current.rotation.y = t;
      pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      linesRef.current.rotation.y = t;
      linesRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;

      const posAttr = pointsRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      const mouseVec = new Vector3(
        mouse.current.x * viewport.width * 0.5,
        mouse.current.y * viewport.height * 0.5,
        0
      );

      for (let i = 0; i < arr.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];

        const pointVec = new Vector3(ox, oy, oz);
        const dist = pointVec.distanceTo(mouseVec);
        const influence = Math.max(0, 1 - dist / 3) * MOUSE_INFLUENCE;

        const dir = pointVec.clone().normalize();
        arr[i] = ox + dir.x * influence;
        arr[i + 1] = oy + dir.y * influence;
        arr[i + 2] = oz + dir.z * influence;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          size={POINT_SIZE}
          color="#a8b4c8"
          transparent
          opacity={0.8}
          sizeAttenuation={false}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial
          color="#a8b4c8"
          transparent
          opacity={CONNECTION_OPACITY}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

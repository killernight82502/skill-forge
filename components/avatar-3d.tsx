'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  level: number;
  xp: number;
  selectedCosmetic: {
    color: string;
    borderColor: string;
    glowColor: string;
    frameStyle?: string;
  };
  maxXpForLevel: number;
}

// Character mesh component
function CharacterMesh({ level, selectedCosmetic }: Omit<Avatar3DProps, 'maxXpForLevel' | 'xp'>) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      if (hovered) {
        groupRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const tierScale = 0.5 + (Math.min(level, 7) / 7) * 0.8;
  const baseColor = new THREE.Color(selectedCosmetic.color);
  const glowColor = selectedCosmetic.color;

  return (
    <group ref={groupRef}>
      {/* Body - grows with level */}
      <mesh position={[0, 0, 0]} scale={tierScale}>
        <capsuleGeometry args={[0.4, 1.5, 4, 8]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={glowColor}
          emissiveIntensity={0.3 + level * 0.05}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.2 * tierScale, 0]} scale={tierScale}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={glowColor}
          emissiveIntensity={0.4 + level * 0.05}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Armor Plates - appear with progression */}
      {level >= 2 && (
        <mesh position={[0, 0.3 * tierScale, 0.6 * tierScale]} scale={tierScale * 1.1}>
          <boxGeometry args={[0.8, 0.6, 0.2]} />
          <meshStandardMaterial
            color={selectedCosmetic.borderColor}
            emissive={selectedCosmetic.borderColor}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      )}

      {/* Weapon - appears at level 4 */}
      {level >= 4 && (
        <group position={[0.8 * tierScale, 0.2 * tierScale, 0]}>
          <mesh scale={tierScale}>
            <boxGeometry args={[0.3, 1.2, 0.1]} />
            <meshStandardMaterial
              color="#ff6b35"
              emissive="#ff6b35"
              emissiveIntensity={0.6 + level * 0.05}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}

      {/* Energy Aura - increases with level */}
      {level >= 3 && (
        <mesh position={[0, 0, 0]} scale={1.5 + level * 0.15}>
          <torusGeometry args={[1, 0.1, 16, 100]} />
          <meshStandardMaterial
            color={selectedCosmetic.color}
            emissive={selectedCosmetic.color}
            emissiveIntensity={0.7 + level * 0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Crown - appears at level 6 */}
      {level >= 6 && (
        <group position={[0, 1.5 * tierScale, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[Math.cos((i / 3) * Math.PI * 2) * 0.4, 0.3, Math.sin((i / 3) * Math.PI * 2) * 0.4]}
              scale={tierScale}
            >
              <coneGeometry args={[0.15, 0.6, 8]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Level-based glow intensity */}
      <pointLight color={glowColor} intensity={1 + level * 0.2} distance={5} decay={2} />
    </group>
  );
}

export function Avatar3D({ level, xp, selectedCosmetic, maxXpForLevel }: Avatar3DProps) {
  const xpPercentage = maxXpForLevel > 0 ? (xp % maxXpForLevel) / maxXpForLevel : 0;

  return (
    <div className="w-full h-96 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-gray-800">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />

        {/* Character */}
        <CharacterMesh level={level} selectedCosmetic={selectedCosmetic} />

        {/* Environment */}
        <Environment preset="night" background={false} />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={2}
          maxDistance={8}
          minDistance={2}
        />
      </Canvas>

      {/* XP Progress Bar Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-orange-400">Level {level}</span>
          <span className="text-xs text-gray-400">
            {Math.floor(xpPercentage * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-900 rounded-full border border-gray-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-500"
            style={{ width: `${xpPercentage * 100}%` }}
          />
        </div>
      </div>

      {/* Level Info */}
      <div className="absolute top-4 left-4 right-4 text-center">
        <p className="text-sm font-bold text-gray-300">
          {level < 7 ? `Level ${level} - ${7 - level} levels to max` : 'Max Level Reached!'}
        </p>
      </div>
    </div>
  );
}

"use client";
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders
import vertexShader from '../lib/shaders/background.vert';
import fontFragmentShader from '../lib/shaders/font-renderer.frag';

const ShaderText = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const uniforms = useMemo(
        () => ({
            time: { value: Math.random() * 10.0 }, // Random start time
            u_resolutions: { value: new THREE.Vector2(400, 40) }, // Canvas dimensions
        }),
        []
    );

    useFrame((state, delta) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value += delta * 0.8;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[400, 40]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fontFragmentShader}
                transparent={true}
            />
        </mesh>
    );
};

const Header = () => {
  return (
    <header className="main-header flex flex-wrap justify-between items-center px-8 py-4 bg-black/80 backdrop-blur border-b border-gray-800 sticky top-0 z-50">
      <div className="flex items-center gap-6 text-sm font-mono text-gray-300">
        <a href="#cv" className="hover:text-green-400 transition-colors">/cv</a>
        <a href="#opensource" className="hover:text-green-400 transition-colors">/opensource</a>
        <a href="#projects" className="hover:text-green-400 transition-colors">/projects</a>
        <a href="#articles" className="hover:text-green-400 transition-colors">/articles</a>
      </div>

      <div className="flex items-center gap-6">
        <div className="contact-info text-xs font-mono text-gray-400">
          <a href="https://github.com/ji-podhead" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">GitHub</a> |
          <a href="https://linkedin.com/in/leonardo-j-09b358275" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">LinkedIn</a>
        </div>
        <div style={{ width: '200px', height: '30px' }}>
          <Canvas>
            <ShaderText />
          </Canvas>
        </div>
      </div>
    </header>
  );
};

export default Header;

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
    <header className="main-header">
      <div className="contact-info">
        <a href="https://github.com/ji-podhead" target="_blank" rel="noopener noreferrer">GitHub</a> |
        <a href="https://linkedin.com/in/leonardo-j-09b358275" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
       <div style={{ width: '400px', height: '40px' }}>
            <Canvas>
                <ShaderText />
            </Canvas>
        </div>
    </header>
  );
};

export default Header;

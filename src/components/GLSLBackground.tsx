"use client";
import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import vertexShader from '@/lib/shaders/background.vert';
import fragmentShader from '@/lib/shaders/background.frag';

const GLSLBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const uniforms = useMemo(
        () => ({
            time: { value: 0.0 },
            u_resolutions: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }),
        []
    );

    useFrame((state, delta) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value += delta;
        }
    });

    const handleResize = () => {
        if (uniforms.u_resolutions) {
            uniforms.u_resolutions.value.x = window.innerWidth;
            uniforms.u_resolutions.value.y = window.innerHeight;
        }
    };

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[window.innerWidth, window.innerHeight]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const FullscreenCanvas = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
            <Canvas>
                <GLSLBackground />
            </Canvas>
        </div>
    );
};

export default FullscreenCanvas;
"use client";
import * as THREE from 'three';
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Statically import all available shaders
import vertexShader from '@/lib/shaders/background.vert';
import backgroundFragmentShader from '@/lib/shaders/background.frag';
import ribbonFragmentShader from '@/lib/shaders/ribbon.frag';
import metaballFragmentShader from '@/lib/shaders/metaball.frag';
import ditherFragmentShader from '@/lib/shaders/dither-effect.frag';

const shaders = {
    background: backgroundFragmentShader,
    ribbon: ribbonFragmentShader,
    metaball: metaballFragmentShader,
    dither: ditherFragmentShader,
};

type ShaderName = keyof typeof shaders;

const GLSLBackground = ({ shaderName }: { shaderName: ShaderName }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const fragmentShader = useMemo(() => shaders[shaderName] || shaders.background, [shaderName]);

    const uniforms = useMemo(
        () => ({
            time: { value: 0.0 },
            mouse: { value: new THREE.Vector2() },
            u_resolutions: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }),
        []
    );

    useFrame((state, delta) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value += delta;
        }
        uniforms.mouse.value.x = state.mouse.x;
        uniforms.mouse.value.y = state.mouse.y;
    });

    useEffect(() => {
        const handleResize = () => {
            uniforms.u_resolutions.value.x = window.innerWidth;
            uniforms.u_resolutions.value.y = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [uniforms.u_resolutions]);

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[window.innerWidth, window.innerHeight]} />
            <shaderMaterial
                key={fragmentShader} // Add key to force re-creation on shader change
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const FullscreenCanvas = () => {
    // We can easily change the default shader here in the future
    const [currentShader] = useState<ShaderName>('background');

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
            <Canvas>
                <GLSLBackground shaderName={currentShader} />
            </Canvas>
        </div>
    );
};

export default FullscreenCanvas;
"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Animator } from '@/lib/kooljs/animator';
import { Particles } from '@/lib/particles/engine';
import * as THREE from 'three';

// A component to render the animated 3D text
const AnimatedText = ({ content, position, size, delay = 0, onReady, visible }: { content: string, position: [number, number, number], size: number, delay?: number, onReady?: (ref: any) => void, visible: boolean }) => {
    const [displayText, setDisplayText] = useState('');
    const animatorRef = useRef<Animator | null>(null);
    const textRef = useRef<any>();

    useEffect(() => {
        const animator = new Animator(60);
        animatorRef.current = animator;

        const textAnimation = animator.Timeline({
            duration: content.length * 8,
            delay: delay,
            render_callback: (val: number) => {
                const roundedIndex = Math.round(val);
                setDisplayText(content.substring(0, roundedIndex));
            },
            steps: Array.from({ length: content.length + 1 }, (_, i) => i),
        });

        animator.init();
        animator.start_animations([textAnimation.id]);

        return () => {
            animator.kill();
        };
    }, [content, delay]);

    useEffect(() => {
        if(textRef.current && displayText.length === content.length) {
            if (onReady) {
                onReady(textRef.current);
            }
        }
    }, [displayText, content, onReady]);

    return (
        <Text
            ref={textRef}
            position={position}
            fontSize={size}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/font.woff"
            visible={visible}
        >
            {`${displayText}${displayText.length < content.length ? '_' : ''}`}
        </Text>
    );
};


const HeroContent = () => {
    const [textVisible, setTextVisible] = useState(true);
    const [particleMesh, setParticleMesh] = useState<THREE.Mesh | null>(null);
    const nameRef = useRef<THREE.Mesh | null>(null);
    const titleRef = useRef<THREE.Mesh | null>(null);

    const particleSystem = useMemo(() => new Particles(), []);

    useEffect(() => {
        const geometry = new THREE.SphereGeometry(0.02, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 'white', emissive: '#00ff41', emissiveIntensity: 1 });
        const mesh = new THREE.Mesh(geometry, material);
        const pMesh = particleSystem.InitializeParticles(new THREE.Scene(), mesh, 5000);
        setParticleMesh(pMesh);
    }, [particleSystem]);

    const textReady = useRef({ name: false, title: false });

    const handleInteraction = useCallback(() => {
        if (!textVisible || !particleSystem) return;

        const textGeometries: THREE.BufferGeometry[] = [];
        if (nameRef.current) textGeometries.push(nameRef.current.geometry.clone().applyMatrix4(nameRef.current.matrixWorld));
        if (titleRef.current) textGeometries.push(titleRef.current.geometry.clone().applyMatrix4(titleRef.current.matrixWorld));

        const allVertices = new Float32Array(
            textGeometries.reduce((acc, geom) => acc + geom.attributes.position.array.length, 0)
        );

        let offset = 0;
        textGeometries.forEach(geom => {
            allVertices.set(geom.attributes.position.array, offset);
            offset += geom.attributes.position.array.length;
        });

        if (allVertices.length > 0) {
            particleSystem.setStartPositionFromArray(false, allVertices);
            particleSystem.setForce([0, 0.0005, 0]);
            particleSystem.setAttributeOverLifeTime("opacity", [1], [0]);
            particleSystem.setSourceAttributes("rotation", [0,0,0], true, -Math.PI, Math.PI);
            particleSystem.setAttributeOverLifeTime("rotation", [0,0,0], [1,1,1]);
            particleSystem.setMaxLifeTime(3, true, 2, 4);
            particleSystem.setBurstCount(allVertices.length / 3);
            particleSystem.startPS();
        }

        setTextVisible(false);

        setTimeout(() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }, 1000);
    }, [particleSystem, textVisible]);

    const onTextReady = useCallback((type: 'name' | 'title', ref: THREE.Mesh) => {
        if (type === 'name') nameRef.current = ref;
        else titleRef.current = ref;

        textReady.current[type] = true;

        if (textReady.current.name && textReady.current.title) {
            window.addEventListener('scroll', handleInteraction, { once: true });
            window.addEventListener('click', handleInteraction, { once: true });
        }
    }, [handleInteraction]);

    useEffect(() => {
        return () => {
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        };
    }, [handleInteraction]);

    useFrame((state, delta) => {
        if (particleSystem && particleMesh) {
            particleSystem.updateSimulation(delta, false, true, true, false);
        }
    });

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    {particleMesh && <primitive object={particleMesh} />}

                    <AnimatedText content="ji-podhead" position={[0, 0.7, 0]} size={1} onReady={(ref) => onTextReady('name', ref)} visible={textVisible} />
                    <AnimatedText content="Head of MLOps" position={[0, -0.2, 0]} size={0.4} delay={120} onReady={(ref) => onTextReady('title', ref)} visible={textVisible}/>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroContent;
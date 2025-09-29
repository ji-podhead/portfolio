"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Animator } from '../lib/kooljs/animator';
import { Particles } from '../lib/particles/workerParticles';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'; // Import FontLoader directly
import ParticlesMain from '@/lib/particles/particles';

const words = ["devops", "mlops", "ml", "robotics", "fullstack"];
const PARTICLE_COUNT = 4000;

// Helper to get points from text geometry
const getTextPoints = (text: string, font: any, size: number, onReady: (points: Float32Array) => void) => {
    const loader = new FontLoader(); // Use the imported FontLoader
    loader.load(font, (loadedFont) => {
        const geometry = new THREE.ShapeGeometry(loadedFont.generateShapes(text, size));
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox?.getCenter(center);
        geometry.center();

        const points = new Float32Array(PARTICLE_COUNT * 3);
        const triangle = new THREE.Triangle();
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const randomIndex = Math.floor(Math.random() * (positions.length / 9)) * 9;
            const vA = new THREE.Vector3().fromArray(positions, randomIndex);
            const vB = new THREE.Vector3().fromArray(positions, randomIndex + 3);
            const vC = new THREE.Vector3().fromArray(positions, randomIndex + 6);
            triangle.set(vA, vB, vC);

            const point = new THREE.Vector3();
            // Generate random barycentric coordinates to get a point on the triangle
            let u = Math.random();
            let v = Math.random();
            if (u + v > 1) {
                u = 1 - u;
                v = 1 - v;
            }
            const w = 1 - u - v;
            point.x = u * vA.x + v * vB.x + w * vC.x;
            point.y = u * vA.y + v * vB.y + w * vC.y;
            point.z = u * vA.z + v * vB.z + w * vC.z;

            point.toArray(points, i * 3);
        }
        onReady(points);
    });
};


const ParticleTextSystem = ({ onExplode }: { onExplode: (system: Particles) => void }) => {
    const particleSystem = useMemo(() => new Particles(), []);
    const [particleMesh, setParticleMesh] = useState<THREE.Mesh | null>(null);
    const [targets, setTargets] = useState<Float32Array[]>([]);
    const animatorRef = useRef<Animator | null>(null);
    const currentTargetIndex = useRef(0);

    useEffect(() => {
        let loadedCount = 0;
        const geomArray: Float32Array[] = new Array(words.length);
        words.forEach((word, index) => {
            getTextPoints(word, '/fonts/font.json', 1.2, (points) => {
                geomArray[index] = points;
                loadedCount++;
                if (loadedCount === words.length) {
                    setTargets(geomArray);
                }
            });
        });
    }, []);

    useEffect(() => {
        if (targets.length === 0) return;

        const geometry = new THREE.SphereGeometry(0.02, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: '#00ff41', emissive: '#00ff41', emissiveIntensity: 2 });
        const mesh = new THREE.Mesh(geometry, material);
        const pMesh = particleSystem.InitializeParticles(mesh, PARTICLE_COUNT);

        particleSystem.setStartPositionFromArray(false, targets[0]);
        particleSystem.startPS();
        // If InitializeParticles returns void, pMesh will be undefined.
        // Set particleMesh to null in that case, as it expects Mesh | null.
        setParticleMesh(pMesh === undefined ? null : pMesh);

        const animator = new Animator(60);
        animatorRef.current = animator;

        const timeline = animator.Timeline({
            steps: Array(words.length).fill(0), // Provide steps based on the number of words
            duration: 3 * 60, // 3 seconds per word
            loop: true,
            callback: { // Use the callback parameter for custom logic
                callback: () => {
                    currentTargetIndex.current = (currentTargetIndex.current + 1) % words.length;
                },
                key: 'updateTargetIndex' // A key for the callback
            }
        });

        animator.init();
        animator.start();

        const handleExplode = () => onExplode(particleSystem);
        window.addEventListener('explode', handleExplode as EventListener);

        return () => {
            animator.kill();
            window.removeEventListener('explode', handleExplode as EventListener);
        }

    }, [particleSystem, targets, onExplode]);

    useFrame((state, delta) => {
        if (particleSystem && targets.length > 0) {
            const currentTargets = targets[currentTargetIndex.current];
            const positions = particleSystem.properties.get('transform').array;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                if(currentTargets[i3] !== undefined) {
                    positions[i3] += (currentTargets[i3] - positions[i3]) * 0.04;
                    positions[i3+1] += (currentTargets[i3+1] - positions[i3+1]) * 0.04;
                    positions[i3+2] += (currentTargets[i3+2] - positions[i3+2]) * 0.04;
                }
            }
            particleSystem.updateValues(['transform']);
        }
    });

    return particleMesh ? <primitive object={particleMesh} /> : null;
};


const HeroContent = () => {
    const handleInteraction = useCallback(() => {
        // Create and dispatch a custom event to trigger the explosion
        const event = new CustomEvent('explode');
        window.dispatchEvent(event);

        // Scroll down after a delay
        setTimeout(() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }, 200);

        // Remove listeners to prevent re-triggering
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('click', handleInteraction);
    }, []);

    const onExplode = (system: Particles) => {
        console.log("Triggering particle explosion...");
        system.setForce([0,0,0]); // Reset any existing force
        system.setAttributeOverLifeTime("force", [0,0,0], [0,0,0], true, [-0.1, 0.1], [0.1, 0.1]); // Random outward force
        system.setMaxLifeTime(2, true, 1, 2);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleInteraction, { once: true });
        window.addEventListener('click', handleInteraction, { once: true });
        return () => {
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        };
    }, [handleInteraction]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', zIndex: 1 }}>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center text-white z-10">
                 <h1 className="text-5xl md:text-7xl font-bold mb-4 font-mono" style={{ textShadow: '2px 2px 8px rgba(0,255,65,0.7)' }}>
                    ji-podhead
                </h1>
                <p className="text-xl md:text-2xl font-mono" style={{ textShadow: '1px 1px 4px rgba(0,255,65,0.5)' }}>
                    Head of MLOps
                </p>
            </div>
            <Canvas camera={{ position: [0, 0, 10] }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} color="#00ff41" intensity={2}/>
                    <ParticleTextSystem onExplode={onExplode} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroContent;

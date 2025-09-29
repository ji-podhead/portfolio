"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Animator } from '@/lib/kooljs/animator';
import { Particles } from '@/lib/particles/workerParticles.js';
import * as THREE from 'three';

const words = ["devops", "mlops", "ml", "robotics", "fullstack"];
const PARTICLE_COUNT = 5000;

// Helper function to sample points from a geometry's surface
function sampleFromGeometry(geometry: THREE.BufferGeometry, count: number) {
    const positions = geometry.attributes.position.array;
    const points = new Float32Array(count * 3);
    const triangle = new THREE.Triangle();
    const totalTriangles = positions.length / 9;

    if (totalTriangles === 0) {
        // Fallback for geometries with no faces
        return points;
    }

    for (let i = 0; i < count; i++) {
        const triIndex = Math.floor(Math.random() * totalTriangles);
        const vA = new THREE.Vector3().fromArray(positions, triIndex * 9);
        const vB = new THREE.Vector3().fromArray(positions, triIndex * 9 + 3);
        const vC = new THREE.Vector3().fromArray(positions, triIndex * 9 + 6);
        triangle.set(vA, vB, vC);

        const point = new THREE.Vector3();
        triangle.getPoint(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), point);
        point.toArray(points, i * 3);
    }
    return points;
}


// This component creates the invisible text geometries to be used as targets
const TextTargets = ({ onGeometriesReady }: { onGeometriesReady: (geoms: Float32Array[]) => void }) => {
    const refs = useRef<(THREE.Mesh | null)[]>([]);
    const [geometriesReady, setGeometriesReady] = useState(false);

    useEffect(() => {
        if (geometriesReady) return;

        const checkGeometries = () => {
            const allReady = refs.current.length === words.length && refs.current.every(ref => ref?.geometry?.attributes.position);
            if (allReady) {
                const geometries = refs.current.map(ref => {
                    if (ref) {
                        ref.updateMatrixWorld();
                        const worldGeometry = ref.geometry.clone().applyMatrix4(ref.matrixWorld);
                        return sampleFromGeometry(worldGeometry, PARTICLE_COUNT);
                    }
                    return new Float32Array();
                });
                onGeometriesReady(geometries);
                setGeometriesReady(true);
            } else {
                setTimeout(checkGeometries, 100);
            }
        };
        checkGeometries();
    }, [geometriesReady, onGeometriesReady]);

    return (
        <group visible={false}>
            {words.map((word, i) => (
                <Text
                    key={word}
                    ref={el => refs.current[i] = el}
                    fontSize={1.2}
                    font="/fonts/font.woff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {word}
                </Text>
            ))}
        </group>
    );
};


const ParticleTextSystem = ({ textGeometries }: { textGeometries: Float32Array[] }) => {
    const particleSystem = useMemo(() => new Particles(), []);
    const particleMeshRef = useRef<THREE.Mesh | null>(null);
    const animatorRef = useRef<Animator | null>(null);
    const currentTargetIndex = useRef(0);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        const geometry = new THREE.SphereGeometry(0.03, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: '#00ff41', emissive: '#00ff41', emissiveIntensity: 2 });
        const mesh = new THREE.Mesh(geometry, material);

        const pMesh = particleSystem.InitializeParticles(mesh, PARTICLE_COUNT, 10, PARTICLE_COUNT, false);

        if (pMesh) {
            particleSystem.setStartPositionFromArray(false, textGeometries[0]);
            particleSystem.startPS();
            particleMeshRef.current = pMesh;
            initialized.current = true;
        }

        const animator = new Animator(60);
        animatorRef.current = animator;
        animator.Timeline({
            duration: 4 * 60,
            loop: true,
            render_callback: () => {
                currentTargetIndex.current = (currentTargetIndex.current + 1) % words.length;
            }
        });
        animator.init();
        animator.start();

        return () => {
            animator.kill();
        }
    }, [particleSystem, textGeometries]);

    useFrame((state, delta) => {
        if (particleSystem && initialized.current) {
            // Run your original simulation logic
            particleSystem.updateSimulation(delta, false, false, false);

            // Apply steering force for morphing
            const targets = textGeometries[currentTargetIndex.current];
            const positions = particleSystem.properties.get('transform').array;
            if (!positions || !targets) return;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                if (targets[i3] === undefined) continue;

                const steerStrength = 0.05;
                positions[i3] += (targets[i3] - positions[i3]) * steerStrength;
                positions[i3 + 1] += (targets[i3 + 1] - positions[i3 + 1]) * steerStrength;
                positions[i3 + 2] += (targets[i3 + 2] - positions[i3 + 2]) * steerStrength;
            }

            // Update the necessary attributes
            particleSystem.updateValues(['transform']);
        }
    });

    return particleMeshRef.current ? <primitive object={particleMeshRef.current} /> : null;
};


export const ParticleText = () => {
    const [geometries, setGeometries] = useState<Float32Array[] | null>(null);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 15] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} color="#00ff41" />
                <Suspense fallback={null}>
                    <TextTargets onGeometriesReady={setGeometries} />
                    {geometries && <ParticleTextSystem textGeometries={geometries} />}
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ParticleText;
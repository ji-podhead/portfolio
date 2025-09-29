"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Animator } from '../lib/kooljs/animator';
import { Particles } from '../lib/particles/workerParticles';
import * as THREE from 'three';

const words = ["devops", "mlops", "ml", "robotics", "fullstack"];
const PARTICLE_COUNT = 5000;

// Helper function to sample points from a geometry's surface
function sampleFromGeometry(geometry: THREE.BufferGeometry, count: number) {
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal?.array;
    const points = new Float32Array(count * 3);
    const triangle = new THREE.Triangle();

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * (positions.length / 9)) * 9;
        const vA = new THREE.Vector3().fromArray(positions, randomIndex);
        const vB = new THREE.Vector3().fromArray(positions, randomIndex + 3);
        const vC = new THREE.Vector3().fromArray(positions, randomIndex + 6);
        triangle.set(vA, vB, vC);

        const point = new THREE.Vector3();
        point.toArray(points, i * 3);
    }
    return points;
}


// This component creates the invisible text geometries to be used as targets
const TextTargets = ({ onGeometriesReady }: { onGeometriesReady: (geoms: Float32Array[]) => void }) => {
    const refs = useRef<(THREE.Mesh | null)[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ready) return;
        const allReady = refs.current.every(ref => ref && ref.geometry);
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
            setReady(true);
        }
    }, [ready, onGeometriesReady]);

    return (
        <group visible={false}>
            {words.map((word, i) => (
                <Text
                    key={word}
                    ref={el => refs.current[i] = el}
                    fontSize={1.2}
                    font="/fonts/font.woff"
                >
                    {word}
                </Text>
            ))}
        </group>
    );
};


const ParticleTextSystem = ({ textGeometries }: { textGeometries: Float32Array[] }) => {
    const particleSystem = useMemo(() => new Particles(), []);
    const [particleMesh, setParticleMesh] = useState<THREE.Mesh | null>(null);
    const animatorRef = useRef<Animator | null>(null);
    const currentTargetIndex = useRef(0);

    useEffect(() => {
        const geometry = new THREE.SphereGeometry(0.03, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: '#00ff41', emissive: '#00ff41', emissiveIntensity: 2 });
        const mesh = new THREE.Mesh(geometry, material);
        const pMesh = particleSystem.InitializeParticles(mesh, PARTICLE_COUNT);

        // Start particles from the first word's geometry
        particleSystem.setStartPositionFromArray(false, textGeometries[0]);
        particleSystem.startPS();
        // If InitializeParticles returns void, pMesh will be undefined.
        // Set particleMesh to null in that case, as it expects Mesh | null.
        setParticleMesh(pMesh === undefined ? null : pMesh);

        // Setup kooljs animator to cycle through targets
        const animator = new Animator(60);
        animatorRef.current = animator;

        animator.Timeline({
            duration: 4 * 60, // 4 seconds per word
            loop: true,
            render_callback: () => {
                currentTargetIndex.current = (currentTargetIndex.current + 1) % words.length;
                const newTargets = textGeometries[currentTargetIndex.current];
                // This is a simplified "morph". We tell the particles their new home.
                particleSystem.setStartPositionFromArray(false, newTargets);
                // Reset particles to start moving towards new targets
                for(let i = 0; i < PARTICLE_COUNT; i++) {
                    particleSystem.resetParticle(i);
                }
            }
        });
        animator.init();
        animator.start();

        return () => {
            animator.kill();
        }

    }, [particleSystem, textGeometries]);

    useFrame((state, delta) => {
        if (particleSystem) {
             // For morphing, we need a force pulling particles to their targets
            const targets = textGeometries[currentTargetIndex.current];
            const positions = particleSystem.properties.get('transform').array;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                const tx = targets[i3];
                const ty = targets[i3 + 1];
                const tz = targets[i3 + 2];

                positions[i3] += (tx - positions[i3]) * 0.05; // Steering force
                positions[i3+1] += (ty - positions[i3+1]) * 0.05;
                positions[i3+2] += (tz - positions[i3+2]) * 0.05;
            }
            particleSystem.updateValues(['transform']);
        }
    });

    return particleMesh ? <primitive object={particleMesh} /> : null;
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

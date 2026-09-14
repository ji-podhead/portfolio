"use client";
import React, { useState, Suspense } from 'react';
import GLSLBackground from "../components/GLSLBackground";

const shaderNames = ['ribbon', 'metaball', 'dither', 'background'] as const;
type ShaderName = typeof shaderNames[number];

const ShaderShowcase = () => {
    const [activeShader, setActiveShader] = useState<ShaderName>('ribbon');

    const triggerExplosion = () => {
        const event = new CustomEvent('explode');
        window.dispatchEvent(event);
    };

    return (
        <section id="shader-showcase" className="py-12 px-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-green-400 mb-2">Interactive Shader & Particle Playground</h2>
                    <p className="text-gray-400 text-sm">
                        Real-time GLSL fragment shaders combined with multithreaded kooljs particle physics.
                    </p>
                </div>
                <button
                    onClick={triggerExplosion}
                    className="mt-4 md:mt-0 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold font-mono text-sm rounded-lg transition-all shadow-lg shadow-green-500/20"
                >
                    💥 Trigger Particle Explosion
                </button>
            </div>

            <div className="relative w-full h-[70vh] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl bg-black">
                <Suspense fallback={<div className="flex items-center justify-center h-full text-green-400 font-mono">Loading Shaders...</div>}>
                    <GLSLBackground shaderName={activeShader} />
                </Suspense>

                {/* Controls Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-gray-800 flex flex-wrap gap-2 z-20">
                    {shaderNames.map(name => (
                        <button
                            key={name}
                            onClick={() => setActiveShader(name)}
                            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                                activeShader === name
                                    ? 'bg-green-500 text-black font-bold shadow-md shadow-green-500/30'
                                    : 'bg-gray-900 text-gray-300 border border-gray-800 hover:border-green-500/50'
                            }`}
                        >
                            {name} Shader
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShaderShowcase;

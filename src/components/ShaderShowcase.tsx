"use client";
import React, { useState, Suspense } from 'react';
import GLSLBackground from "../components/GLSLBackground";

const shaderNames = ['ribbon', 'metaball', 'dither', 'background'] as const;
type ShaderName = typeof shaderNames[number];

const ShaderShowcase = () => {
    const [activeShader, setActiveShader] = useState<ShaderName>('ribbon');

    return (
        <section id="shader-showcase">
            <h2>Shader Showcase</h2>
            <div className="project-card" style={{ height: '70vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                    <Suspense fallback={<p>Loading...</p>}>
                       <GLSLBackground shaderName={activeShader} />
                    </Suspense>
                </div>
                <div className="project-controls p-4">
                    {shaderNames.map(name => (
                        <button
                            key={name}
                            onClick={() => setActiveShader(name)}
                            className={`control-btn ${activeShader === name ? 'bg-white text-black' : ''}`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShaderShowcase;
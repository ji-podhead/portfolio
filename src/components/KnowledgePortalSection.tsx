"use client";
import React from 'react';

const KnowledgePortalSection = () => {
  return (
    <section id="knowledge" className="py-12 px-6 max-w-6xl mx-auto border-b border-gray-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-green-400 mb-2">Agentic Knowledge — GraphRAG Portal</h2>
        <p className="text-gray-400">
          58 OKF documents turned into an interactive entity graph: multi-hop drill-down, chunk explorer,
          and a retrieval assistant. Research made machine-readable for agents.
        </p>
      </div>

      <a
        href="https://ji-podhead.github.io/agentic-knowledge/"
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all bg-gray-900/60"
      >
        {/* GraphRAG Preview (statisches SVG-Hero im Green-on-Black-Stil der Seite) */}
        <svg viewBox="0 0 800 320" className="w-full h-auto" role="img" aria-label="GraphRAG knowledge graph preview">
          <rect width="800" height="320" fill="#000" />
          {[[120,90],[210,60],[300,140],[170,200],[90,240],[420,80],[520,160],[640,100],[700,220],[560,250],[380,270],[460,40]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={i%3===0?7:4} fill={i%3===0?'#34d399':i%3===1?'#38bdf8':'#818cf8'} opacity="0.9" />
          ))}
          {[[120,90,210,60],[210,60,300,140],[300,140,170,200],[170,200,90,240],[120,90,170,200],[300,140,420,80],[420,80,520,160],[520,160,640,100],[640,100,700,220],[520,160,560,250],[300,140,380,270],[380,270,560,250],[420,80,460,40]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#14532d" strokeWidth="1.5" />
          ))}
          <text x="400" y="35" textAnchor="middle" fill="#4ade80" fontFamily="monospace" fontSize="14" opacity="0.9">
            115 nodes · 137 links · multi-hop
          </text>
          <text x="400" y="305" textAnchor="middle" fill="#64748b" fontFamily="monospace" fontSize="11">
            click to open the live explorer →
          </text>
        </svg>

        <div className="p-6 border-t border-gray-800 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['OKF v1.0', 'D3 Force Graph', 'Chunk Explorer', 'Multi-Hop', 'AI Retrieval', 'Free Models'].map(t => (
              <span key={t} className="text-xs font-mono px-2.5 py-1 rounded border border-gray-700 text-gray-300 group-hover:border-green-800 group-hover:text-green-300 transition-colors">
                {t}
              </span>
            ))}
          </div>
          <span className="text-green-400 font-mono text-sm font-bold group-hover:translate-x-1 transition-transform">
            Open Portal ↗
          </span>
        </div>
      </a>
    </section>
  );
};

export default KnowledgePortalSection;

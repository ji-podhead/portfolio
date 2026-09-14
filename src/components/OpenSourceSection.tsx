"use client";
import React from 'react';
import { openSourceData } from '@/data/portfolioData';

const OpenSourceSection = () => {
  return (
    <section id="opensource" className="py-12 px-6 max-w-6xl mx-auto border-b border-gray-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-green-400 mb-2">Open Source Contributions</h2>
        <p className="text-gray-400">
          Core open-source packages, agentic protocols, MCP servers, and infrastructure frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openSourceData.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-900/80 border border-gray-800 hover:border-green-500/50 transition-all rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white hover:text-green-400 transition-colors">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </h3>
                {item.tier && (
                  <span className="text-xs bg-green-950 text-green-400 px-2 py-0.5 rounded border border-green-800 font-mono">
                    Tier {item.tier}
                  </span>
                )}
              </div>

              <div className="flex gap-3 text-xs text-gray-400 mb-3 font-mono">
                {item.codeScore && <span>Code: <strong className="text-green-300">{item.codeScore}</strong></span>}
                {item.docsScore && <span>Docs: <strong className="text-green-300">{item.docsScore}</strong></span>}
                {item.volume && <span>Vol: <strong className="text-gray-300">{item.volume}</strong></span>}
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {item.highlight}
              </p>
            </div>

            <div>
              <div className="text-xs text-gray-500 font-mono bg-black/40 p-2 rounded border border-gray-800/50 mb-3 truncate">
                Tech: {item.tech}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-green-400 hover:underline font-semibold"
                >
                  View Repository →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OpenSourceSection;

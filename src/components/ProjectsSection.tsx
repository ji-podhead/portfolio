"use client";
import React, { useState } from 'react';
import { projectsData } from '../data/portfolioData';

const ProjectsSection = () => {
  const [selectedTier, setSelectedTier] = useState<number | 'ALL'>('ALL');

  const filteredProjects = selectedTier === 'ALL'
    ? projectsData
    : projectsData.filter(p => p.tier === selectedTier);

  return (
    <section id="projects" className="py-12 px-6 max-w-6xl mx-auto border-b border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-400 mb-2">Projects Portfolio</h2>
          <p className="text-gray-400">
            Ranked and evaluated across 89 public repositories into 4 central tiers.
          </p>
        </div>

        {/* Tier Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 1, 2, 3, 4] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 text-xs rounded-md font-mono transition-colors ${
                selectedTier === tier
                  ? 'bg-green-500 text-black font-bold'
                  : 'bg-gray-900 text-gray-300 border border-gray-800 hover:border-green-500'
              }`}
            >
              {tier === 'ALL' ? 'All Tiers' : `Tier ${tier}`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-900/60 border border-gray-800 hover:border-green-500/40 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-white">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </h3>
                {item.tier && (
                  <span className={`text-xs px-2 py-0.5 rounded border font-mono ${
                    item.tier === 1 ? 'bg-green-950 text-green-400 border-green-800' :
                    item.tier === 2 ? 'bg-blue-950 text-blue-400 border-blue-800' :
                    item.tier === 3 ? 'bg-purple-950 text-purple-400 border-purple-800' :
                    'bg-gray-900 text-gray-400 border-gray-700'
                  }`}>
                    Tier {item.tier}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300 mb-2">{item.highlight}</p>
              <div className="text-xs text-gray-500 font-mono">
                Tech: <span className="text-gray-400">{item.tech}</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 text-right">
              <div className="flex gap-3 text-xs font-mono bg-black/50 px-3 py-1.5 rounded border border-gray-800">
                {item.codeScore && <span>Code: <strong className="text-green-400">{item.codeScore}</strong></span>}
                {item.docsScore && <span>Docs: <strong className="text-green-400">{item.docsScore}</strong></span>}
                {item.volume && <span>Vol: <strong className="text-gray-300">{item.volume}</strong></span>}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-400 hover:underline font-mono"
                >
                  [ GitHub Repo → ]
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;

"use client";
import React from 'react';
import { articlesData } from '@/data/portfolioData';

const ArticlesSection = () => {
  return (
    <section id="articles" className="py-12 px-6 max-w-6xl mx-auto border-b border-gray-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-green-400 mb-2">Articles & Documentation</h2>
        <p className="text-gray-400">
          In-depth technical guides, specifications, and educational repositories for production infrastructure and AI systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articlesData.map((article, idx) => (
          <div
            key={idx}
            className="bg-gray-900/60 border border-gray-800 hover:border-green-500/50 p-6 rounded-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white hover:text-green-400 transition-colors">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>
                {article.docsScore && (
                  <span className="text-xs bg-green-950 text-green-300 px-2.5 py-1 rounded border border-green-800 font-mono">
                    Docs {article.docsScore}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {article.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 font-mono pt-3 border-t border-gray-800/80">
                <span>Tech: <strong className="text-gray-300">{article.tech}</strong></span>
                {article.volume && <span className="text-green-400">{article.volume}</span>}
              </div>
              <div className="mt-3 text-right">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-400 hover:underline font-mono inline-flex items-center gap-1"
                >
                  Read Guides & Source Code →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArticlesSection;

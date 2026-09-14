"use client";
import React from 'react';
import { cvData } from '@/data/portfolioData';

const CVSection = () => {
  return (
    <section id="cv" className="py-12 px-6 max-w-6xl mx-auto border-b border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-green-400 mb-1">{cvData.name}</h2>
          <p className="text-xl text-gray-300 font-semibold">{cvData.role}</p>
          <p className="text-sm text-gray-500">{cvData.location} • {cvData.currentCompany}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right bg-gray-900 p-4 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Education</p>
          <p className="text-sm font-semibold text-gray-200">{cvData.education.institution}</p>
          <p className="text-xs text-gray-400">{cvData.education.degree}</p>
        </div>
      </div>

      <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 mb-8">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Executive Summary</h3>
        <p className="text-gray-300 leading-relaxed">{cvData.summary}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-green-300 mb-4">Key Career & Engineering Highlights</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cvData.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start bg-gray-950 p-4 rounded-lg border border-gray-800/80">
              <span className="text-green-500 font-bold mr-3">✓</span>
              <span className="text-gray-300 text-sm leading-relaxed">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CVSection;

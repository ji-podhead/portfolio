import React from 'react';

const Footer = () => {
  return (
    <footer className="py-10 px-6 border-t border-gray-800 text-center">
      <p className="text-gray-400 text-sm mb-4">
        &copy; 2025 ji-podhead — MLOps, AI Security & Infrastructure
      </p>
      <div className="flex justify-center gap-6 text-sm font-mono">
        <a href="https://github.com/ji-podhead" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
          GitHub ↗
        </a>
        <a href="https://www.linkedin.com/in/leonardo-jacobi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
          LinkedIn ↗
        </a>
        <a href="https://github.com/ji-podhead/articles" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
          Articles ↗
        </a>
        <a href="https://ji-podhead.github.io/agentic-knowledge/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
          Knowledge Portal ↗
        </a>
      </div>
    </footer>
  );
};

export default Footer;

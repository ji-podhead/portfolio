import React, { useEffect, useState } from 'react';

const ScrollspyNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const navItems = [
    { id: 'cv', label: 'CV' },
    { id: 'opensource', label: 'OpenSource' },
    { id: 'projects', label: 'Projects' },
    { id: 'articles', label: 'Articles' },
  ];

  return (
    <nav className="scrollspy-nav fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block bg-gray-900/80 p-3 rounded-full border border-gray-800 backdrop-blur">
      <ul className="flex flex-col gap-3">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block w-3 h-3 rounded-full transition-all ${
                activeSection === item.id
                  ? 'bg-green-400 scale-125 ring-4 ring-green-400/20'
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
              title={item.label}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ScrollspyNav;

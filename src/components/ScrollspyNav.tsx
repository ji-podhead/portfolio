"use client";
import React, { useState, useEffect, useRef } from 'react';
import type { Animator } from '@/lib/kooljs/animator';

const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'experience', name: 'Experience' },
    { id: 'map-section', name: 'Locations' },
    { id: 'projects', name: 'Projects' },
    { id: 'skills', name: 'Skills' },
];

const ScrollspyNav = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const animatorRef = useRef<Animator | null>(null);
    const scrollAnimationRef = useRef<any>(null);

    useEffect(() => {
        import('@/lib/kooljs/animator').then(({ Animator: AnimatorClass }) => {
            const animator = new AnimatorClass(60);
            animatorRef.current = animator;
            animator.init();
        });

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            let currentSection = 'hero';

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition) {
                    currentSection = section.id;
                }
            }
            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if(animatorRef.current) animatorRef.current.kill();
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element && animatorRef.current) {
            const targetPosition = element.offsetTop;
            const startPosition = window.scrollY;

            // Re-create the animation with new start/end points
            scrollAnimationRef.current = animatorRef.current.Lerp({
                duration: 50,
                steps: [startPosition, targetPosition],
                render_callback: (val: number) => {
                    window.scrollTo(0, val);
                }
            });

            animatorRef.current.start_animations([scrollAnimationRef.current.id]);
        }
    };

    return (
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-20">
            <ul className="flex flex-col space-y-4">
                {sections.map((section) => (
                    <li key={section.id} className="flex items-center justify-end">
                        <span
                            className={`mr-3 text-white text-sm transition-opacity duration-300 ${activeSection === section.id ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {section.name}
                        </span>
                        <button
                            onClick={() => scrollToSection(section.id)}
                            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${activeSection === section.id ? 'bg-white scale-125' : 'bg-transparent'}`}
                            aria-label={`Scroll to ${section.name}`}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ScrollspyNav;
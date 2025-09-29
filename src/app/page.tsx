"use client"
import Header from '@/components/Header';
import GLSLBackground from '@/components/GLSLBackground';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import Experience from '@/components/Experience';
import HeroContent from '@/components/HeroContent';
import ShaderShowcase from '@/components/ShaderShowcase';
import dynamic from 'next/dynamic';
import ParticlesMain from '@/lib/particles/particles';

// Dynamically import OSMView with SSR turned off to prevent `window` is not defined errors.
const OSMView = dynamic(() => import('@/components/OSMView'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading Map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div>
      <ParticlesMain></ParticlesMain>
{/* 
      <GLSLBackground shaderName="final" />
      <Header />
      <main>
       <HeroContent />
        <Experience />
        <OSMView />
        <Projects />
        <ShaderShowcase />
        <Skills /> 
      </main>
      <Footer /> */}
    </div>
  );
}
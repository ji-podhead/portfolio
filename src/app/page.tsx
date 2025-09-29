import Header from '@/components/Header';
import GLSLBackground from '@/components/GLSLBackground';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import Experience from '@/components/Experience';
import HeroContent from '@/components/HeroContent';
import OSMView from '@/components/OSMView'; // Import the new map component
import ParticleText from '@/lib/particles/particles';

export default function Home() {
  return (
    <div>
      <ParticleText></ParticleText>
      {/* <GLSLBackground />
      <Header />
      <main>
        <HeroContent />
        <Experience />
        <OSMView />
        <Projects />
        <Skills />
      </main>
      <Footer /> */}
    </div>
  );
}
import Header from '../components/Header';
import GLSLBackground from '../components/GLSLBackground';
import HeroContent from '../components/HeroContent';
import ShaderShowcase from '../components/ShaderShowcase';
import CVSection from '../components/CVSection';
import OpenSourceSection from '../components/OpenSourceSection';
import ProjectsSection from '../components/ProjectsSection';
import ArticlesSection from '../components/ArticlesSection';
import KnowledgePortalSection from '../components/KnowledgePortalSection';
import Footer from '../components/Footer';
import ScrollspyNav from '../components/ScrollspyNav';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative font-sans">
      <GLSLBackground shaderName="background" />
      <Header />
      <ScrollspyNav />

      {/* Interactive Hero Section with Particle Morphing */}
      <section id="hero" className="relative">
        <HeroContent />
      </section>

      {/* Interactive Shader & Particle Playground */}
      <ShaderShowcase />

      {/* Portfolio Core Sections */}
      <main className="relative z-10 space-y-12 pb-20">
        <CVSection />
        <OpenSourceSection />
        <ProjectsSection />
        <ArticlesSection />
        <KnowledgePortalSection />
      </main>

      <Footer />
    </div>
  );
}

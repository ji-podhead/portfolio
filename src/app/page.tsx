import Header from '@/components/Header';
import GLSLBackground from '@/components/GLSLBackground';
import CVSection from '@/components/CVSection';
import OpenSourceSection from '@/components/OpenSourceSection';
import ProjectsSection from '@/components/ProjectsSection';
import ArticlesSection from '@/components/ArticlesSection';
import Footer from '@/components/Footer';
import ScrollspyNav from '@/components/ScrollspyNav';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative font-sans">
      <GLSLBackground shaderName="background" />
      <Header />
      <ScrollspyNav />

      <main className="relative z-10 space-y-12 pb-20">
        <CVSection />
        <OpenSourceSection />
        <ProjectsSection />
        <ArticlesSection />
      </main>

      <Footer />
    </div>
  );
}

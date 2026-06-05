import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring } from 'motion/react';
import { NetworkBackground } from './components/NetworkBackground.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Projects } from './components/Projects.tsx';
import { Blog } from './components/Blog.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ProjectDetail } from './components/ProjectDetail.tsx';
import { BlogPostDetail } from './components/BlogPostDetail.tsx';

const GlobalScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-primary z-[1000] origin-left shadow-[0_0_12px_rgba(0,180,255,0.6)]"
      style={{ scaleX }}
    />
  );
};

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const VisitTracker = () => {
  const location = useLocation();
  useEffect(() => {
    if (!sessionStorage.getItem('tracked')) {
      fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: location.pathname, userAgent: navigator.userAgent })
      }).catch(() => {});
      sessionStorage.setItem('tracked', 'true');
    }
  }, []);
  return null;
};

const HomePage = () => (
  <>
    <Helmet>
      <title>Ahamed Hassani M'homa | Ingénieur Systèmes, Réseaux & Cloud</title>
      <meta name="description" content="Ahamed Hassani M'homa — Ingénieur Systèmes & Réseaux, administration Linux/Windows Server, virtualisation, Cloud & DevOps. Portfolio, projets infrastructure et articles techniques." />
      <meta property="og:title" content="Ahamed Hassani M'homa | Ingénieur Systèmes, Réseaux & Cloud" />
      <meta property="og:description" content="Administration systèmes & réseaux, Cloud, DevOps et cybersécurité. Découvrez mes projets et réalisations." />
      <meta property="og:type" content="website" />
    </Helmet>
    <Hero />
    <About />
    <Projects />
    <Blog />
    <Contact />
  </>
);

const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <NetworkBackground />
    <GlobalScrollProgress />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <Router>
      <ScrollToHash />
      <VisitTracker />
      <Routes>
        <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
        <Route path="/project/:slug" element={<SiteLayout><ProjectDetail /></SiteLayout>} />
        <Route path="/blog/:slug" element={<SiteLayout><BlogPostDetail /></SiteLayout>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

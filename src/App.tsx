import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Home } from './components/Home.tsx';
import { Travaux } from './components/Travaux.tsx';
import { Journal } from './components/Journal.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { NotFound } from './components/NotFound.tsx';
import { PageTransition } from './components/PageTransition.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';

// Chargées à la demande : le rendu Markdown (avec la coloration syntaxique)
// et l'admin (avec les graphiques) ne doivent pas peser sur l'accueil.
const ProjectDetail = lazy(() => import('./components/ProjectDetail.tsx').then(m => ({ default: m.ProjectDetail })));
const BlogPostDetail = lazy(() => import('./components/BlogPostDetail.tsx').then(m => ({ default: m.BlogPostDetail })));
const ParcoursDetail = lazy(() => import('./components/ParcoursDetail.tsx').then(m => ({ default: m.ParcoursDetail })));
const ExperienceDetail = lazy(() => import('./components/ExperienceDetail.tsx').then(m => ({ default: m.ExperienceDetail })));
const AdminLogin = lazy(() => import('./components/AdminLogin.tsx').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard.tsx').then(m => ({ default: m.AdminDashboard })));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const offset = 24;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
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
    // Une seule fois par session, pour ne pas polluer les statistiques.
    const sessionTracked = sessionStorage.getItem('tracked');
    if (!sessionTracked) {
      fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: location.pathname,
          userAgent: navigator.userAgent
        })
      }).catch(err => console.error('Visit tracking failed:', err));
      sessionStorage.setItem('tracked', 'true');
    }
  }, []); // Only on mount

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/travaux" element={<PageTransition><Travaux /></PageTransition>} />
          <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
          <Route path="/parcours/:slug" element={<PageTransition><ParcoursDetail /></PageTransition>} />
          <Route path="/experience/:slug" element={<PageTransition><ExperienceDetail /></PageTransition>} />
          <Route path="/project/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPostDetail /></PageTransition>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  const [easterEgg, setEasterEgg] = useState<'sudo' | 'ping' | null>(null);
  const keysPressed = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isTyping) return;
      if (e.metaKey || e.ctrlKey) return; // ne pas gêner Ctrl/Cmd+K

      keysPressed.current.push(e.key.toLowerCase());
      if (keysPressed.current.length > 4) keysPressed.current.shift();

      const buffer = keysPressed.current.join('');
      if (buffer.endsWith('sudo')) {
        setEasterEgg('sudo');
        setTimeout(() => setEasterEgg(null), 3000);
        keysPressed.current = [];
      } else if (buffer.endsWith('ping')) {
        setEasterEgg('ping');
        setTimeout(() => setEasterEgg(null), 2000);
        keysPressed.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <Router>
          <Helmet>
            <title>Ahamed Hassani Mhoma — Ingénieur Systèmes & Réseaux · DevOps</title>
            <meta name="description" content="Site personnel d'Ahamed Hassani Mhoma, ingénieur Systèmes & Réseaux et DevOps : projets, parcours et journal." />
          </Helmet>
          <ScrollToHash />
          <VisitTracker />
          <CommandPalette />
          <div className="relative min-h-screen bg-bg">
            <AnimatedRoutes />

            {/* Clins d'œil clavier */}
            <AnimatePresence>
              {easterEgg === 'sudo' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md"
                >
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-accent-primary mb-2">ACCESS GRANTED</h2>
                    <p className="text-white/60">System override initiated... Just kidding!</p>
                  </div>
                </motion.div>
              )}
              {easterEgg === 'ping' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-text-primary text-bg px-5 py-2.5 rounded-full text-sm font-medium"
                >
                  pong — 12 ms depuis Dakar
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Router>
      </MotionConfig>
    </HelmetProvider>
  );
}

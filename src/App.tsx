import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar.tsx';
import { Home } from './components/Home.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Travaux } from './components/Travaux.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { ProjectDetail } from './components/ProjectDetail.tsx';
import { BlogPostDetail } from './components/BlogPostDetail.tsx';
import { NotFound } from './components/NotFound.tsx';
import { PageTransition } from './components/PageTransition.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';

const GlobalScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent-primary z-[1000] origin-left"
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
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
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
    // Only track once per session to avoid spamming
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
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/travaux" element={<PageTransition><Travaux /></PageTransition>} />
        <Route path="/project/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPostDetail /></PageTransition>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
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
      if ((e.metaKey || e.ctrlKey)) return; // don't interfere with Ctrl/Cmd+K

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
            <meta name="description" content="Site personnel d'Ahamed Hassani Mhoma, ingénieur Systèmes & Réseaux et DevOps : travaux, expérimentations et parcours." />
          </Helmet>
          <GlobalScrollProgress />
          <ScrollToHash />
          <VisitTracker />
          <CommandPalette />
          <div className="relative min-h-screen bg-bg">
            <Navbar />

            <AnimatedRoutes />

            <Footer />

            {/* Easter eggs */}
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

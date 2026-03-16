
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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

export default function App() {
  const [sudoActive, setSudoActive] = useState(false);
  const keysPressed = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.push(e.key.toLowerCase());
      if (keysPressed.current.length > 4) keysPressed.current.shift();
      
      if (keysPressed.current.join('') === 'sudo') {
        setSudoActive(true);
        setTimeout(() => setSudoActive(false), 3000);
        keysPressed.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <ScrollToHash />
      <SpeedInsights />
      <div className="relative min-h-screen overflow-x-hidden bg-bg">
        <NetworkBackground />
        <Navbar />
        
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <About />
              <Projects />
              <Blog />
              <Contact />
            </main>
          } />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <Footer />

        {/* Easter Egg */}
        <AnimatePresence>
          {sudoActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            >
              <div className="text-center">
                <Terminal className="w-24 h-24 text-accent-primary mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl font-mono font-bold text-accent-primary mb-2">ACCESS GRANTED</h2>
                <p className="text-white/60 font-mono">System override initiated... Just kidding!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

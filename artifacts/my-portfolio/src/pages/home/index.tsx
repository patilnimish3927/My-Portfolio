import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Skills from '@/components/sections/skills';
import Projects from '@/components/sections/projects';
import Experience from '@/components/sections/experience';
import Education from '@/components/sections/education';
import Achievements from '@/components/sections/achievements';
import Certificates from '@/components/sections/certificates';
import Contact from '@/components/sections/contact';
import SettingsPanel from '@/components/settings-panel';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-primary text-sm tracking-widest uppercase">INITIALIZING_SYSTEM</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Achievements />
        <Certificates />
        <Contact />
      </main>

      <Footer />
      <SettingsPanel />
    </div>
  );
}

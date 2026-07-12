import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGetProfile } from '@workspace/api-client-react';
import { FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi';

const GITHUB_URL = 'https://github.com/patilnimish3927';
const LINKEDIN_URL = 'https://www.linkedin.com/in/nimishpatil3927/';

export default function Hero() {
  const { data: profile } = useGetProfile();

  const roles = [
    "Full Stack Developer",
    "AI/ML Enthusiast",
    "System Designer",
    "Problem Solver",
    "Computer Engineering Student"
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles, typingSpeed]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1 mb-6 border border-primary/50 bg-primary/10 text-primary rounded-full font-mono text-sm font-medium">
            System Online • Ready to build
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Hi, I'm <span className="text-primary">{profile?.name || 'Nimish'}</span>{' '}
            <span className="inline-block origin-bottom-right hover:animate-waving-hand">👋</span>
          </h1>

          <div className="h-12 mb-6">
            <h2 className="text-2xl md:text-3xl font-mono text-muted-foreground">
              &gt; {displayText}<span className="animate-pulse text-primary">_</span>
            </h2>
          </div>

          <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
            {profile?.headline || 'Forging robust digital solutions at the intersection of web development and artificial intelligence.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {profile?.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary),0.4)]"
              >
                <FiDownload /> Download Resume
              </a>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-primary/40 text-primary-foreground/60 font-medium rounded cursor-not-allowed"
              >
                <FiDownload /> Resume Not Set
              </button>
            )}
            <a
              href="#projects"
              className="px-6 py-3 border border-border bg-card text-foreground font-medium rounded hover:border-primary hover:text-primary transition-all"
            >
              View Projects
            </a>
            <div className="flex gap-2 ml-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-all bg-card"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-all bg-card"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-primary/50 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-8 rounded-full bg-card border border-border overflow-hidden flex items-center justify-center shadow-2xl">
              {profile?.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-primary font-mono text-8xl font-bold">
                  {(profile?.name || 'N').charAt(0)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}

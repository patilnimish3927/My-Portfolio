import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useListProjects } from '@workspace/api-client-react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useMotionTemplate`${mouseYSpring}deg`;
  const rotateY = useMotionTemplate`${mouseXSpring}deg`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct * 10);
    y.set(yPct * -10);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default function Projects() {
  const { data: projects } = useListProjects();

  const defaultProjects = [
    {
      title: "Smart Shuttle",
      description: "A full-stack Progressive Web App for real-time shuttle tracking and journey planning. Features live GPS tracking, ETA calculations, route optimization, and an admin dashboard.",
      techStack: ["React", "Node.js", "PostgreSQL", "Leaflet.js", "WebSockets"],
      githubUrl: "https://github.com",
      liveUrl: "#"
    },
    {
      title: "Automated Lecture Summarizer",
      description: "AI-powered tool that transcribes audio lectures using OpenAI Whisper and generates intelligent summaries using the BART transformer model. Includes keyword extraction via a clean Gradio interface.",
      techStack: ["Python", "Whisper", "BART", "Gradio", "NLP"],
      githubUrl: "https://github.com"
    }
  ];

  const displayProjects = projects?.length ? projects : defaultProjects;

  return (
    <section id="projects" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary">03.</span> Featured Projects
          </h2>
          <div className="w-24 h-1 bg-primary rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              style={{ perspective: 1000 }}
            >
              <TiltCard className="h-full bg-background border border-border rounded-xl p-8 group hover:border-primary/50 transition-colors flex flex-col shadow-lg">
                <div className="flex justify-between items-start mb-6 transform-gpu" style={{ transform: "translateZ(30px)" }}>
                  <div className="font-mono text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded">
                    Featured Project
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                        <FiGithub className="w-6 h-6" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                        <FiExternalLink className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors transform-gpu" style={{ transform: "translateZ(40px)" }}>
                  {project.title}
                </h3>
                
                <div className="text-muted-foreground mb-8 flex-grow transform-gpu" style={{ transform: "translateZ(20px)" }}>
                  <p className="leading-relaxed">{project.description}</p>
                </div>

                <ul className="flex flex-wrap gap-3 font-mono text-xs text-foreground/80 transform-gpu" style={{ transform: "translateZ(30px)" }}>
                  {project.techStack.map((tech, i) => (
                    <li key={i} className="bg-card border border-border px-2 py-1 rounded">
                      {tech}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background hover:border-primary hover:text-primary rounded text-sm font-mono transition-colors">
            View full archive on GitHub <FiExternalLink />
          </a>
        </div>
      </div>
    </section>
  );
}

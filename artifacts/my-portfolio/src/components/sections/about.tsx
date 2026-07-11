import React from 'react';
import { motion } from 'framer-motion';
import { useGetProfile, useListProjects, useListSkills, useListExperience } from '@workspace/api-client-react';
import { Code, Cpu, ShieldAlert, Sparkles } from 'lucide-react';

export default function About() {
  const { data: profile } = useGetProfile();
  const { data: projects } = useListProjects();
  const { data: skills } = useListSkills();
  const { data: experience } = useListExperience();

  const stats = [
    { label: 'Projects Built', value: projects?.length || '10+' },
    { label: 'Technologies Mastered', value: skills?.length || '25+' },
    { label: 'Months Experience', value: (experience?.length || 0) * 2 + '+' },
    { label: 'Lines of Code', value: '100k+' },
  ];

  const highlights = [
    { icon: <Code className="w-6 h-6 text-primary" />, title: 'Software Development', desc: 'Full-stack architectures and scalable APIs.' },
    { icon: <Cpu className="w-6 h-6 text-primary" />, title: 'AI & ML', desc: 'Training and deploying models for real-world problems.' },
    { icon: <ShieldAlert className="w-6 h-6 text-primary" />, title: 'Problem Solving', desc: 'Algorithmic thinking and code optimization.' },
    { icon: <Sparkles className="w-6 h-6 text-primary" />, title: 'Continuous Learning', desc: 'Always exploring the edge of technology.' },
  ];

  return (
    <section id="about" className="py-24 bg-card border-y border-border relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary">01.</span> About Me
          </h2>
          <div className="w-24 h-1 bg-primary rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Bridging Logic and Creativity</h3>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                {profile?.bio || `As a Computer Engineering student specializing in AI & ML, I build precise, high-performance systems. I recently interned at JSW Steel Ltd., where I applied my skills in a massive industrial IT environment. My passion lies in creating full-stack applications that don't just work, but feel engineered.`}
              </p>
              <p className="mt-4">
                When I'm not writing code, I'm exploring system design architectures, participating in hackathons, or diving deep into advanced Python and Cyber Security concepts. I believe that good software is like good industrial design—it should be robust, functional, and aesthetically striking.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-3xl font-bold text-foreground font-mono">{stat.value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background border border-border p-6 rounded-lg hover:border-primary/50 transition-colors group"
              >
                <div className="mb-4 bg-card w-12 h-12 rounded-full flex items-center justify-center border border-border group-hover:bg-primary/10 transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

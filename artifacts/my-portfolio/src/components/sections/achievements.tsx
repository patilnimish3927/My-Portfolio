import React from 'react';
import { motion } from 'framer-motion';
import { useListAchievements } from '@workspace/api-client-react';
import { Trophy } from 'lucide-react';

export default function Achievements() {
  const { data: achievements } = useListAchievements();

  const defaultAchievements = [
    { title: "GDG Cloud Campaign Mentor", description: "Led cloud computing awareness campaign as Google Developer Groups mentor." },
    { title: "Git & GitHub Workshop Speaker", description: "Conducted hands-on workshop for 50+ students on version control." },
    { title: "HackerRank Gold Badge", description: "Earned Gold badge in Problem Solving on HackerRank." },
    { title: "Smart India Hackathon Finalist", description: "Developed a prototype for urban mobility optimization." },
  ];

  const displayAch = achievements?.length ? achievements : defaultAchievements;

  return (
    <section id="achievements" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono">
              <span className="text-primary">06.</span> Achievements
            </h2>
          </div>
          <div className="w-24 h-1 bg-primary rounded" />
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayAch.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 border border-border bg-card rounded flex items-start gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="mt-1 text-primary text-lg">▹</div>
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

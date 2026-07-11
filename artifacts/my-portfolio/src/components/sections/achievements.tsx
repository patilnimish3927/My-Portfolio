import React from 'react';
import { motion } from 'framer-motion';
import { useListAchievements, useListCertificates } from '@workspace/api-client-react';
import { Trophy, Award } from 'lucide-react';

export default function Achievements() {
  const { data: achievements } = useListAchievements();
  const { data: certificates } = useListCertificates();

  const defaultAchievements = [
    { title: "GDG Cloud Campaign Mentor", description: "Led cloud computing awareness campaign as Google Developer Groups mentor." },
    { title: "Git & GitHub Workshop Speaker", description: "Conducted hands-on workshop for 50+ students on version control." },
    { title: "HackerRank Gold Badge", description: "Earned Gold badge in Problem Solving on HackerRank." },
    { title: "Smart India Hackathon Finalist", description: "Developed a prototype for urban mobility optimization." },
  ];

  const defaultCertificates = [
    { name: "Cyber Security Fundamentals", issuer: "HackerRank", issueDate: "2025" },
    { name: "Advanced Python", issuer: "HackerRank", issueDate: "2025" },
    { name: "Basic Python", issuer: "HackerRank", issueDate: "2024" },
    { name: "MSCIT", issuer: "MSBTE", issueDate: "2022" },
  ];

  const displayAch = achievements?.length ? achievements : defaultAchievements;
  const displayCert = certificates?.length ? certificates : defaultCertificates;

  return (
    <section id="achievements" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Achievements */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Trophy className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-mono">Achievements</h2>
            </div>
            
            <div className="space-y-4">
              {displayAch.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-5 border border-border bg-card rounded flex items-start gap-4 hover:border-primary/50 transition-colors"
                >
                  <div className="mt-1 text-primary">▹</div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-mono">Certifications</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayCert.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 border border-border bg-card rounded group hover:bg-primary hover:border-primary transition-all flex flex-col items-center text-center justify-center aspect-square"
                >
                  <Award className="w-10 h-10 mb-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  <h3 className="font-bold text-foreground group-hover:text-primary-foreground mb-2 leading-tight">
                    {cert.name}
                  </h3>
                  <div className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 mt-auto">
                    {cert.issuer} • {cert.issueDate}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

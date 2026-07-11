import React from 'react';
import { motion } from 'framer-motion';
import { useListEducation } from '@workspace/api-client-react';
import { BookOpen } from 'lucide-react';

export default function Education() {
  const { data: education } = useListEducation();

  const defaultEducation = [
    {
      degree: "B.E. Computer Engineering (AI & ML)",
      institution: "Vishwakarma Institute of Technology",
      startYear: 2022,
      endYear: 2026,
      grade: "CGPA: 8.5/10",
      description: "Focused on core computer science concepts, machine learning algorithms, and full-stack development."
    },
    {
      degree: "12th Grade (HSC)",
      institution: "Pace Junior Science College",
      startYear: 2020,
      endYear: 2022,
      grade: "Score: 89%"
    },
    {
      degree: "10th Grade (SSC)",
      institution: "St. Xavier's High School",
      startYear: 2010,
      endYear: 2020,
      grade: "Score: 92%"
    }
  ];

  const displayEducation = education?.length ? education : defaultEducation;

  return (
    <section id="education" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary">05.</span> Education
          </h2>
          <div className="w-24 h-1 bg-primary rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEducation.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-background border border-border p-8 rounded-lg hover:border-primary/50 transition-all flex flex-col relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />
              <div className="absolute right-6 top-6 text-muted-foreground group-hover:text-primary transition-colors">
                <BookOpen className="w-8 h-8 opacity-20 group-hover:opacity-100" />
              </div>
              
              <div className="font-mono text-sm text-primary mb-4 border border-primary/20 bg-primary/5 self-start px-2 py-1 rounded">
                {edu.startYear} — {edu.endYear || 'Present'}
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                {edu.degree}
              </h3>
              
              <p className="text-muted-foreground mb-4 font-medium">
                {edu.institution}
              </p>
              
              <div className="mt-auto pt-4 border-t border-border">
                {edu.grade && (
                  <span className="text-sm font-bold text-foreground bg-card px-3 py-1 rounded inline-block mb-2 border border-border">
                    {edu.grade}
                  </span>
                )}
                {edu.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

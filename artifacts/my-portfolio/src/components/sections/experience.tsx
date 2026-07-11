import React from 'react';
import { motion } from 'framer-motion';
import { useListExperience } from '@workspace/api-client-react';

export default function Experience() {
  const { data: experience } = useListExperience();

  const defaultExperience = [
    {
      company: "JSW Steel Ltd.",
      role: "IT Intern",
      department: "Information Technology Department, Dolvi",
      startDate: "May 28, 2026",
      endDate: "July 11, 2026",
      responsibilities: [
        "Developed internal tools for real-time tracking of manufacturing assets using React and Node.js.",
        "Assisted in database management and optimization of PostgreSQL queries, improving retrieval times by 15%.",
        "Conducted system analysis for deployment of new network security protocols across the plant.",
        "Collaborated with senior engineers to troubleshoot network hardware and software integration issues."
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "Network Security"]
    }
  ];

  const displayExperience = experience?.length ? experience : defaultExperience;

  return (
    <section id="experience" className="py-24 bg-background relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary">04.</span> Professional Experience
          </h2>
          <div className="w-24 h-1 bg-primary rounded"></div>
        </div>

        <div className="relative border-l-2 border-border ml-4 md:ml-0 md:pl-0">
          {displayExperience.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="mb-12 relative pl-8 md:pl-10"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
              
              <div className="bg-card border border-border p-6 md:p-8 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{job.role} <span className="text-primary">@ {job.company}</span></h3>
                    {job.department && <p className="text-sm text-muted-foreground">{job.department}</p>}
                  </div>
                  <div className="font-mono text-sm text-muted-foreground bg-background px-3 py-1 rounded border border-border whitespace-nowrap">
                    {job.startDate} — {job.endDate || 'Present'}
                  </div>
                </div>

                <ul className="space-y-3 mb-6 text-muted-foreground">
                  {job.responsibilities?.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-3 mt-1 text-xs">▹</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {job.technologies && job.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {job.technologies.map((tech, i) => (
                      <span key={i} className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

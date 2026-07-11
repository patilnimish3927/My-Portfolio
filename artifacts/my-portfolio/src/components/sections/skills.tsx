import React from 'react';
import { motion } from 'framer-motion';
import { useListSkills } from '@workspace/api-client-react';
import { Progress } from '@/components/ui/progress';

export default function Skills() {
  const { data: skills } = useListSkills();

  // Group skills by category if we have data, otherwise use defaults based on prompt
  const defaultSkills = [
    { name: 'Python', level: 95, category: 'Programming' },
    { name: 'JavaScript', level: 90, category: 'Programming' },
    { name: 'TypeScript', level: 85, category: 'Programming' },
    { name: 'C++', level: 75, category: 'Programming' },
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Next.js', level: 85, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'Express', level: 85, category: 'Backend' },
    { name: 'PostgreSQL', level: 85, category: 'Databases' },
    { name: 'MongoDB', level: 75, category: 'Databases' },
    { name: 'TensorFlow', level: 75, category: 'AI & ML' },
    { name: 'PyTorch', level: 70, category: 'AI & ML' },
    { name: 'scikit-learn', level: 80, category: 'AI & ML' },
    { name: 'Git/GitHub', level: 90, category: 'Tools' },
    { name: 'Docker', level: 70, category: 'Tools' },
  ];

  const displaySkills = skills?.length ? skills : defaultSkills;
  
  const categories = Array.from(new Set(displaySkills.map(s => s.category)));

  return (
    <section id="skills" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-40 w-1/3 h-1/2 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary">02.</span> Technical Arsenal
          </h2>
          <div className="w-24 h-1 bg-primary rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {categories.map((category, idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold mb-6 font-mono text-primary border-b border-border pb-4">{category}</h3>
              <div className="space-y-6">
                {displaySkills.filter(s => s.category === category).map((skill, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm font-mono text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className="h-full bg-primary relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

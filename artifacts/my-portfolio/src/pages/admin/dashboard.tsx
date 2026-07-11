import React from 'react';
import { useGetVisitorCount, useListProjects, useListSkills } from '@workspace/api-client-react';
import { Users, Briefcase, Code, Terminal } from 'lucide-react';

export default function AdminDashboard() {
  const { data: visitors } = useGetVisitorCount();
  const { data: projects } = useListProjects();
  const { data: skills } = useListSkills();

  const stats = [
    { name: 'Total Visitors', value: visitors?.count || 0, icon: <Users className="w-8 h-8 text-primary" /> },
    { name: 'Projects', value: projects?.length || 0, icon: <Briefcase className="w-8 h-8 text-primary" /> },
    { name: 'Skills', value: skills?.length || 0, icon: <Code className="w-8 h-8 text-primary" /> },
    { name: 'System Status', value: 'Online', icon: <Terminal className="w-8 h-8 text-green-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold font-mono mb-8 border-b border-border pb-4">Command Center</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
            </div>
            <div className="p-3 bg-background rounded-full border border-border">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-8">
        <h3 className="text-xl font-bold mb-4 font-mono text-primary">System Information</h3>
        <div className="space-y-4 font-mono text-sm text-muted-foreground">
          <div className="flex border-b border-border pb-2">
            <span className="w-32">Environment</span>
            <span className="text-foreground">Production</span>
          </div>
          <div className="flex border-b border-border pb-2">
            <span className="w-32">Database</span>
            <span className="text-green-500">Connected</span>
          </div>
          <div className="flex border-b border-border pb-2">
            <span className="w-32">Last Login</span>
            <span className="text-foreground">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex pt-2">
            <span className="w-32">API Version</span>
            <span className="text-foreground">v0.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

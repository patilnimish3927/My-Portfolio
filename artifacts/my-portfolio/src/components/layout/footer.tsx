import React from 'react';
import { useGetProfile, useGetVisitorCount, useGetContact } from '@workspace/api-client-react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiHackerrank } from 'react-icons/si';

export default function Footer() {
  const { data: profile } = useGetProfile();
  const { data: visitorCount } = useGetVisitorCount();
  const { data: contact } = useGetContact();

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-mono text-2xl font-bold text-foreground mb-4">
              <span className="text-primary">&gt;</span> {profile?.name || 'Developer'}
            </h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              {profile?.headline || 'Computer Engineering (AI & ML) Student & Full Stack Developer.'}
            </p>
            <div className="flex gap-4">
              {contact?.github && (
                <a href={contact.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                  <FiGithub />
                </a>
              )}
              {contact?.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                  <FiLinkedin />
                </a>
              )}
              {contact?.hackerrank && (
                <a href={contact.hackerrank} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                  <SiHackerrank />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#skills" className="text-muted-foreground hover:text-primary transition-colors">Skills</a></li>
              <li><a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#experience" className="text-muted-foreground hover:text-primary transition-colors">Experience</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">System Stats</h4>
            <div className="p-4 bg-background border border-border rounded flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visitors:</span>
                <span className="text-primary">{visitorCount?.count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{profile?.location || 'India'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profile?.name || 'Developer'}. All rights reserved.</p>
          <p className="font-mono">Engineered with precision.</p>
        </div>
      </div>
    </footer>
  );
}

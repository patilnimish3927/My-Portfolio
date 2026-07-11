import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin } from 'lucide-react';
import { useGetContact } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { data: contact } = useGetContact();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    
    // Client-side fallback using mailto
    const mailtoLink = `mailto:${contact?.email || 'test@example.com'}?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AReply to: ${formData.email}`;
    window.location.href = mailtoLink;
    
    setFormData({ name: '', email: '', message: '' });
    toast({ title: 'Success', description: 'Opening your default mail client...' });
  };

  return (
    <section id="contact" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary">06.</span> What's Next?
          </h2>
          <h3 className="text-5xl font-bold text-foreground mb-6">Get In Touch</h3>
          <p className="text-muted-foreground max-w-lg">
            I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 bg-background border border-border rounded-xl overflow-hidden shadow-xl">
          
          <div className="md:col-span-2 bg-muted/50 p-8 border-r border-border flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold mb-6 font-mono">Contact Information</h4>
              <div className="space-y-6">
                {(contact?.showEmail !== false) && contact?.email && (
                  <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                )}
                <div className="flex items-center gap-4 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{contact?.location || 'India'}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <div className="w-full h-32 bg-card rounded border border-border flex items-center justify-center text-muted-foreground overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <span className="font-mono text-sm z-10 relative bg-card px-2 py-1 rounded border border-border text-primary font-bold">SYSTEM.READY</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-mono text-muted-foreground">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-card border border-border rounded p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-mono text-muted-foreground">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-card border border-border rounded p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-mono text-muted-foreground">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-card border border-border rounded p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Hello, I'd like to talk about..."
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" /> Transmit Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAdminLogin } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [_, setLocation] = useLocation();
  const login = useAdminLogin();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          toast({ title: 'Access Granted', description: 'Welcome to the command center.' });
          setLocation('/admin');
        },
        onError: () => {
          toast({ title: 'Access Denied', description: 'Invalid credentials.', variant: 'destructive' });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="bg-muted px-6 py-4 border-b border-border flex items-center justify-between">
          <h1 className="font-mono font-bold text-foreground">SYSTEM_LOGIN</h1>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-background border border-border rounded p-2.5 pl-10 text-foreground focus:border-primary outline-none transition-colors"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded p-2.5 pl-10 text-foreground focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded font-mono hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {login.isPending ? 'AUTHENTICATING...' : 'INITIALIZE'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground font-mono">
            Hint: dev default is admin / admin123
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminLogout, useAdminGetMe } from '@workspace/api-client-react';
import { 
  LayoutDashboard, User, Code, Briefcase, GraduationCap, 
  Trophy, Award, Mail, Settings, LogOut 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isError, isLoading } = useAdminGetMe();
  const logout = useAdminLogout();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isError) {
      setLocation('/admin/login');
    }
  }, [isError, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast({ title: 'Logged out successfully' });
        setLocation('/admin/login');
      }
    });
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (isError) return null; // Will redirect

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Profile', path: '/admin/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Skills', path: '/admin/skills', icon: <Code className="w-5 h-5" /> },
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Experience', path: '/admin/experience', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Education', path: '/admin/education', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Achievements', path: '/admin/achievements', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Certificates', path: '/admin/certificates', icon: <Award className="w-5 h-5" /> },
    { name: 'Contact', path: '/admin/contact', icon: <Mail className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold font-mono text-primary">ADMIN_PANEL</h1>
          <p className="text-xs text-muted-foreground mt-1">Logged in as {user?.username}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

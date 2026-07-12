import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Home from '@/pages/home';
import AdminLayout from '@/components/admin/layout';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProfile from '@/pages/admin/profile';
import AdminSkills from '@/pages/admin/skills';
import AdminProjects from '@/pages/admin/projects';
import AdminExperience from '@/pages/admin/experience';
import AdminEducation from '@/pages/admin/education';
import AdminAchievements from '@/pages/admin/achievements';
import AdminCertificates from '@/pages/admin/certificates';
import AdminContact from '@/pages/admin/contact';
import AdminSettings from '@/pages/admin/settings';
import NotFound from '@/pages/not-found';

import CustomCursor from '@/components/custom-cursor';
import { useEffect } from 'react';
import { useGetPortfolioSettings, useRecordVisit } from '@workspace/api-client-react';

const queryClient = new QueryClient();

function Shell({ children }: { children: React.ReactNode }) {
  const { data: settings } = useGetPortfolioSettings();
  const recordVisit = useRecordVisit();
  const [location] = useLocation();

  useEffect(() => {
    // Only count visits on the public portfolio page, not admin pages
    if (location === '/' || location === '') {
      recordVisit.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (settings) {
      document.documentElement.setAttribute('data-style', settings.style || 'industrial');
      if (settings.cursorEffects) {
        document.body.classList.add('custom-cursor-enabled');
      } else {
        document.body.classList.remove('custom-cursor-enabled');
      }
    } else {
      document.documentElement.setAttribute('data-style', 'industrial');
      document.body.classList.add('custom-cursor-enabled');
    }
  }, [settings]);

  return (
    <>
      {(settings?.cursorEffects ?? true) && <CustomCursor />}
      {children}
    </>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/profile" component={AdminProfile} />
        <Route path="/admin/skills" component={AdminSkills} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/experience" component={AdminExperience} />
        <Route path="/admin/education" component={AdminEducation} />
        <Route path="/admin/achievements" component={AdminAchievements} />
        <Route path="/admin/certificates" component={AdminCertificates} />
        <Route path="/admin/contact" component={AdminContact} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={() => (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg mt-8">
            Page not found.
          </div>
        )} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminRoutes} />
        <Route path="/admin/:rest*" component={AdminRoutes} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

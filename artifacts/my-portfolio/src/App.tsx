import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Home from '@/pages/home';
import AdminLayout from '@/components/admin/layout';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import NotFound from '@/pages/not-found';

import CustomCursor from '@/components/custom-cursor';
import { useEffect } from 'react';
import { useGetPortfolioSettings, useRecordVisit } from '@workspace/api-client-react';

import AdminProfile from '@/pages/admin/profile';

const queryClient = new QueryClient();

// Shell component to handle global things like custom cursor, visits, theme styles
function Shell({ children }: { children: React.ReactNode }) {
  const { data: settings } = useGetPortfolioSettings();
  const recordVisit = useRecordVisit();

  useEffect(() => {
    recordVisit.mutate();
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

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={() => (
          <AdminLayout>
            <Switch>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/profile" component={AdminProfile} />
              <Route component={() => <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg mt-8">Module not yet instantiated.</div>} />
            </Switch>
          </AdminLayout>
        )} />
        {/* We can add sub-routes for admin later if needed, e.g. /admin/skills */}
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

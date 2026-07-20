import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

import { Layout as AppLayout } from '@/components/layout';
import MarketingLayout from '@/components/marketing-layout';

import Dashboard from '@/pages/dashboard';
import Rules from '@/pages/rules';
import RuleDetail from '@/pages/rule-detail';
import Decisions from '@/pages/decisions';
import Candidates from '@/pages/candidates';
import CandidateDetail from '@/pages/candidate-detail';
import Alerts from '@/pages/alerts';
import Validation from '@/pages/validation';
import Settings from '@/pages/settings';

import Home from '@/pages/marketing/home';
import Pricing from '@/pages/marketing/pricing';
import HowItWorks from '@/pages/marketing/how-it-works';
import About from '@/pages/marketing/about';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouter() {
  return (
    <Switch>
      {/* Marketing Routes */}
      <Route path="/">
        <MarketingLayout>
          <Home />
        </MarketingLayout>
      </Route>
      <Route path="/pricing">
        <MarketingLayout>
          <Pricing />
        </MarketingLayout>
      </Route>
      <Route path="/how-it-works">
        <MarketingLayout>
          <HowItWorks />
        </MarketingLayout>
      </Route>
      <Route path="/about">
        <MarketingLayout>
          <About />
        </MarketingLayout>
      </Route>

      {/* App Routes */}
      <Route path="/app/*">
        <AppLayout>
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/rules" component={Rules} />
            <Route path="/app/rules/:id" component={RuleDetail} />
            <Route path="/app/decisions" component={Decisions} />
            <Route path="/app/candidates" component={Candidates} />
            <Route path="/app/candidates/:id" component={CandidateDetail} />
            <Route path="/app/alerts" component={Alerts} />
            <Route path="/app/validation" component={Validation} />
            <Route path="/app/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>

      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppRouter />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

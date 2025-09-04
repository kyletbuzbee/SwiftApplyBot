import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import JobSearch from "@/pages/job-search";
import Applications from "@/pages/applications";
import Profile from "@/pages/profile";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/job-search" component={JobSearch} />
      <Route path="/applications" component={Applications} />
      <Route path="/profile" component={Profile} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Router />
        </main>
      </div>
      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button 
          className="bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
          data-testid="button-mobile-quick-apply"
        >
          <i className="fas fa-rocket h-6 w-6"></i>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

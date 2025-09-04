import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (location) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/job-search":
        return "Job Search";
      case "/applications":
        return "Applications";
      case "/profile":
        return "Profile";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      default:
        return "JobFlow";
    }
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <i className="fas fa-bars h-4 w-4"></i>
          </button>
          <h2 className="ml-2 lg:ml-0 text-lg font-semibold text-foreground" data-testid="text-page-title">
            {getPageTitle()}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent relative"
            data-testid="button-notifications"
          >
            <i className="fas fa-bell h-4 w-4"></i>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground" data-testid="text-user-name">
                Sarah Johnson
              </div>
              <div className="text-xs text-muted-foreground" data-testid="text-user-email">
                sarah.j@email.com
              </div>
            </div>
            <button
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium"
              data-testid="button-user-menu"
            >
              SJ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

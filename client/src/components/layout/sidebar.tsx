import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "fas fa-chart-line" },
  { name: "Job Search", href: "/job-search", icon: "fas fa-search" },
  { name: "Applications", href: "/applications", icon: "fas fa-paper-plane" },
  { name: "Profile", href: "/profile", icon: "fas fa-user-circle" },
  { name: "Analytics", href: "/analytics", icon: "fas fa-chart-bar" },
  { name: "Settings", href: "/settings", icon: "fas fa-cog" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-card border-r border-border pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-primary-foreground text-sm"></i>
            </div>
            <h1 className="ml-3 text-xl font-bold text-foreground" data-testid="text-app-name">JobFlow</h1>
          </div>
        </div>
        <nav className="mt-8 flex-1">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    data-testid={`link-${item.name.toLowerCase().replace(" ", "-")}`}
                  >
                    <i className={`${item.icon} mr-3 flex-shrink-0 h-4 w-4`}></i>
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 pt-8 border-t border-border px-2">
            <div className="space-y-1">
              <a
                href="#"
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                data-testid="link-help-support"
              >
                <i className="fas fa-question-circle mr-3 flex-shrink-0 h-4 w-4"></i>
                Help & Support
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

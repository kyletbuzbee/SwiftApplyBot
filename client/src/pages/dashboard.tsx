import { useQuery } from "@tanstack/react-query";
import StatsOverview from "@/components/dashboard/stats-overview";
import RecentApplications from "@/components/dashboard/recent-applications";
import JobRecommendations from "@/components/dashboard/job-recommendations";
import ActivityChart from "@/components/dashboard/activity-chart";
import PlatformStatus from "@/components/dashboard/platform-status";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your job search.</p>
      </div>
      
      <StatsOverview />
      
      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="bg-primary text-primary-foreground p-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            data-testid="button-start-auto-apply"
          >
            <i className="fas fa-rocket h-5 w-5"></i>
            <span className="font-medium">Start Auto-Apply</span>
          </button>
          <button 
            className="bg-card border border-border text-foreground p-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center space-x-2"
            data-testid="button-update-profile"
          >
            <i className="fas fa-user-edit h-5 w-5"></i>
            <span className="font-medium">Update Profile</span>
          </button>
          <button 
            className="bg-card border border-border text-foreground p-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center space-x-2"
            data-testid="button-view-analytics"
          >
            <i className="fas fa-chart-line h-5 w-5"></i>
            <span className="font-medium">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Applications & Job Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentApplications />
        <JobRecommendations />
      </div>

      <ActivityChart />
      <PlatformStatus />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { type DashboardStats } from "@shared/schema";

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      change: `+${stats?.weeklyApplications || 0}`,
      changeLabel: "this week",
      icon: "fas fa-paper-plane",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      testId: "stat-total-applications",
    },
    {
      title: "Interviews",
      value: stats?.interviews || 0,
      change: `+${stats?.weeklyInterviews || 0}`,
      changeLabel: "this week",
      icon: "fas fa-check-circle",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      testId: "stat-interviews",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      change: `${stats?.responseRate || 0}%`,
      changeLabel: "response rate",
      icon: "fas fa-clock",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      testId: "stat-pending",
    },
    {
      title: "Job Matches",
      value: stats?.matches || 0,
      change: `+${stats?.newMatchesToday || 0}`,
      changeLabel: "new today",
      icon: "fas fa-briefcase",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      testId: "stat-matches",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <i className={`${stat.icon} ${stat.iconColor} h-5 w-5`}></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground" data-testid={stat.testId}>
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stat.change}</span>
              <span className="text-muted-foreground ml-1">{stat.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

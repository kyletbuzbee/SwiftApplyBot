import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type DashboardStats, type ApplicationWithJob } from "@shared/schema";

export default function Analytics() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: applications = [] } = useQuery<ApplicationWithJob[]>({
    queryKey: ["/api/applications"],
  });

  const { data: analyticsData = [] } = useQuery<{ date: string; count: number }[]>({
    queryKey: ["/api/analytics/applications", { days: 30 }],
  });

  // Calculate response rates by platform
  const platformStats = applications.reduce((acc, app) => {
    const platform = app.job.platform?.name || "Unknown";
    if (!acc[platform]) {
      acc[platform] = { total: 0, responses: 0, interviews: 0 };
    }
    acc[platform].total += 1;
    if (app.responseAt) acc[platform].responses += 1;
    if (app.status === 'interview') acc[platform].interviews += 1;
    return acc;
  }, {} as Record<string, { total: number; responses: number; interviews: number }>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">Detailed insights into your job application performance.</p>
      </div>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-paper-plane text-blue-600 h-5 w-5"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-applications">
                  {stats?.totalApplications || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats?.weeklyApplications || 0}</span>
              <span className="text-muted-foreground ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-percentage text-green-600 h-5 w-5"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-response-rate">
                  {stats?.responseRate || 0}%
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Industry avg: 23%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-handshake text-purple-600 h-5 w-5"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Interview Rate</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-interview-rate">
                  {stats?.totalApplications ? Math.round((stats.interviews / stats.totalApplications) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Industry avg: 15%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="fas fa-clock text-orange-600 h-5 w-5"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-response-time">5.2 days</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Industry avg: 7 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Application Trends (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.map((data, index) => {
              const maxCount = Math.max(...analyticsData.map(d => d.count), 1);
              const height = (data.count / maxCount) * 100;
              return (
                <div key={data.date} className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-6 bg-primary rounded-t" 
                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0px' }}
                    data-testid={`bar-chart-${index}`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(platformStats).map(([platform, stats]) => (
              <div key={platform} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-briefcase text-primary"></i>
                  </div>
                  <div>
                    <p className="font-medium text-foreground" data-testid={`text-platform-${platform.toLowerCase()}`}>
                      {platform}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stats.total} applications
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {stats.total > 0 ? Math.round((stats.responses / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Interview</p>
                  </div>
                  <Badge 
                    variant={stats.total > 10 ? "default" : "secondary"}
                    data-testid={`badge-platform-status-${platform.toLowerCase()}`}
                  >
                    {stats.total > 10 ? "Active" : "Low Volume"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { status: "pending", label: "Pending", color: "bg-yellow-500" },
              { status: "under_review", label: "Under Review", color: "bg-blue-500" },
              { status: "interview", label: "Interview", color: "bg-green-500" },
              { status: "rejected", label: "Rejected", color: "bg-red-500" },
              { status: "offered", label: "Offered", color: "bg-purple-500" },
            ].map(({ status, label, color }) => {
              const count = applications.filter(app => app.status === status).length;
              const percentage = applications.length > 0 ? Math.round((count / applications.length) * 100) : 0;
              
              return (
                <div key={status} className="text-center p-4 border border-border rounded-lg">
                  <div className={`w-8 h-8 ${color} rounded-full mx-auto mb-2`}></div>
                  <p className="text-2xl font-bold text-foreground" data-testid={`text-status-${status}`}>
                    {count}
                  </p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityChart() {
  const { data: analyticsData = [], isLoading } = useQuery<{ date: string; count: number }[]>({
    queryKey: ["/api/analytics/applications", { days: 7 }],
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Application Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...analyticsData.map(d => d.count), 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Your application trends over the last 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.slice(-7).map((data, index) => {
            const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
            const dayName = days[index] || `Day ${index + 1}`;
            
            return (
              <div key={data.date} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-8 rounded-t ${data.count > 0 ? 'bg-primary' : 'bg-muted'}`}
                  style={{ height: `${Math.max(height, 4)}px` }}
                  data-testid={`chart-bar-${index}`}
                />
                <span className="text-xs text-muted-foreground" data-testid={`chart-day-${index}`}>
                  {dayName}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-muted-foreground">Applications Sent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Responses Received</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

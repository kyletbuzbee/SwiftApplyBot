import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type JobPlatform } from "@shared/schema";

export default function PlatformStatus() {
  const { data: platforms = [], isLoading } = useQuery<JobPlatform[]>({
    queryKey: ["/api/platforms"],
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Platform Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPlatformIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin':
        return 'fab fa-linkedin-in';
      case 'indeed':
        return 'fas fa-briefcase';
      case 'glassdoor':
        return 'fas fa-door-open';
      default:
        return 'fas fa-globe';
    }
  };

  const getPlatformColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-600';
      case 'indeed':
        return 'bg-blue-800';
      case 'glassdoor':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'limited':
        return 'bg-orange-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Connected';
      case 'limited':
        return 'Rate Limited';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Integrations</CardTitle>
        <p className="text-sm text-muted-foreground">Manage your connected job platforms</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getPlatformColor(platform.name)} rounded-lg flex items-center justify-center`}>
                  <i className={`${getPlatformIcon(platform.name)} text-white text-lg`}></i>
                </div>
                <div>
                  <p className="font-medium text-foreground" data-testid={`text-platform-${platform.name.toLowerCase()}`}>
                    {platform.name}
                  </p>
                  <p className={`text-sm ${platform.rateLimitStatus === 'limited' ? 'text-orange-600' : 'text-muted-foreground'}`}>
                    {getStatusText(platform.rateLimitStatus || 'normal')}
                  </p>
                </div>
              </div>
              <div className={`w-3 h-3 ${getStatusColor(platform.rateLimitStatus || 'normal')} rounded-full`}></div>
            </div>
          ))}
        </div>
        
        {platforms.some(p => p.rateLimitStatus === 'limited') && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-foreground">Rate Limiting Active</p>
                <p className="text-sm text-muted-foreground">
                  To avoid being blocked, we're applying a 30-second delay between applications on rate-limited platforms. 
                  This may slow down your auto-apply process but ensures continued access.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

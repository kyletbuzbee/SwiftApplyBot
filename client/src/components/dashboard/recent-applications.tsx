import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ApplicationWithJob } from "@shared/schema";
import { getStatusColor } from "@/lib/constants";

export default function RecentApplications() {
  const { data: applications = [], isLoading } = useQuery<ApplicationWithJob[]>({
    queryKey: ["/api/applications/recent"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="h-4 bg-background rounded w-3/4"></div>
                <div className="h-3 bg-background rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Link href="/applications">
            <a className="text-sm text-primary hover:underline" data-testid="link-view-all-applications">
              View all
            </a>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <i className="fas fa-inbox text-2xl mb-2"></i>
            <p>No applications yet</p>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-building text-primary text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-foreground" data-testid={`text-job-title-${application.id}`}>
                    {application.job.title}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-company-${application.id}`}>
                    {application.job.company}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(application.status)} data-testid={`badge-status-${application.id}`}>
                  {application.status.replace("_", " ")}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1" data-testid={`text-applied-date-${application.id}`}>
                  {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type JobWithPlatform } from "@shared/schema";

export default function JobRecommendations() {
  const { toast } = useToast();
  
  const { data: jobs = [], isLoading } = useQuery<JobWithPlatform[]>({
    queryKey: ["/api/jobs/recommendations"],
  });

  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return apiRequest("POST", `/api/jobs/${jobId}/apply`, {
        coverLetter: "Auto-generated cover letter based on profile",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Application submitted!",
        description: "Your application has been successfully submitted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
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
          <CardTitle>Job Recommendations</CardTitle>
          <a href="/job-search" className="text-sm text-primary hover:underline" data-testid="link-browse-all-jobs">
            Browse all
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <i className="fas fa-search text-2xl mb-2"></i>
            <p>No job recommendations available</p>
          </div>
        ) : (
          jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground" data-testid={`text-rec-job-title-${job.id}`}>
                    {job.title}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-rec-company-${job.id}`}>
                    {job.company}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1" data-testid={`text-rec-location-${job.id}`}>
                    {job.location}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={
                        (job.matchPercentage || 0) >= 95 
                          ? "bg-blue-100 text-blue-800" 
                          : (job.matchPercentage || 0) >= 90 
                          ? "bg-green-100 text-green-800" 
                          : "bg-purple-100 text-purple-800"
                      }
                      data-testid={`badge-match-${job.id}`}
                    >
                      {job.matchPercentage}% match
                    </Badge>
                    <span className="text-xs text-muted-foreground" data-testid={`text-salary-${job.id}`}>
                      {job.salary}
                    </span>
                  </div>
                </div>
                <Button
                  className="ml-4 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                  size="sm"
                  onClick={() => applyMutation.mutate(job.id)}
                  disabled={applyMutation.isPending}
                  data-testid={`button-apply-${job.id}`}
                >
                  {applyMutation.isPending ? "Applying..." : "Apply"}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

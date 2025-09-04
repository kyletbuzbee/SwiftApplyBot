import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type JobWithPlatform } from "@shared/schema";

interface JobCardProps {
  job: JobWithPlatform;
}

export default function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const applyMutation = useMutation({
    mutationFn: async () => {
      setIsApplying(true);
      return apiRequest("POST", `/api/jobs/${job.id}/apply`, {
        coverLetter: "Auto-generated cover letter based on profile",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Application submitted!",
        description: `Successfully applied to ${job.title} at ${job.company}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsApplying(false);
    },
  });

  const getMatchColor = (percentage: number) => {
    if (percentage >= 95) return "bg-blue-100 text-blue-800";
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 80) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platformName?: string) => {
    switch (platformName?.toLowerCase()) {
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

  const getPlatformColor = (platformName?: string) => {
    switch (platformName?.toLowerCase()) {
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

  const timeAgo = (date: Date | null) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 ${getPlatformColor(job.platform?.name)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <i className={`${getPlatformIcon(job.platform?.name)} text-white text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-job-title-${job.id}`}>
                  {job.title}
                </h3>
                <p className="text-muted-foreground font-medium mb-1" data-testid={`text-company-${job.id}`}>
                  {job.company}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center" data-testid={`text-location-${job.id}`}>
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center" data-testid={`text-salary-${job.id}`}>
                      <i className="fas fa-dollar-sign mr-1"></i>
                      {job.salary}
                    </span>
                  )}
                  <span className="flex items-center" data-testid={`text-posted-${job.id}`}>
                    <i className="fas fa-clock mr-1"></i>
                    {timeAgo(job.postedAt)}
                  </span>
                </div>
                
                {job.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-description-${job.id}`}>
                    {job.description}
                  </p>
                )}

                <div className="flex items-center space-x-2 mb-3">
                  {job.matchPercentage && (
                    <Badge 
                      className={getMatchColor(job.matchPercentage)}
                      data-testid={`badge-match-${job.id}`}
                    >
                      {job.matchPercentage}% match
                    </Badge>
                  )}
                  {job.jobType && (
                    <Badge variant="outline" data-testid={`badge-job-type-${job.id}`}>
                      {job.jobType}
                    </Badge>
                  )}
                  {job.experienceLevel && (
                    <Badge variant="outline" data-testid={`badge-experience-${job.id}`}>
                      {job.experienceLevel}
                    </Badge>
                  )}
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.requirements.slice(0, 4).map((requirement, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded"
                        data-testid={`text-requirement-${job.id}-${index}`}
                      >
                        {requirement}
                      </span>
                    ))}
                    {job.requirements.length > 4 && (
                      <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                        +{job.requirements.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button
              onClick={() => applyMutation.mutate()}
              disabled={isApplying || applyMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`button-apply-${job.id}`}
            >
              {isApplying || applyMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2 h-4 w-4"></i>
                  Applying...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2 h-4 w-4"></i>
                  Quick Apply
                </>
              )}
            </Button>
            
            {job.externalUrl && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => job.externalUrl && window.open(job.externalUrl, '_blank')}
                data-testid={`button-view-external-${job.id}`}
              >
                <i className="fas fa-external-link-alt mr-2 h-3 w-3"></i>
                View Job
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

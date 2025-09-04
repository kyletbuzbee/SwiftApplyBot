import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type ApplicationWithJob } from "@shared/schema";
import { getStatusColor, getStatusIcon } from "@/lib/constants";

interface ApplicationCardProps {
  application: ApplicationWithJob;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || "");

  const updateMutation = useMutation({
    mutationFn: async (updates: { status?: string; notes?: string }) => {
      return apiRequest("PATCH", `/api/applications/${application.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsEditing(false);
      toast({
        title: "Application updated",
        description: "Application status and notes have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      status: newStatus,
      notes: notes,
    });
  };

  const handleCancel = () => {
    setNewStatus(application.status);
    setNotes(application.notes || "");
    setIsEditing(false);
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

  const timeAgo = (date: Date | string) => {
    const now = new Date();
    const target = new Date(date);
    const diffInMs = now.getTime() - target.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Company Logo/Icon */}
          <div className={`w-12 h-12 ${getPlatformColor(application.job.platform?.name)} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <i className={`${getPlatformIcon(application.job.platform?.name)} text-white text-lg`}></i>
          </div>

          {/* Application Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground" data-testid={`text-app-job-title-${application.id}`}>
                  {application.job.title}
                </h3>
                <p className="text-muted-foreground font-medium" data-testid={`text-app-company-${application.id}`}>
                  {application.job.company}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span data-testid={`text-app-location-${application.id}`}>
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {application.job.location}
                  </span>
                  {application.job.salary && (
                    <span data-testid={`text-app-salary-${application.id}`}>
                      <i className="fas fa-dollar-sign mr-1"></i>
                      {application.job.salary}
                    </span>
                  )}
                  <span data-testid={`text-app-platform-${application.id}`}>
                    <i className="fas fa-building mr-1"></i>
                    {application.job.platform?.name}
                  </span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-32" data-testid={`select-status-${application.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(application.status)} data-testid={`badge-app-status-${application.id}`}>
                    <i className={`${getStatusIcon(application.status)} mr-1`}></i>
                    {application.status.replace("_", " ")}
                  </Badge>
                )}
                
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    data-testid={`button-edit-${application.id}`}
                  >
                    <i className="fas fa-edit h-4 w-4"></i>
                  </Button>
                )}
              </div>
            </div>

            {/* Application Metadata */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <span data-testid={`text-app-applied-date-${application.id}`}>
                <i className="fas fa-paper-plane mr-1"></i>
                Applied {application.appliedAt ? timeAgo(application.appliedAt) : 'Unknown'}
              </span>
              {application.responseAt && (
                <span data-testid={`text-app-response-date-${application.id}`}>
                  <i className="fas fa-reply mr-1"></i>
                  Response {timeAgo(application.responseAt)}
                </span>
              )}
              {application.isAutoApplied && (
                <Badge variant="outline" className="text-xs" data-testid={`badge-auto-applied-${application.id}`}>
                  <i className="fas fa-robot mr-1"></i>
                  Auto-applied
                </Badge>
              )}
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Notes:</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    className="min-h-[80px]"
                    data-testid={`textarea-notes-${application.id}`}
                  />
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      data-testid={`button-save-${application.id}`}
                    >
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                      data-testid={`button-cancel-${application.id}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground" data-testid={`text-app-notes-${application.id}`}>
                  {application.notes || "No notes added"}
                </p>
              )}
            </div>

            {/* External Link */}
            {application.job.externalUrl && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => application.job.externalUrl && window.open(application.job.externalUrl, '_blank')}
                  data-testid={`button-view-job-${application.id}`}
                >
                  <i className="fas fa-external-link-alt mr-2 h-3 w-3"></i>
                  View Original Job
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type User } from "@shared/schema";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    targetSalary: user?.targetSalary || "",
    experience: user?.experience || "",
    skills: user?.skills?.join(", ") || "",
    linkedinProfile: user?.linkedinProfile || "",
    githubProfile: user?.githubProfile || "",
    portfolioUrl: user?.portfolioUrl || "",
    resume: user?.resume || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      return apiRequest("PATCH", "/api/profile", {
        ...data,
        skills: typeof data.skills === 'string' 
          ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : data.skills,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      ...formData,
      skills: formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      targetSalary: formData.targetSalary ? parseInt(formData.targetSalary as string) : null,
    });
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        targetSalary: user.targetSalary || "",
        experience: user.experience || "",
        skills: user.skills?.join(", ") || "",
        linkedinProfile: user.linkedinProfile || "",
        githubProfile: user.githubProfile || "",
        portfolioUrl: user.portfolioUrl || "",
        resume: user.resume || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6 space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profile</h2>
          <p className="text-muted-foreground">Manage your profile information and preferences.</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-profile"
            >
              <i className="fas fa-edit mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                data-testid="input-email"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., San Francisco, CA"
                data-testid="input-location"
              />
            </div>
            <div>
              <Label htmlFor="targetSalary">Target Salary</Label>
              <Input
                id="targetSalary"
                type="number"
                value={formData.targetSalary}
                onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., 150000"
                data-testid="input-target-salary"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., 5+ years"
              data-testid="input-experience"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., React, TypeScript, Node.js, GraphQL"
              data-testid="textarea-skills"
            />
          </div>
          {formData.skills && (
            <div className="flex flex-wrap gap-2">
              {formData.skills.split(",").map((skill, index) => (
                <Badge key={index} variant="secondary" data-testid={`badge-skill-${index}`}>
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Social Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
            <Input
              id="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/yourprofile"
              data-testid="input-linkedin"
            />
          </div>
          <div>
            <Label htmlFor="githubProfile">GitHub Profile</Label>
            <Input
              id="githubProfile"
              value={formData.githubProfile}
              onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
              disabled={!isEditing}
              placeholder="https://github.com/yourusername"
              data-testid="input-github"
            />
          </div>
          <div>
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input
              id="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              disabled={!isEditing}
              placeholder="https://yourportfolio.com"
              data-testid="input-portfolio"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resume */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="resume">Resume/Bio</Label>
          <Textarea
            id="resume"
            value={formData.resume}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
            disabled={!isEditing}
            placeholder="Brief summary of your experience and qualifications..."
            className="min-h-32"
            data-testid="textarea-resume"
          />
        </CardContent>
      </Card>
    </div>
  );
}

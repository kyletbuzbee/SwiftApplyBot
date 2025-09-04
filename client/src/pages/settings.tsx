import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoApply: true,
    emailNotifications: true,
    applicationReminders: true,
    weeklyReports: true,
    maxApplicationsPerDay: 10,
    minSalary: 80000,
    preferredLocations: "San Francisco, CA",
    autoApplyDelay: 30,
    rateLimitRespect: true,
  });

  const handleSave = () => {
    // In real app, this would call an API
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    setSettings({
      autoApply: true,
      emailNotifications: true,
      applicationReminders: true,
      weeklyReports: true,
      maxApplicationsPerDay: 10,
      minSalary: 80000,
      preferredLocations: "San Francisco, CA",
      autoApplyDelay: 30,
      rateLimitRespect: true,
    });
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Configure your JobFlow preferences and automation settings.</p>
      </div>

      {/* Auto-Apply Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Apply Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto-Apply</Label>
              <p className="text-sm text-muted-foreground">
                Automatically apply to jobs that match your criteria
              </p>
            </div>
            <Switch
              checked={settings.autoApply}
              onCheckedChange={(checked) => setSettings({ ...settings, autoApply: checked })}
              data-testid="switch-auto-apply"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxApplications">Max Applications Per Day</Label>
              <Input
                id="maxApplications"
                type="number"
                value={settings.maxApplicationsPerDay}
                onChange={(e) => setSettings({ ...settings, maxApplicationsPerDay: parseInt(e.target.value) })}
                data-testid="input-max-applications"
              />
            </div>
            <div>
              <Label htmlFor="minSalary">Minimum Salary ($)</Label>
              <Input
                id="minSalary"
                type="number"
                value={settings.minSalary}
                onChange={(e) => setSettings({ ...settings, minSalary: parseInt(e.target.value) })}
                data-testid="input-min-salary"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preferredLocations">Preferred Locations</Label>
            <Input
              id="preferredLocations"
              value={settings.preferredLocations}
              onChange={(e) => setSettings({ ...settings, preferredLocations: e.target.value })}
              placeholder="San Francisco, CA; New York, NY; Remote"
              data-testid="input-preferred-locations"
            />
          </div>

          <div>
            <Label htmlFor="autoApplyDelay">Delay Between Applications (seconds)</Label>
            <Select 
              value={settings.autoApplyDelay.toString()} 
              onValueChange={(value) => setSettings({ ...settings, autoApplyDelay: parseInt(value) })}
            >
              <SelectTrigger data-testid="select-auto-apply-delay">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Respect Rate Limits</Label>
              <p className="text-sm text-muted-foreground">
                Automatically slow down when platforms enforce rate limits
              </p>
            </div>
            <Switch
              checked={settings.rateLimitRespect}
              onCheckedChange={(checked) => setSettings({ ...settings, rateLimitRespect: checked })}
              data-testid="switch-rate-limit-respect"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about application status changes
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              data-testid="switch-email-notifications"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Application Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders to follow up on pending applications
              </p>
            </div>
            <Switch
              checked={settings.applicationReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, applicationReminders: checked })}
              data-testid="switch-application-reminders"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summary of your job search activity
              </p>
            </div>
            <Switch
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
              data-testid="switch-weekly-reports"
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage your connections to job platforms. You can connect/disconnect platforms and update credentials.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fab fa-linkedin-in text-white"></i>
                </div>
                <div>
                  <p className="font-medium text-foreground">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-linkedin-settings">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                  <i className="fas fa-briefcase text-white"></i>
                </div>
                <div>
                  <p className="font-medium text-foreground">Indeed</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-indeed-settings">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-door-open text-white"></i>
                </div>
                <div>
                  <p className="font-medium text-foreground">Glassdoor</p>
                  <p className="text-sm text-orange-600">Rate Limited</p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-glassdoor-settings">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset} data-testid="button-reset-settings">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} data-testid="button-save-settings">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobCard from "@/components/jobs/job-card";
import { type JobWithPlatform } from "@shared/schema";

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const { data: jobs = [], isLoading, refetch } = useQuery<JobWithPlatform[]>({
    queryKey: ["/api/jobs", { location, jobType }],
  });

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Job Search</h2>
        <p className="text-muted-foreground">Find and apply to jobs that match your skills and preferences.</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-job-search"
            />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              data-testid="input-location"
            />
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger data-testid="select-job-type">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} data-testid="button-search">
              <i className="fas fa-search mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Apply Banner */}
      <Card className="border-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Auto-Apply Mode</h3>
              <p className="text-muted-foreground">Enable automatic applications to jobs that match your criteria (80%+ match)</p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-enable-auto-apply"
            >
              <i className="fas fa-magic mr-2 h-4 w-4" />
              Enable Auto-Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Job Results ({jobs.length} found)
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-32" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date Posted</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="match">Match %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { 
  type User, 
  type InsertUser,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
  type JobPlatform,
  type InsertJobPlatform,
  type UserProfile,
  type InsertUserProfile,
  type ApplicationTracking,
  type InsertApplicationTracking,
  type JobWithPlatform,
  type ApplicationWithJob,
  type DashboardStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Job management
  getJobs(filters?: { platform?: string; location?: string; jobType?: string }): Promise<JobWithPlatform[]>;
  getJob(id: string): Promise<JobWithPlatform | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;

  // Application management
  getApplications(userId: string): Promise<ApplicationWithJob[]>;
  getApplication(id: string): Promise<ApplicationWithJob | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<boolean>;

  // Job Platform management
  getJobPlatforms(): Promise<JobPlatform[]>;
  getJobPlatform(id: string): Promise<JobPlatform | undefined>;
  createJobPlatform(platform: InsertJobPlatform): Promise<JobPlatform>;
  updateJobPlatform(id: string, updates: Partial<InsertJobPlatform>): Promise<JobPlatform | undefined>;

  // User Profile management
  getUserProfiles(userId: string): Promise<UserProfile[]>;
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  deleteUserProfile(id: string): Promise<boolean>;

  // Application Tracking
  getApplicationTracking(applicationId: string): Promise<ApplicationTracking[]>;
  createApplicationTracking(tracking: InsertApplicationTracking): Promise<ApplicationTracking>;

  // Analytics
  getDashboardStats(userId: string): Promise<DashboardStats>;
  getApplicationsByDate(userId: string, days: number): Promise<{ date: string; count: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;
  private applications: Map<string, Application>;
  private jobPlatforms: Map<string, JobPlatform>;
  private userProfiles: Map<string, UserProfile>;
  private applicationTracking: Map<string, ApplicationTracking>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.jobPlatforms = new Map();
    this.userProfiles = new Map();
    this.applicationTracking = new Map();
    
    // Initialize with default platforms
    this.initializeDefaultPlatforms();
    this.initializeSampleData();
  }

  private initializeDefaultPlatforms() {
    const platforms = [
      { name: "LinkedIn", isConnected: true, rateLimitStatus: "normal" },
      { name: "Indeed", isConnected: true, rateLimitStatus: "normal" },
      { name: "Glassdoor", isConnected: true, rateLimitStatus: "limited" },
    ];

    platforms.forEach(platform => {
      const id = randomUUID();
      const newPlatform: JobPlatform = {
        id,
        ...platform,
        credentials: {},
        lastSyncAt: new Date(),
        createdAt: new Date(),
      };
      this.jobPlatforms.set(id, newPlatform);
    });
  }

  private initializeSampleData() {
    // Create a sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      email: "sarah.j@email.com",
      name: "Sarah Johnson",
      password: "hashed_password",
      resume: "Senior Frontend Developer with 5+ years experience...",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      experience: "5+ years",
      location: "San Francisco, CA",
      targetSalary: 150000,
      preferredJobTypes: ["full-time", "remote"],
      linkedinProfile: "https://linkedin.com/in/sarahjohnson",
      githubProfile: "https://github.com/sarahjohnson",
      portfolioUrl: "https://sarahjohnson.dev",
      createdAt: new Date(),
    };
    this.users.set(userId, user);

    // Create sample jobs
    const platforms = Array.from(this.jobPlatforms.values());
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        company: "Microsoft",
        location: "Seattle, WA",
        salary: "$140k-180k",
        description: "Join our team building the next generation of developer tools...",
        requirements: ["React", "TypeScript", "5+ years experience"],
        benefits: ["Health insurance", "401k", "Remote work"],
        jobType: "full-time",
        experienceLevel: "senior",
        platformId: platforms[0].id,
        externalUrl: "https://careers.microsoft.com/job123",
        matchPercentage: 95,
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "React Developer",
        company: "Stripe",
        location: "San Francisco, CA",
        salary: "$140k-180k",
        description: "Help us build the future of online payments...",
        requirements: ["React", "JavaScript", "Payment systems"],
        benefits: ["Equity", "Health insurance", "Flexible hours"],
        jobType: "full-time",
        experienceLevel: "mid",
        platformId: platforms[1].id,
        externalUrl: "https://stripe.com/jobs/react-dev",
        matchPercentage: 95,
        postedAt: new Date(),
      },
      {
        title: "Frontend Engineer",
        company: "Shopify",
        location: "Remote",
        salary: "$120k-160k",
        description: "Build beautiful e-commerce experiences...",
        requirements: ["React", "TypeScript", "E-commerce"],
        benefits: ["Remote work", "Health insurance", "Learning budget"],
        jobType: "full-time",
        experienceLevel: "mid",
        platformId: platforms[1].id,
        externalUrl: "https://shopify.com/careers/frontend",
        matchPercentage: 92,
        postedAt: new Date(),
      },
      {
        title: "iOS Developer",
        company: "Apple",
        location: "Cupertino, CA",
        salary: "$160k-200k",
        description: "Work on iOS applications used by millions...",
        requirements: ["Swift", "iOS", "UIKit"],
        benefits: ["Stock options", "Health insurance", "On-site gym"],
        jobType: "full-time",
        experienceLevel: "senior",
        platformId: platforms[0].id,
        externalUrl: "https://jobs.apple.com/ios-dev",
        matchPercentage: 85,
        postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        title: "Full Stack Engineer",
        company: "Meta",
        location: "Menlo Park, CA",
        salary: "$150k-190k",
        description: "Build products that connect billions of people...",
        requirements: ["React", "Node.js", "GraphQL"],
        benefits: ["Stock options", "Health insurance", "Free meals"],
        jobType: "full-time",
        experienceLevel: "senior",
        platformId: platforms[2].id,
        externalUrl: "https://meta.com/careers/fullstack",
        matchPercentage: 88,
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Software Engineer",
        company: "Airbnb",
        location: "Austin, TX",
        salary: "$130k-170k",
        description: "Help people belong anywhere...",
        requirements: ["JavaScript", "React", "Python"],
        benefits: ["Travel stipend", "Health insurance", "Flexible PTO"],
        jobType: "full-time",
        experienceLevel: "mid",
        platformId: platforms[1].id,
        externalUrl: "https://airbnb.com/careers/software-eng",
        matchPercentage: 89,
        postedAt: new Date(),
      },
    ];

    sampleJobs.forEach(jobData => {
      const jobId = randomUUID();
      const job: Job = {
        id: jobId,
        ...jobData,
        createdAt: new Date(),
      };
      this.jobs.set(jobId, job);
    });

    // Create sample applications
    const jobs = Array.from(this.jobs.values());
    const sampleApplications = [
      {
        userId,
        jobId: jobs[0].id, // Microsoft
        status: "interview",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        responseAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        notes: "Great interview, waiting for next round",
        coverLetter: "I am excited to apply for the Senior Frontend Developer position...",
        isAutoApplied: true,
        applicationData: { source: "auto-apply" },
      },
      {
        userId,
        jobId: jobs[3].id, // Apple
        status: "under_review",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        responseAt: null,
        notes: "Applied through auto-apply system",
        coverLetter: "I would love to contribute to iOS development at Apple...",
        isAutoApplied: true,
        applicationData: { source: "auto-apply" },
      },
      {
        userId,
        jobId: jobs[4].id, // Meta
        status: "rejected",
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        responseAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes: "Not a good fit for current team needs",
        coverLetter: "I am interested in the Full Stack Engineer position...",
        isAutoApplied: false,
        applicationData: { source: "manual" },
      },
    ];

    sampleApplications.forEach(appData => {
      const appId = randomUUID();
      const application: Application = {
        id: appId,
        ...appData,
        createdAt: new Date(),
      };
      this.applications.set(appId, application);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      skills: insertUser.skills || [],
      location: insertUser.location || null,
      resume: insertUser.resume || null,
      experience: insertUser.experience || null,
      targetSalary: insertUser.targetSalary || null,
      preferredJobTypes: insertUser.preferredJobTypes || [],
      linkedinProfile: insertUser.linkedinProfile || null,
      githubProfile: insertUser.githubProfile || null,
      portfolioUrl: insertUser.portfolioUrl || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getJobs(filters?: { platform?: string; location?: string; jobType?: string }): Promise<JobWithPlatform[]> {
    let jobs = Array.from(this.jobs.values());
    
    if (filters) {
      if (filters.platform) {
        jobs = jobs.filter(job => job.platformId === filters.platform);
      }
      if (filters.location) {
        jobs = jobs.filter(job => job.location?.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.jobType) {
        jobs = jobs.filter(job => job.jobType === filters.jobType);
      }
    }

    return jobs.map(job => ({
      ...job,
      platform: this.jobPlatforms.get(job.platformId || ''),
    }));
  }

  async getJob(id: string): Promise<JobWithPlatform | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    return {
      ...job,
      platform: this.jobPlatforms.get(job.platformId || ''),
    };
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = { 
      ...insertJob, 
      id, 
      createdAt: new Date(),
      description: insertJob.description || null,
      location: insertJob.location || null,
      salary: insertJob.salary || null,
      requirements: insertJob.requirements || [],
      benefits: insertJob.benefits || [],
      jobType: insertJob.jobType || null,
      experienceLevel: insertJob.experienceLevel || null,
      platformId: insertJob.platformId || null,
      externalUrl: insertJob.externalUrl || null,
      matchPercentage: insertJob.matchPercentage || null,
      postedAt: insertJob.postedAt || null
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async getApplications(userId: string): Promise<ApplicationWithJob[]> {
    const applications = Array.from(this.applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => (b.appliedAt?.getTime() || 0) - (a.appliedAt?.getTime() || 0));

    return applications.map(app => {
      const job = this.jobs.get(app.jobId);
      const platform = job?.platformId ? this.jobPlatforms.get(job.platformId) : undefined;
      
      return {
        ...app,
        job: {
          ...job!,
          platform,
        },
      };
    });
  }

  async getApplication(id: string): Promise<ApplicationWithJob | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const job = this.jobs.get(application.jobId);
    if (!job) return undefined;
    
    const platform = job.platformId ? this.jobPlatforms.get(job.platformId) : undefined;
    
    return {
      ...application,
      job: {
        ...job,
        platform,
      },
    };
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = { 
      ...insertApplication, 
      id, 
      createdAt: new Date(),
      appliedAt: insertApplication.appliedAt || new Date(),
      responseAt: insertApplication.responseAt || null,
      notes: insertApplication.notes || null,
      coverLetter: insertApplication.coverLetter || null,
      isAutoApplied: insertApplication.isAutoApplied || false,
      applicationData: insertApplication.applicationData || null
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...updates };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.applications.delete(id);
  }

  async getJobPlatforms(): Promise<JobPlatform[]> {
    return Array.from(this.jobPlatforms.values());
  }

  async getJobPlatform(id: string): Promise<JobPlatform | undefined> {
    return this.jobPlatforms.get(id);
  }

  async createJobPlatform(insertPlatform: InsertJobPlatform): Promise<JobPlatform> {
    const id = randomUUID();
    const platform: JobPlatform = { 
      ...insertPlatform, 
      id, 
      createdAt: new Date(),
      isConnected: insertPlatform.isConnected || false,
      credentials: insertPlatform.credentials || null,
      rateLimitStatus: insertPlatform.rateLimitStatus || 'normal',
      lastSyncAt: insertPlatform.lastSyncAt || null
    };
    this.jobPlatforms.set(id, platform);
    return platform;
  }

  async updateJobPlatform(id: string, updates: Partial<InsertJobPlatform>): Promise<JobPlatform | undefined> {
    const platform = this.jobPlatforms.get(id);
    if (!platform) return undefined;
    
    const updatedPlatform = { ...platform, ...updates };
    this.jobPlatforms.set(id, updatedPlatform);
    return updatedPlatform;
  }

  async getUserProfiles(userId: string): Promise<UserProfile[]> {
    return Array.from(this.userProfiles.values()).filter(profile => profile.userId === userId);
  }

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { 
      ...insertProfile, 
      id, 
      createdAt: new Date(),
      isDefault: insertProfile.isDefault || false
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const profile = this.userProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...updates };
    this.userProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async deleteUserProfile(id: string): Promise<boolean> {
    return this.userProfiles.delete(id);
  }

  async getApplicationTracking(applicationId: string): Promise<ApplicationTracking[]> {
    return Array.from(this.applicationTracking.values())
      .filter(tracking => tracking.applicationId === applicationId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createApplicationTracking(insertTracking: InsertApplicationTracking): Promise<ApplicationTracking> {
    const id = randomUUID();
    const tracking: ApplicationTracking = { 
      ...insertTracking, 
      id,
      timestamp: insertTracking.timestamp || new Date(),
      details: insertTracking.details || null
    };
    this.applicationTracking.set(id, tracking);
    return tracking;
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const applications = Array.from(this.applications.values()).filter(app => app.userId === userId);
    const jobs = Array.from(this.jobs.values());
    
    const totalApplications = applications.length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const pending = applications.filter(app => app.status === 'pending' || app.status === 'under_review').length;
    const matches = jobs.filter(job => (job.matchPercentage || 0) > 80).length;
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyApplications = applications.filter(app => app.appliedAt && app.appliedAt >= weekAgo).length;
    const weeklyInterviews = applications.filter(app => 
      app.status === 'interview' && ((app.responseAt && app.responseAt >= weekAgo) || (app.appliedAt && app.appliedAt >= weekAgo))
    ).length;
    
    const responsesReceived = applications.filter(app => app.responseAt).length;
    const responseRate = totalApplications > 0 ? Math.round((responsesReceived / totalApplications) * 100) : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newMatchesToday = jobs.filter(job => 
      job.createdAt && job.createdAt >= today && (job.matchPercentage || 0) > 80
    ).length;

    return {
      totalApplications,
      interviews,
      pending,
      matches,
      weeklyApplications,
      weeklyInterviews,
      responseRate,
      newMatchesToday,
    };
  }

  async getApplicationsByDate(userId: string, days: number): Promise<{ date: string; count: number }[]> {
    const applications = Array.from(this.applications.values()).filter(app => app.userId === userId);
    const result: { date: string; count: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = applications.filter(app => {
        if (!app.appliedAt) return false;
        const appDate = app.appliedAt.toISOString().split('T')[0];
        return appDate === dateStr;
      }).length;
      
      result.push({ date: dateStr, count });
    }
    
    return result;
  }
}

export const storage = new MemStorage();

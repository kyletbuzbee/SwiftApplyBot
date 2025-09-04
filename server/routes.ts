import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertJobSchema, insertUserProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // For demo purposes, using first user. In real app, get from auth session
      const users = await storage.getUser("first-user-id");
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const stats = await storage.getDashboardStats((userList[0] as any).id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get recent applications
  app.get("/api/applications/recent", async (req, res) => {
    try {
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const applications = await storage.getApplications((userList[0] as any).id);
      res.json(applications.slice(0, 5)); // Return only recent 5
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent applications" });
    }
  });

  // Get all applications
  app.get("/api/applications", async (req, res) => {
    try {
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const applications = await storage.getApplications((userList[0] as any).id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Create application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  // Update application status
  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const application = await storage.updateApplication(id, updates);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Get jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const { platform, location, jobType } = req.query;
      const filters = {
        platform: platform as string,
        location: location as string,
        jobType: jobType as string,
      };
      
      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get job recommendations (high match percentage)
  app.get("/api/jobs/recommendations", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      const recommendations = jobs
        .filter(job => (job.matchPercentage || 0) > 80)
        .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
        .slice(0, 10);
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job recommendations" });
    }
  });

  // Auto-apply to job
  app.post("/api/jobs/:jobId/apply", async (req, res) => {
    try {
      const { jobId } = req.params;
      const { coverLetter, profileId } = req.body;
      
      // Get first user for demo
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userId = (userList[0] as any).id;
      
      // Check if already applied
      const existingApplications = await storage.getApplications(userId);
      const alreadyApplied = existingApplications.some(app => app.jobId === jobId);
      
      if (alreadyApplied) {
        return res.status(400).json({ message: "Already applied to this job" });
      }
      
      // Create application
      const application = await storage.createApplication({
        userId,
        jobId,
        status: "pending",
        coverLetter: coverLetter || "Auto-generated cover letter based on profile",
        isAutoApplied: true,
        applicationData: { profileId },
      });
      
      // Track the application
      await storage.createApplicationTracking({
        applicationId: application.id,
        event: "applied",
        details: "Auto-applied through JobFlow system",
      });
      
      res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.error("Auto-apply error:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get job platforms
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getJobPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  // Update platform status
  app.patch("/api/platforms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const platform = await storage.updateJobPlatform(id, updates);
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      
      res.json(platform);
    } catch (error) {
      res.status(500).json({ message: "Failed to update platform" });
    }
  });

  // Get user profile
  app.get("/api/profile", async (req, res) => {
    try {
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(userList[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update user profile
  app.patch("/api/profile", async (req, res) => {
    try {
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updates = req.body;
      const user = await storage.updateUser((userList[0] as any).id, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get application analytics
  app.get("/api/analytics/applications", async (req, res) => {
    try {
      const { days = 7 } = req.query;
      
      const userList = await Promise.all(
        Array.from((storage as any).users.values()).slice(0, 1)
      );
      
      if (userList.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const data = await storage.getApplicationsByDate((userList[0] as any).id, Number(days));
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

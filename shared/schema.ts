import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  resume: text("resume"),
  skills: jsonb("skills").$type<string[]>().default([]),
  experience: text("experience"),
  location: text("location"),
  targetSalary: integer("target_salary"),
  preferredJobTypes: jsonb("preferred_job_types").$type<string[]>().default([]),
  linkedinProfile: text("linkedin_profile"),
  githubProfile: text("github_profile"),
  portfolioUrl: text("portfolio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobPlatforms = pgTable("job_platforms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  isConnected: boolean("is_connected").default(false),
  credentials: jsonb("credentials").$type<Record<string, any>>(),
  rateLimitStatus: text("rate_limit_status").default("normal"), // normal, limited, blocked
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  salary: text("salary"),
  description: text("description"),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  jobType: text("job_type"), // full-time, part-time, contract, etc.
  experienceLevel: text("experience_level"), // junior, mid, senior
  platformId: varchar("platform_id").references(() => jobPlatforms.id),
  externalUrl: text("external_url"),
  matchPercentage: integer("match_percentage"),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  status: text("status").notNull(), // pending, under_review, interview, rejected, offered
  appliedAt: timestamp("applied_at").defaultNow(),
  responseAt: timestamp("response_at"),
  notes: text("notes"),
  coverLetter: text("cover_letter"),
  isAutoApplied: boolean("is_auto_applied").default(false),
  applicationData: jsonb("application_data").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applicationTracking = pgTable("application_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id),
  event: text("event").notNull(), // applied, viewed, responded, etc.
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  templateData: jsonb("template_data").$type<Record<string, any>>().notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertJobPlatformSchema = createInsertSchema(jobPlatforms).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationTrackingSchema = createInsertSchema(applicationTracking).omit({
  id: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type JobPlatform = typeof jobPlatforms.$inferSelect;
export type InsertJobPlatform = z.infer<typeof insertJobPlatformSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type ApplicationTracking = typeof applicationTracking.$inferSelect;
export type InsertApplicationTracking = z.infer<typeof insertApplicationTrackingSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

// Additional types for API responses
export type JobWithPlatform = Job & {
  platform?: JobPlatform;
};

export type ApplicationWithJob = Application & {
  job: JobWithPlatform;
};

export type DashboardStats = {
  totalApplications: number;
  interviews: number;
  pending: number;
  matches: number;
  weeklyApplications: number;
  weeklyInterviews: number;
  responseRate: number;
  newMatchesToday: number;
};

// Status color mappings for applications
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'under_review':
      return 'bg-blue-100 text-blue-800';
    case 'interview':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'offered':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Status icon mappings
export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'fas fa-clock';
    case 'under_review':
      return 'fas fa-eye';
    case 'interview':
      return 'fas fa-handshake';
    case 'rejected':
      return 'fas fa-times-circle';
    case 'offered':
      return 'fas fa-check-circle';
    default:
      return 'fas fa-question-circle';
  }
};

// Job platform configurations
export const platformConfigs = {
  linkedin: {
    name: 'LinkedIn',
    icon: 'fab fa-linkedin-in',
    color: 'bg-blue-600',
    url: 'https://linkedin.com',
  },
  indeed: {
    name: 'Indeed',
    icon: 'fas fa-briefcase',
    color: 'bg-blue-800',
    url: 'https://indeed.com',
  },
  glassdoor: {
    name: 'Glassdoor',
    icon: 'fas fa-door-open',
    color: 'bg-green-600',
    url: 'https://glassdoor.com',
  },
};

// Job type options
export const jobTypes = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
  { value: 'internship', label: 'Internship' },
];

// Experience level options
export const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
];

// Application status options for dropdowns
export const applicationStatuses = [
  { value: 'pending', label: 'Pending', color: 'text-orange-600' },
  { value: 'under_review', label: 'Under Review', color: 'text-blue-600' },
  { value: 'interview', label: 'Interview', color: 'text-green-600' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
  { value: 'offered', label: 'Offered', color: 'text-purple-600' },
];

// Default pagination settings
export const defaultPagination = {
  pageSize: 20,
  maxPageSize: 100,
};

// Auto-apply settings
export const autoApplyDefaults = {
  maxApplicationsPerDay: 10,
  delayBetweenApplications: 30, // seconds
  minMatchPercentage: 80,
  respectRateLimits: true,
};

// Notification types
export const notificationTypes = {
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_VIEWED: 'application_viewed',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  APPLICATION_REJECTED: 'application_rejected',
  APPLICATION_OFFERED: 'application_offered',
  RATE_LIMIT_WARNING: 'rate_limit_warning',
  DAILY_SUMMARY: 'daily_summary',
  WEEKLY_REPORT: 'weekly_report',
};

// Chart colors for analytics
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  tertiary: '#F59E0B',
  quaternary: '#EF4444',
  accent: '#8B5CF6',
};

// Time range options for analytics
export const timeRanges = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 3 months' },
  { value: '365', label: 'Last year' },
];

// Salary ranges for filtering
export const salaryRanges = [
  { value: '0-50000', label: 'Under $50k' },
  { value: '50000-75000', label: '$50k - $75k' },
  { value: '75000-100000', label: '$75k - $100k' },
  { value: '100000-150000', label: '$100k - $150k' },
  { value: '150000-200000', label: '$150k - $200k' },
  { value: '200000+', label: '$200k+' },
];

// Common skill categories
export const skillCategories = {
  frontend: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  backend: ['Node.js', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch'],
  cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
  tools: ['Git', 'Jest', 'Webpack', 'CI/CD', 'Agile', 'Scrum'],
};

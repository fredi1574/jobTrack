export type ApplicationStatus = "Applied" | "Assessment" | "Interview" | "Offer" | "Rejected";

export type Application = {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string;
  url?: string | null;
  status: ApplicationStatus;
  notes?: string | null;
  resumeUrl?: string | null;
  appliedAt?: Date | null;
  updatedAt?: Date | null;
  jobSource?: string | null;
  salary?: number | null;
  interviewDate?: Date | null;
};
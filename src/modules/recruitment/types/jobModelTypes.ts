import mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
  jobTitle: string;
  role: string;
  department: string;
  jobDescription: string;
  requirements: string;
  responsibilities: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  applicationProcess: string;
  contactEmail: string;
  contactPhone: string;
  applicationDeadline: Date;
  eligibilityCriteria: string;
  additionalNotes?: string;
}

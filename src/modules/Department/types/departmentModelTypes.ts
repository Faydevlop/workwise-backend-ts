import mongoose, { Types } from 'mongoose';

export interface DepartmentData {
  departmentName: string;
  headOfDepartment: mongoose.Types.ObjectId | string | null;
  description: string;
  email: string;
  phone: number;
  teamMembers: string[] | Types.ObjectId[];
}

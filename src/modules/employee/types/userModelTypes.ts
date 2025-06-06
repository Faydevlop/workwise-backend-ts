import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  phone: number;
  gender: string;
  address: string;
  department: mongoose.Schema.Types.ObjectId | null;
  position: string;
  dateOfJoining: Date;
  payroll: mongoose.Schema.Types.ObjectId | null;
  employeeStatus: string;
  password: string;
  profileImageUrl: string;
  projectAssigned: boolean;
}

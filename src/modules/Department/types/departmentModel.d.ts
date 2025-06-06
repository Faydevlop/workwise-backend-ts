// src/types/department.d.ts

import { Document, Types } from "mongoose";

export interface IDepartMent extends Document {
  departmentName: string;
  description: string;
  headOfDepartMent: Types.ObjectId | null;
  email: string;
  phone: number;
  TeamMembers: Types.ObjectId[];
}
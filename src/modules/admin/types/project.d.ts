// src/types/project.d.ts

import { Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  description: string;
  department: Types.ObjectId; // Use Types.ObjectId for clarity
}
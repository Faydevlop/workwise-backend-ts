// src/types/leave.d.ts

import { Document, Types } from 'mongoose';

export interface ILeave extends Document {
  userId: Types.ObjectId;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  reason: string;
  createdAt: Date;
  monthlyLeaveCount: number;
  lastResetDate: Date;
  comment: string;
  isChanged: boolean;
}
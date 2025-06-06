import mongoose from 'mongoose';

export interface IMeeting extends mongoose.Document {
  meetingName: string;
  date: Date;
  time: string;
  participants: mongoose.Types.ObjectId[];
  topic: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: mongoose.Types.ObjectId;
  link: string;
}

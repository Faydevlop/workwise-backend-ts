import mongoose, { Schema, Document, model } from 'mongoose';
import { IMeeting } from '../types/meetingModelTypes';

// Create the Meeting schema
const MeetingSchema: Schema = new Schema({
  meetingName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Storing time as a string
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant', }],
  topic: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  link: { type: String, required: true }, // New field for the meeting link
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Export the Meeting model 
export const Meeting = model<IMeeting>('Meeting', MeetingSchema);

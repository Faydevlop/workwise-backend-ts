import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  sender: string;
  receiver: string;
  type: string;
  roomId: string;
  timestamp: Date;
  message: string;
  isNotificationSend: boolean;
}

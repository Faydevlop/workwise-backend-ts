import mongoose from "mongoose";

export interface ITasks extends mongoose.Document {
  projectId: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  status: string;
  dueDate: Date;
  assignedTo: mongoose.Schema.Types.ObjectId[] | null;
  createdAt: Date;
  comments: mongoose.Schema.Types.ObjectId[] | null;
  priority: string;
  cat: string;
  attachments: {
    fileName?: string;
    fileUrl?: string;
    uploadedAt?: Date;
  }[];
}

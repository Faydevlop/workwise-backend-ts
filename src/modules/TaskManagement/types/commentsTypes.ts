import mongoose from "mongoose";

export interface IComments extends mongoose.Document {
  commentedBy: mongoose.Schema.Types.ObjectId;
  comment: string;
  timestamp: Date;
  taskId: mongoose.Schema.Types.ObjectId;
}

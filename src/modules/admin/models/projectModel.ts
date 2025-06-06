// src/models/projectModel.ts

import mongoose, { Schema } from "mongoose";
import { IProject } from "../types/project.d"; // Import the interface

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  description: { type: String },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
});

export default mongoose.model<IProject>("Project", ProjectSchema);
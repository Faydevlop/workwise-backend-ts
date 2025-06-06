import mongoose, { Document, Schema } from "mongoose";
import { ITasks } from "../types/tasksTypes";

const TaskSchema: Schema = new Schema({
    projectId:{ type: Schema.Types.ObjectId, ref: "Project", required: true },
    name:String,
    description:String,
    status:String,
    dueDate:Date,
    assignedTo:[{ type: Schema.Types.ObjectId, ref: "User", default:null }],
    createdAt:Date,
    comments:[{ type: Schema.Types.ObjectId, ref: "Comments", default:null }],
    priority:String,
    cat:{type:String ,default:'Task'},
    attachments: [
        {
          fileName: { type: String,  },
          fileUrl: { type: String, },
          uploadedAt: { type: Date, default: Date.now },
        },
        
      ],
})

export default mongoose.model<ITasks>('Tasks',TaskSchema  ) 
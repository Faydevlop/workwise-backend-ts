import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Task from "../models/taskModel";
import projectModel from "../../admin/models/projectModel";
import User from "../../employee/models/userModel";
import taskModel from "../models/taskModel";
import { deleteDepartment } from "../../Department/controllers/departmentController";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../../../middlewares/jwtMiddleware";


export const CreateTask = async(req:Request,res:Response):Promise<void>=>{
    console.log('task create reqeust is here');
    
    const {ProjectId} = req.params;
        const {taskTitle,
            status,
            assignedTo,
            priority,
            startDate,
            dueDate,
            description,
            cat
        } = req.body;
      

    try {

        const isProjectExist = await projectModel.findById(ProjectId);

        if(!isProjectExist){
            res.status(200).json({message:'Project not found'})
            return
        }

        const newTask = new Task({
            projectId:ProjectId,
            name:taskTitle,
            description:description,
            status:status,
            dueDate:dueDate,
            assignedTo:assignedTo,
            createdAt:startDate,
            priority:priority,
            cat:cat
        })

        await newTask.save();

        res.status(200).json({message:'task created successfully'})
    } catch (error) {
        res.status(500).json({ message: "Error creating project" });
    }
}

export const uploadAttachments = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      console.log('file data is here');
      
  
      // Check if a file is present
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }
  
      // File URL returned by Cloudinary
      const fileUrl = req.file.path; // Cloudinary URL
      const fileName = req.file.originalname; // Original file name
  
      // Find the Task by taskId and update it with the new attachment
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
          $push: {
            attachments: {
              fileName, // Store the original file name
              fileUrl,  // Cloudinary URL
              uploadedAt: new Date(),
            },
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      return res.status(200).json({
        message: "Attachment uploaded successfully",
        task: updatedTask,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

export const listUsers = async(req:Request,res:Response):Promise<void>=>{
    console.log('user list request is here');
    
    try {

        const { ProjectId } = req.params;
        const projectDetails = await projectModel.findById(ProjectId);


        if (!projectDetails) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        const userDetails = await User.find({department:projectDetails.department,position:'Employee'});
       
        

        if (!userDetails) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }

        res.status(200).json({ users: userDetails });
        
        
    } catch (error) {
        res.status(500).json({ message: error});
    }
}

export const taskdetails = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {taskId} = req.params;
        const taskDetails = await Task.findById(taskId).populate('assignedTo')

        if(!taskDetails){
            res.status(400).json({message:'Task is not found'})
            return
        }

        res.status(200).json({task:taskDetails});

    } catch (error) {
        res.status(500).json({ message: error});
    }
}

export const listTasks = async(req:AuthenticatedRequest,res:Response):Promise<void>=>{
    try {
        const {employeeId} = req.params;

        // Find tasks where the employee is assigned
        const tasks = await Task.find({ assignedTo: employeeId })
            .populate('projectId')   // Populate project details if needed
            .populate('assignedTo')   // Populate user details if needed
            .populate('comments');    // Populate comments details if needed

        // Send the tasks as a response
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const listAttachments = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
  
      // Find the task by ID and select only the attachments field
      const taskDetails = await taskModel.findById(taskId, 'attachments');
  
      if (!taskDetails) {
        return res.status(400).json({ message: 'Task not found' });
      }

      console.log(taskDetails.attachments);
      
  
      // Send the attachments array as a response
      res.status(200).json({ attachments: taskDetails.attachments });
    } catch (error) {
      console.error('Error listing attachments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
  
      // Attempt to delete the task by ID
      const deletedTask = await taskModel.findByIdAndDelete(taskId);
  
      // Check if the task was found and deleted
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found or unable to delete the Task' });
      }
  
      // Return a success response
      return res.status(200).json({ message: 'Task deleted successfully' });
  
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error); // Log the error for debugging purposes
      return res.status(500).json({ message: 'An error occurred while deleting the task' });
    }
  };
  


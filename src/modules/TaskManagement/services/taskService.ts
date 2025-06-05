import Task from "../models/taskModel";
import projectModel from "../../admin/models/projectModel";
import User from "../../employee/models/userModel";
import mongoose from "mongoose";

export class TaskService {
  async createTask(
    projectId: string,
    taskTitle: string,
    description: string,
    status: string,
    dueDate: Date,
    assignedTo: string,
    startDate: Date,
    priority: string,
    cat: string
  ) {
    const isProjectExist = await projectModel.findById(projectId);

    if (!isProjectExist) {
      throw new Error('Project not found');
    }

    const newTask = new Task({
      projectId,
      name: taskTitle,
      description,
      status,
      dueDate,
      assignedTo,
      createdAt: startDate,
      priority,
      cat
    });

    await newTask.save();
    return { message: 'task created successfully' };
  }

  async uploadAttachment(taskId: string, fileUrl: string, fileName: string) {
    if (!fileUrl || !fileName) {
      throw new Error('No file provided');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $push: {
          attachments: {
            fileName,
            fileUrl,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      throw new Error('Task not found');
    }

    return { message: 'Attachment uploaded successfully', task: updatedTask };
  }

  async getProjectUsers(projectId: string) {
    const projectDetails = await projectModel.findById(projectId);

    if (!projectDetails) {
      throw new Error('Project not found');
    }

    const userDetails = await User.find({
      department: projectDetails.department,
      position: 'Employee'
    });

    return { users: userDetails };
  }

  async getTaskDetails(taskId: string) {
    const taskDetails = await Task.findById(taskId).populate('assignedTo');

    if (!taskDetails) {
      throw new Error('Task is not found');
    }

    return { task: taskDetails };
  }

  async getEmployeeTasks(employeeId: string) {
    const tasks = await Task.find({ assignedTo: employeeId })
      .populate('projectId')
      .populate('assignedTo')
      .populate('comments');

    return tasks;
  }

  async getTaskAttachments(taskId: string) {
    const taskDetails = await Task.findById(taskId, 'attachments');

    if (!taskDetails) {
      throw new Error('Task not found');
    }

    return { attachments: taskDetails.attachments };
  }

  async deleteTask(taskId: string) {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      throw new Error('Task not found or unable to delete the Task');
    }

    return { message: 'Task deleted successfully' };
  }
}

export default new TaskService();
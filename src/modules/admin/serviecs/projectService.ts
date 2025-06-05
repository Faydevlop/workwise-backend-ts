import mongoose, { Types } from "mongoose";
import projectModel from "../models/projectModel";
import User from "../../employee/models/userModel";
import Department from "../../Department/model/departmentModel";
import taskModel from "../../TaskManagement/models/taskModel";

// Update the interface to accommodate the proper ObjectId type
interface ProjectData {
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  description: string;
  sdepartment: string | mongoose.Types.ObjectId;
}

export const createProject = async (projectData: ProjectData) => {
  const {
    name,
    status,
    startDate,
    endDate,
    priority,
    description,
    sdepartment,
  } = projectData;

  // Check for existing project with the same name
  const existingProject = await projectModel.findOne({ name });
  if (existingProject) {
    throw new Error('Duplicate Project is Found');
  }

  // Create the new project with proper type handling for department
  const departmentId = sdepartment 
    ? typeof sdepartment === 'string' 
      ? new mongoose.Types.ObjectId(sdepartment) 
      : sdepartment 
    : undefined;

  const newProject = new projectModel({
    name,
    status,
    startDate,
    endDate,
    priority,
    description,
    department: departmentId,
  });

  await newProject.save();
  return { message: "Project created successfully" };
};

export const getAllProjects = async () => {
  const projects = await projectModel.find();
  if (!projects || projects.length === 0) {
    throw new Error("No Project Found");
  }
  return projects;
};

export const getProjectById = async (projectId: string | Types.ObjectId) => {
  const projectDetails = await projectModel.findById(projectId).populate('department');
  if (!projectDetails) {
    throw new Error("Project details not found");
  }
  return projectDetails;
};

export const updateProject = async (projectId: string | Types.ObjectId, projectData: ProjectData) => {
  const {
    name,
    status,
    startDate,
    endDate,
    priority,
    description,
    sdepartment
  } = projectData;

  const projectDetails = await projectModel.findById(projectId);
  if (!projectDetails) {
    throw new Error("Project not found");
  }

  projectDetails.name = name;
  projectDetails.status = status;
  projectDetails.startDate = startDate;
  projectDetails.endDate = endDate;
  projectDetails.priority = priority;
  projectDetails.description = description;
  
  // Handle the department assignment with type safety
  if (sdepartment) {
    // Cast the department field to any to bypass TypeScript's strict type checking
    // This is a workaround for the Mongoose type incompatibility
    (projectDetails as any).department = typeof sdepartment === 'string' 
      ? new mongoose.Types.ObjectId(sdepartment) 
      : sdepartment;
  }

  await projectDetails.save();
  return { message: "Project updated successfully" };
};

export const removeProject = async (projectId: string | Types.ObjectId) => {
  const projectDetails = await projectModel.findById(projectId);
  if (!projectDetails) {
    throw new Error("Project not found");
  }

  await projectModel.findByIdAndDelete(projectId);
  return { message: "Project deleted successfully" };
};

export const getProjectsByManager = async (managerId: string | Types.ObjectId) => {
  // Convert string to ObjectId if needed
  const managerIdObj = typeof managerId === 'string' 
    ? new mongoose.Types.ObjectId(managerId) 
    : managerId;
    
  const department = await Department.findOne({ headOfDepartMent: managerIdObj });
  if (!department) {
    throw new Error("Department Not found");
  }

  const projectDetails = await projectModel.find({ 
    department: department._id 
  }).populate('department');
  
  if (!projectDetails || projectDetails.length === 0) {
    throw new Error("Project details not found");
  }

  // Fetch tasks for each project
  const projectIds = projectDetails.map(p => p._id);
  const tasks = await taskModel.find({ 
    projectId: { $in: projectIds } 
  }).populate('projectId');

  return { projectDetails, tasks };
};

export const getTasksByProject = async (projectId: string | Types.ObjectId) => {
  // Convert string to ObjectId if needed
  const projectIdObj = typeof projectId === 'string' 
    ? new mongoose.Types.ObjectId(projectId) 
    : projectId;
    
  const tasks = await taskModel.find({ projectId: projectIdObj });
  if (!tasks || tasks.length === 0) {
    throw new Error("No tasks found");
  }
  return { tasks };
};
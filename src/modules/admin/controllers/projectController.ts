import { Request, Response } from "express";
import * as projectService from "../serviecs/projectService";

export const addNewProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    status,
    startDate,
    endDate,
    priority,
    description,
    sdepartment,
  } = req.body;

  console.log(name, status, startDate, endDate, priority, description, sdepartment);

  try {
    const result = await projectService.createProject(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof Error && error.message === 'Duplicate Project is Found') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error creating project" });
    }
  }
};

export const listProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: "Error fetching projects" });
  }
};

export const getprojectdetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const projectDetails = await projectService.getProjectById(projectId);
    res.status(200).json(projectDetails);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error fetching project details" });
  }
};

export const editProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  
  try {
    const result = await projectService.updateProject(projectId, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(error instanceof Error && error.message === "Project not found" ? 400 : 500)
      .json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  console.log('delete project request is here', projectId);
  
  try {
    const result = await projectService.removeProject(projectId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(error instanceof Error && error.message === "Project not found" ? 400 : 500)
      .json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

export const projectlisting = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { managerId } = req.params;
    const result = await projectService.getProjectsByManager(managerId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error instanceof Error && 
      (error.message === "Department Not found" || error.message === "Project details not found") 
      ? 400 : 500)
      .json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

export const listTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getTasksByProject(projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error instanceof Error && error.message === "No tasks found" ? 400 : 500)
      .json({ message: error instanceof Error ? error.message : "Server error" });
  }
};
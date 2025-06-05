import { Request, Response } from "express";
import * as departmentService from "../serviecs/departmentService";

export const listNonDepartmentempo = async (req: Request, res: Response): Promise<void> => {
  console.log('req is here 1');
  
  try {
    const users = await departmentService.findNonDepartmentEmployees();
    console.log('req is here 2');
    console.log(users.length);
    
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching users with no department' });
  }
};

export const listManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await departmentService.findManagers();
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something broke!' });
  }
};

export const addDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedDepartment = await departmentService.createDepartment(req.body);
    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const showDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error listing department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    const result = await departmentService.removeDepartment(departmentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    const details = await departmentService.getDepartmentDetails(departmentId);
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const editDetails = async (req: Request, res: Response) => {
  const { departmentId } = req.params;
  
  try {
    const result = await departmentService.updateDepartmentDetails(departmentId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  console.log('request are here');
  
  const { departmentId } = req.params;
  const { teamMemberIds } = req.body;
  console.log(teamMemberIds, departmentId);
  
  try {
    const result = await departmentService.removeTeamMember(departmentId, teamMemberIds);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
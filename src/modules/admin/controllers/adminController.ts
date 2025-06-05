import { Request, Response } from "express";
import * as adminService from "../serviecs/adminService";

interface AddUserBody {
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  phone: number;
  gender: string;
  address: string;
  position: string;
  dateOfJoining: Date;
  employeeStatus: string;
  password: string;
  profile: string;
}

export const AddUser = async (
  req: Request<{}, {}, AddUserBody>,
  res: Response
): Promise<void> => {
  try {
    console.log("add user request is here");
    await adminService.createUser(req.body);
    
    res
      .status(201)
      .json({ message: "User created successfully, Email verification sent" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(400).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await adminService.fetchAllUsers();
    res.status(200).json({ allUsers });
  } catch (error) {
    res.status(400).json({ message:  "Something went Wrong" });
  }
};

export const getSpecificUser = async (req: Request, res: Response): Promise<void> => {
  console.log("specific user request is here");
  
  try {
    const { userId } = req.params;
    const user = await adminService.fetchUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message:  "Server error" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const updatedUser = await adminService.updateUserDetails(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: "Server error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    await adminService.removeUser(userId);
    res.status(200).json({ message: "User delete successful" });
  } catch (error) {
    res.status(404).json({ message: "Server error" });
  }
};

export const adminDashboard = async(req: Request, res: Response): Promise<void> => {
  try {
    console.log('req is here');
    
    const dashboardData = await adminService.fetchDashboardData();
    res.status(200).json(dashboardData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const adminChagePass = async(req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword, 'here here here');
    
    await adminService.changeAdminPassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing admin password:", error);
    res.status(400).json({ message:  "Error changing password" });
  }
};
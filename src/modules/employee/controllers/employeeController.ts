import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/jwtMiddleware";
import * as employeeService from "../serviecs/employeeService";

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const profileImageUrl = req.file?.path;
    
    const updatedUser = await employeeService.updateProfileService(
      userId,
      req.body,
      profileImageUrl
    );
    
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({ 
      message: error.message || "Server error" 
    });
  }
};

export const resetPassRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await employeeService.resetPassRequestService(userId);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    res.status(error.message === "User Not Found" ? 401 : 500).json({ 
      message: error.message || "Server error" 
    });
  }
};

export const ChangePassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const result = await employeeService.changePasswordService(token, password);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error resetting password:", error);
    
    if (error.message === "Invalid request" || error.message === "User not found") {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

export const dashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = await employeeService.dashboardDataService(userId);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    res.status(error.message === "Unauthorized" ? 401 : 500).json({ 
      message: error.message || "Internal server error" 
    });
  }
};

export const employeedetails = async(req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const data = await employeeService.employeeDetailsService(userId);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching employee details:', error);
    res.status(error.message === "User Not Found" ? 400 : 500).json({ 
      message: error.message || "Internal server error" 
    });
  }
};

export const resetEmail = async(req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { newEmail } = req.body;
    
    const result = await employeeService.resetEmailService(userId, newEmail);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error resetting email:', error);
    
    if (error.message === "The email is already taken" || error.message === "User Not found") {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const setNewEmail = async(req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { newEmail } = req.body;
    
    const result = await employeeService.setNewEmailService(userId, newEmail);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error setting new email:', error);
    
    if (error.message === "The Email is already taken" || error.message === "User Not Found") {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};
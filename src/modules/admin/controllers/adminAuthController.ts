import { Request, Response } from "express";
import * as adminAuthService from "../serviecs/adminAuthService";

// defining interfaces for request body
interface AdminSignupBody {
  username: string;
  email: string;
  password: string;
}

interface AdminLoginBody {
  email: string;
  password: string;
}

export const adminSignup = async (
  req: Request<{}, {}, AdminSignupBody>,
  res: Response
): Promise<void> => {
  try {
    console.log("request is here");
    
    const result = await adminAuthService.createAdmin(req.body);
    
    console.log('accessToken is here', result.accessToken);
    
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

export const adminLogin = async (
  req: Request<{}, {}, AdminLoginBody>,
  res: Response
): Promise<void> => {
  try {
    console.log("req is here");

    const result = await adminAuthService.authenticateAdmin(req.body);
    
    // Set refresh token in HTTP-only cookie if needed
    // res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
  
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "An error occurred during login" });
  }
};
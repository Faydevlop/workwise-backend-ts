import { Request, Response } from "express";
import { loginService, logoutService } from "../serviecs/employeeAuthService";

interface UserLogin {
  email: string;
  password: string;
}

export const employeeLogin = async (
  req: Request<{}, {}, UserLogin>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    try {
      const { accessToken, refreshToken, user } = await loginService(email, password);
      
      // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

      
      res.status(200).json({ accessToken, user });
    } catch (serviceError: any) {
      // Handle specific error messages from service
      res.status(400).json({ message: serviceError.message });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

export const employeeLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await logoutService();
    
   res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
});

    
    res.status(200).json(result);
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};
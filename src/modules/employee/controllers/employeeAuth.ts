import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../../middlewares/jwt";

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
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User Not Found" });
      return;
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      res.status(400).json({ message: "Wrong password" });
      return;
    }

    if(user.employeeStatus === 'inactive'){
      res.status(400).json({ message: "Account inactive" });
      return;
    }

    if(user.position != 'Employee'){
      res.status(400).json({message:'Employee Not Found in this credentials'});
      return
      }

      const accessToken = generateAccessToken(user._id);  // Corrected here
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET!, 
        { expiresIn: '7d' }
      );
  
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent over HTTPS in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  

    res.status(200).json({ accessToken, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

// controllers/authController.ts or wherever your employeeLogin is
export const employeeLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

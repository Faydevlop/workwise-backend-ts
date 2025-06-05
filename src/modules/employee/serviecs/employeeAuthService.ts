import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../../middlewares/jwt";

interface UserLogin {
  email: string;
  password: string;
}

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User Not Found");
  }

  const passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    throw new Error("Wrong password");
  }

  if (user.employeeStatus === 'inactive') {
    throw new Error("Account inactive");
  }

  if (user.position != 'Employee') {
    throw new Error("Employee Not Found in this credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    user
  };
};

export const logoutService = async () => {
  return { message: "Logged out successfully" };
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel";
import { generateAccessToken } from '../../../middlewares/jwt';
import { AdminSignupData, AdminLoginData } from '../types/adminTypes';

export const createAdmin = async (adminData: AdminSignupData) => {
  const { username, email, password } = adminData;

  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    throw new Error("Admin already exists. Please login.");
  }

  const hashedpassword = await bcrypt.hash(password, 12);

  const newAdmin = new Admin({
    username,
    email,
    password: hashedpassword,
  });

  await newAdmin.save();

  const accessToken = generateAccessToken(newAdmin._id);
  
  const refreshToken = jwt.sign(
    { userId: newAdmin._id },
    process.env.JWT_REFRESH_SECRET! || 'workwise', 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken, admin: newAdmin };
};

export const authenticateAdmin = async (loginData: AdminLoginData) => {
  const { email, password } = loginData;
  
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new Error("User Not found Please login");
  }

  const passMatch = await bcrypt.compare(password, user.password);
  if (!passMatch) {
    throw new Error("Wrong Password");
  }

  const accessToken = generateAccessToken(user._id);
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET! || 'workwise', 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken, admin: user };
};
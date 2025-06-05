import bcrypt from "bcrypt";
import User from "../../employee/models/userModel";
import Leave from "../../leaveManagement/models/leaveModel";
import Department from "../../Department/model/departmentModel";
import Payroll from "../../PayrollManagement/models/payrollModel";
import projectModel from "../models/projectModel";
import Admin from "../models/adminModel";
import sendVerificationmail from "../middlewares/mailVerification";

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

function generateRandomPassword(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

export const createUser = async (userData: AddUserBody) => {
  const {
    firstName,
    lastName,
    email,
    dob,
    phone,
    gender,
    address,
    position,
    dateOfJoining,
    employeeStatus,
  } = userData;

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new Error("User already Exists In this Email");
  }

  const randomPass = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(randomPass, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    dob,
    phone,
    gender,
    address,
    profileImageUrl: `https://i.pinimg.com/564x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg`,
    position,
    dateOfJoining,
    employeeStatus,
    password: hashedPassword,
  });

  await sendVerificationmail(email, randomPass, position);
  console.log('Password:', randomPass);
  
  await newUser.save();
  
  return newUser;
};

export const fetchAllUsers = async () => {
  const allUsers = await User.find().populate('department');
  if (!allUsers || allUsers.length === 0) {
    throw new Error("Users collection is empty");
  }
  
  return allUsers;
};

export const fetchUserById = async (userId: string) => {
  const user = await User.findById(userId).populate('department');
  if (!user) {
    throw new Error("User Not found");
  }
  
  return user;
};

export const updateUserDetails = async (userId: string, updateData: Partial<AddUserBody>) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.firstName = updateData.firstName || user.firstName;
  user.lastName = updateData.lastName || user.lastName;
  user.email = updateData.email || user.email;
  user.dob = updateData.dob || user.dob;
  user.phone = updateData.phone || user.phone;
  user.gender = updateData.gender || user.gender;
  user.address = updateData.address || user.address;
  user.position = updateData.position || user.position;
  user.dateOfJoining = updateData.dateOfJoining || user.dateOfJoining;
  user.employeeStatus = updateData.employeeStatus || user.employeeStatus;

  const updatedUser = await user.save();
  return updatedUser;
};

export const removeUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  return { success: true, message: "User delete successful" };
};

export const fetchDashboardData = async () => {
  const leaves = await Leave.find({status:'Pending'}).populate('userId');
  const department = await Department.find();
  const payroll = await Payroll.find().populate('employee');
  const projects = await projectModel.find().populate('department');
  
  return { leaves, department, payroll, projects };
};

export const changeAdminPassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const admin = await Admin.findById(userId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    throw new Error("Incorrect Old Password");
  }

  const saltRounds = 10;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  admin.password = hashedNewPassword;
  await admin.save();
  
  return { success: true, message: "Password changed successfully" };
};
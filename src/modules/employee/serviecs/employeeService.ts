import User from "../models/userModel";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Meeting } from "../../meetings/model/MeetingModal";
import taskModel from "../../TaskManagement/models/taskModel";
import Payroll from "../../PayrollManagement/models/payrollModel";
import Leave from "../../leaveManagement/models/leaveModel";
import nodemailer from "nodemailer";
import sendRestlink from "../middlewares/resetPass";

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAILPASS,
  },
});

// Business logic functions
export const updateProfileService = async (
  userId: string,
  updateData: any,
  profileImageUrl?: string
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Update user fields
  user.firstName = updateData.firstName || user.firstName;
  user.lastName = updateData.lastName || user.lastName;
  user.email = updateData.email || user.email;
  user.dob = updateData.dob || user.dob;
  user.phone = updateData.phone || user.phone;
  user.gender = updateData.gender || user.gender;
  user.address = updateData.address || user.address;

  // Update profile image if it exists
  if (profileImageUrl) {
    user.profileImageUrl = profileImageUrl;
  }

  const updatedUser = await user.save();
  return updatedUser;
};

export const resetPassRequestService = async (userId: string) => {
  const existUser = await User.findById(userId);

  if (!existUser) {
    throw new Error("User Not Found");
  }

  const token = Jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  const resetLink = `${process.env.FRONTENDAPI}/employee/reset-password?token=${token}`;

  await sendRestlink(existUser.email, resetLink);
  
  return { message: "Verification Link sent Success" };
};

export const changePasswordService = async (token: string, password: string) => {
  if (!token || !password) {
    throw new Error("Invalid request");
  }

  const decode: any = Jwt.verify(token, process.env.JWT_SECRET as string);
  const userId = decode.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  await user.save();

  return { message: "Password has been reset successfully" };
};

export const dashboardDataService = async (userId: string) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const upcomingMeetings = await Meeting.find({
    participants: userId,
    date: { $gte: new Date() },
    status: 'scheduled'
  });

  const tasks = await taskModel.find({ assignedTo: userId });
  const payrollData = await Payroll.find({ employee: userId });
  const leaveRequests = await Leave.find({ userId });

  return {
    upcomingMeetings,
    tasks,
    payrollData,
    leaveRequests
  };
};

export const employeeDetailsService = async (userId: string) => {
  const userdata = await User.findById(userId);

  if (!userdata) {
    throw new Error("User Not Found");
  }

  return { userdata };
};

export const generateOtp = () => {
  // Generate a random 6-digit number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert to string if needed
};

export const resetEmailService = async (userId: string, newEmail: string) => {
  const oldUserdata = await User.findOne({ email: newEmail });

  if (oldUserdata) {
    throw new Error("The email is already taken");
  }

  const userData = await User.findById(userId);

  if (!userData) {
    throw new Error("User Not found");
  }

  const otp = generateOtp();

  // Send email notification
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: newEmail,
    subject: `OTP - Email Change ${userData.email}`,
    text: `Your email resent OTP is : ${otp}`
  };

  await new Promise<void>((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve();
      }
    });
  });

  return { otp };
};

export const setNewEmailService = async (userId: string, newEmail: string) => {
  const existEmail = await User.findOne({ email: newEmail });

  if (existEmail) {
    throw new Error("The Email is already taken");
  }

  const userData = await User.findByIdAndUpdate(userId, { email: newEmail }, { new: true });

  if (!userData) {
    throw new Error("User Not Found");
  }

  return { message: "User email Updated success" };
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../employee/models/userModel";
import { generateAccessToken } from "../../../middlewares/jwt";
import projectModel from "../../admin/models/projectModel";
import Leave from "../../leaveManagement/models/leaveModel";
import { Meeting } from "../../meetings/model/MeetingModal";
import taskModel from "../../TaskManagement/models/taskModel";

export interface LoginResult {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  manager?: any;
}

export const authenticateManager = async (email: string, password: string): Promise<LoginResult> => {
  const user = await User.findOne({ email: email });

  if (!user) {
    return { success: false, message: 'User not found Please' };
  }

  const passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    return { success: false, message: 'Wrong Password' };
  }

  if (user.employeeStatus === 'inactive') {
    return { success: false, message: 'Account inactive' };
  }

  if (user.position != 'Manager') {
    return { success: false, message: 'Manager Not Found in this credentials' };
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    accessToken,
    refreshToken,
    manager: user
  };
};

export const getManagerDashboardData = async (managerId: string) => {
  const managerDetails = await User.findById(managerId);
  if (!managerDetails) {
    return { success: false, message: 'Manager not found' };
  }

  const managerDepId = managerDetails.department;
  const users = await User.find({ department: managerDepId, position: 'Employee' });
  
  if (!users || users.length === 0) {
    return { success: false, message: 'No Users Found' };
  }

  const userIds = users.map(user => user._id);
  const leaves = await Leave.find({ userId: { $in: userIds } }).populate('userId');

  const upcomingMeetings = await Meeting.find({
    createdBy: managerId,
    status: 'scheduled'
  });

  const projects = await projectModel.find({ department: managerDepId });

  return {
    success: true,
    data: {
      leaves,
      upcomingMeetings,
      projects
    }
  };
};
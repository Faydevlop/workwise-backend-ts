import Leave from "../models/leaveModel";
import User from "../../employee/models/userModel";
import Admin from "../../admin/models/adminModel";
import notificationModel from "../../notification/model/notificationModel";
import nodemailer from "nodemailer";
import { io } from "../../../app";

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  },
});

export const createLeaveRequest = async (userId: string, leaveType: string, startDate: string, endDate: string, reason: string) => {
  // Validate input
  if (!userId || !leaveType || !startDate || !endDate || !reason) {
    return { success: false, message: "All fields are required." };
  }

  const end = new Date(startDate);
  const start = new Date(endDate);

  // Check for leave request conflicts
  const existLeave = await Leave.findOne({
    userId,
    $or: [
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
    ],
  });

  if (existLeave) {
    return { success: false, message: 'You already have a leave applied during these dates' };
  }

  // Check monthly leave count
  const lastLeave = await Leave.findOne({ userId }).sort({ createdAt: -1 });
  let monthlyLeaveCount = 1;
  let lastResetDate = new Date();

  if (lastLeave) {
    const now = new Date();
    if (lastLeave.lastResetDate.getMonth() !== now.getMonth()) {
      monthlyLeaveCount = 1;
      lastResetDate = now;
    } else {
      if (lastLeave.monthlyLeaveCount >= 4) {
        return { success: false, message: 'You have reached your leave limit for this month' };
      }
      monthlyLeaveCount = lastLeave.monthlyLeaveCount + 1;
      lastResetDate = lastLeave.lastResetDate;
    }
  }

  // Create and save new leave
  const newLeave = new Leave({
    userId,
    leaveType,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    reason,
    createdAt: new Date(),
    monthlyLeaveCount,
    lastResetDate,
  });

  const userdata = await User.findById(userId);
  const savedLeave = await newLeave.save();

  // Get admin and HR emails
  const admins = await Admin.find({}, 'email');
  const adminEmails = admins.map(admin => admin.email);

  const hrUsers = await User.find({ position: 'HR' });
  const hrEmails = hrUsers.map(hr => hr.email);

  const recipients = [...adminEmails, ...hrEmails];

  if (recipients.length === 0) {
    return {
      success: true,
      message: "Leave request created successfully, but no admin or HR emails found.",
      leave: savedLeave
    };
  }

  // Send email notification
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: `Leave Request from ${userdata?.firstName}${userdata?.lastName}`,
    text: `
Dear HR/Admin Team,

I hope this message finds you well.

Please be informed that a new leave request has been submitted with the following details:

- **Employee Name**: ${userdata?.firstName} ${userdata?.lastName}
- **Position**: ${userdata?.position}
- **Employee ID**: ${userId}
- **Leave Type**: ${leaveType}
- **Start Date**: ${startDate}
- **End Date**: ${endDate}
- **Reason for Leave**: ${reason}

Kindly review this request and proceed with the necessary actions.

Thank you for your attention to this matter.

Best regards,  
${userdata?.firstName} ${userdata?.lastName}
`
  };

  try {
    await sendEmail(mailOptions);
    return {
      success: true,
      message: "Leave request created successfully and email sent.",
      leave: savedLeave
    };
  } catch (error) {
    console.log('Error sending email:', error);
    return {
      success: true,
      message: "Leave request created successfully but failed to send email.",
      leave: savedLeave
    };
  }
};

const sendEmail = (mailOptions: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

export const getAllLeaves = async () => {
  const leavesList = await Leave.find({ isChanged: false }).populate('userId');
  if (!leavesList || leavesList.length === 0) {
    return { success: false, message: 'Leave Requests is empty' };
  }
  return { success: true, leaves: leavesList };
};

export const getUserLeaves = async (userId: string) => {
  const userLeaveList = await Leave.find({ userId }).populate('userId');
  if (!userLeaveList || userLeaveList.length === 0) {
    return { success: false, message: 'User does not have Leave Requests' };
  }
  return { success: true, leaves: userLeaveList };
};

export const getLeaveDetails = async (leaveId: string) => {
  const details = await Leave.findById(leaveId).populate('userId');
  if (!details) {
    return { success: false, message: 'details not found' };
  }
  return { success: true, leave: details };
};

export const updateLeaveStatus = async (leaveId: string, action: string, comment?: string) => {
  const userLeave = await Leave.findById(leaveId);

  if (!userLeave) {
    return { success: false, message: 'invalid action' };
  }

  const userId = userLeave.userId.toString();

  // Create notification
  const newNotification = new notificationModel({
    receiver: userId,
    type: 'message',
    message: `Your Leave Request Is : ${action} Date:${new Date(userLeave.startDate).toLocaleDateString()} to ${new Date(userLeave.endDate).toLocaleDateString()}`,
  });

  await newNotification.save();
  io.to(userId).emit('newNotification', newNotification);

  if (action === 'Approved') {
    userLeave.status = 'Approved';
    userLeave.isChanged = true;
  } else if (action === 'Rejected') {
    userLeave.comment = comment || '';
    userLeave.monthlyLeaveCount -= 1;
    userLeave.status = 'Rejected';
    userLeave.isChanged = true;
  } else {
    return { success: false, message: 'Invalid action.' };
  }

  await userLeave.save();
  return { success: true, message: `Leave status has been Updated` };
};

export const getLeaveDashboardData = async () => {
  // Total employees
  const totalEmployees = await User.countDocuments();

  // Count of employees with approved leaves
  const notWorkingEmps = await Leave.countDocuments({ status: 'Approved' });

  // Pending leave requests
  const pendingLeaveRequest = await Leave.countDocuments({ status: 'Pending' });

  // Employees on leave today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = new Date(today);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const onLeaveToday = await Leave.find({
    startDate: { $lte: endOfDay },
    endDate: { $gte: startOfDay },
    status: 'Approved'
  }).populate('userId');

  return {
    success: true,
    data: {
      totalEmployees,
      workingEmployees: totalEmployees - notWorkingEmps,
      pendingLeaveRequest,
      onLeaveToday
    }
  };
};

export const getManagerLeaves = async (managerId: string) => {
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

  return { success: true, leaves };
};
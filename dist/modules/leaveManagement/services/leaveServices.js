"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagerLeaves = exports.getLeaveDashboardData = exports.updateLeaveStatus = exports.getLeaveDetails = exports.getUserLeaves = exports.getAllLeaves = exports.createLeaveRequest = void 0;
const leaveModel_1 = __importDefault(require("../models/leaveModel"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const adminModel_1 = __importDefault(require("../../admin/models/adminModel"));
const notificationModel_1 = __importDefault(require("../../notification/model/notificationModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const app_1 = require("../../../app");
// Email configuration
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS,
    },
});
const createLeaveRequest = (userId, leaveType, startDate, endDate, reason) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate input
    if (!userId || !leaveType || !startDate || !endDate || !reason) {
        return { success: false, message: "All fields are required." };
    }
    const end = new Date(startDate);
    const start = new Date(endDate);
    // Check for leave request conflicts
    const existLeave = yield leaveModel_1.default.findOne({
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
    const lastLeave = yield leaveModel_1.default.findOne({ userId }).sort({ createdAt: -1 });
    let monthlyLeaveCount = 1;
    let lastResetDate = new Date();
    if (lastLeave) {
        const now = new Date();
        if (lastLeave.lastResetDate.getMonth() !== now.getMonth()) {
            monthlyLeaveCount = 1;
            lastResetDate = now;
        }
        else {
            if (lastLeave.monthlyLeaveCount >= 4) {
                return { success: false, message: 'You have reached your leave limit for this month' };
            }
            monthlyLeaveCount = lastLeave.monthlyLeaveCount + 1;
            lastResetDate = lastLeave.lastResetDate;
        }
    }
    // Create and save new leave
    const newLeave = new leaveModel_1.default({
        userId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        createdAt: new Date(),
        monthlyLeaveCount,
        lastResetDate,
    });
    const userdata = yield userModel_1.default.findById(userId);
    const savedLeave = yield newLeave.save();
    // Get admin and HR emails
    const admins = yield adminModel_1.default.find({}, 'email');
    const adminEmails = admins.map(admin => admin.email);
    const hrUsers = yield userModel_1.default.find({ position: 'HR' });
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
        subject: `Leave Request from ${userdata === null || userdata === void 0 ? void 0 : userdata.firstName}${userdata === null || userdata === void 0 ? void 0 : userdata.lastName}`,
        text: `
Dear HR/Admin Team,

I hope this message finds you well.

Please be informed that a new leave request has been submitted with the following details:

- **Employee Name**: ${userdata === null || userdata === void 0 ? void 0 : userdata.firstName} ${userdata === null || userdata === void 0 ? void 0 : userdata.lastName}
- **Position**: ${userdata === null || userdata === void 0 ? void 0 : userdata.position}
- **Employee ID**: ${userId}
- **Leave Type**: ${leaveType}
- **Start Date**: ${startDate}
- **End Date**: ${endDate}
- **Reason for Leave**: ${reason}

Kindly review this request and proceed with the necessary actions.

Thank you for your attention to this matter.

Best regards,  
${userdata === null || userdata === void 0 ? void 0 : userdata.firstName} ${userdata === null || userdata === void 0 ? void 0 : userdata.lastName}
`
    };
    try {
        yield sendEmail(mailOptions);
        return {
            success: true,
            message: "Leave request created successfully and email sent.",
            leave: savedLeave
        };
    }
    catch (error) {
        console.log('Error sending email:', error);
        return {
            success: true,
            message: "Leave request created successfully but failed to send email.",
            leave: savedLeave
        };
    }
});
exports.createLeaveRequest = createLeaveRequest;
const sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(info);
            }
        });
    });
};
const getAllLeaves = () => __awaiter(void 0, void 0, void 0, function* () {
    const leavesList = yield leaveModel_1.default.find({ isChanged: false }).populate('userId');
    if (!leavesList || leavesList.length === 0) {
        return { success: false, message: 'Leave Requests is empty' };
    }
    return { success: true, leaves: leavesList };
});
exports.getAllLeaves = getAllLeaves;
const getUserLeaves = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userLeaveList = yield leaveModel_1.default.find({ userId }).populate('userId');
    if (!userLeaveList || userLeaveList.length === 0) {
        return { success: false, message: 'User does not have Leave Requests' };
    }
    return { success: true, leaves: userLeaveList };
});
exports.getUserLeaves = getUserLeaves;
const getLeaveDetails = (leaveId) => __awaiter(void 0, void 0, void 0, function* () {
    const details = yield leaveModel_1.default.findById(leaveId).populate('userId');
    if (!details) {
        return { success: false, message: 'details not found' };
    }
    return { success: true, leave: details };
});
exports.getLeaveDetails = getLeaveDetails;
const updateLeaveStatus = (leaveId, action, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const userLeave = yield leaveModel_1.default.findById(leaveId);
    if (!userLeave) {
        return { success: false, message: 'invalid action' };
    }
    const userId = userLeave.userId.toString();
    // Create notification
    const newNotification = new notificationModel_1.default({
        receiver: userId,
        type: 'message',
        message: `Your Leave Request Is : ${action} Date:${new Date(userLeave.startDate).toLocaleDateString()} to ${new Date(userLeave.endDate).toLocaleDateString()}`,
    });
    yield newNotification.save();
    app_1.io.to(userId).emit('newNotification', newNotification);
    if (action === 'Approved') {
        userLeave.status = 'Approved';
        userLeave.isChanged = true;
    }
    else if (action === 'Rejected') {
        userLeave.comment = comment || '';
        userLeave.monthlyLeaveCount -= 1;
        userLeave.status = 'Rejected';
        userLeave.isChanged = true;
    }
    else {
        return { success: false, message: 'Invalid action.' };
    }
    yield userLeave.save();
    return { success: true, message: `Leave status has been Updated` };
});
exports.updateLeaveStatus = updateLeaveStatus;
const getLeaveDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Total employees
    const totalEmployees = yield userModel_1.default.countDocuments();
    // Count of employees with approved leaves
    const notWorkingEmps = yield leaveModel_1.default.countDocuments({ status: 'Approved' });
    // Pending leave requests
    const pendingLeaveRequest = yield leaveModel_1.default.countDocuments({ status: 'Pending' });
    // Employees on leave today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const onLeaveToday = yield leaveModel_1.default.find({
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
});
exports.getLeaveDashboardData = getLeaveDashboardData;
const getManagerLeaves = (managerId) => __awaiter(void 0, void 0, void 0, function* () {
    const managerDetails = yield userModel_1.default.findById(managerId);
    if (!managerDetails) {
        return { success: false, message: 'Manager not found' };
    }
    const managerDepId = managerDetails.department;
    const users = yield userModel_1.default.find({ department: managerDepId, position: 'Employee' });
    if (!users || users.length === 0) {
        return { success: false, message: 'No Users Found' };
    }
    const userIds = users.map(user => user._id);
    const leaves = yield leaveModel_1.default.find({ userId: { $in: userIds } }).populate('userId');
    return { success: true, leaves };
});
exports.getManagerLeaves = getManagerLeaves;

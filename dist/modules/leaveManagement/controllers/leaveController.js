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
exports.managerLeaveMng = exports.leavepageListingdatas = exports.changeStatus = exports.listdetails = exports.listingleavesforUser = exports.listingLeaves = exports.createLeave = void 0;
const leaveModel_1 = __importDefault(require("../models/leaveModel"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const adminModel_1 = __importDefault(require("../../admin/models/adminModel"));
const app_1 = require("../../../app");
const notificationModel_1 = __importDefault(require("../../notification/model/notificationModel"));
// Email configuration
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS,
    },
});
const createLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;
        if (!userId || !leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const end = new Date(startDate);
        const start = new Date(endDate);
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
            return res.status(409).json({ message: 'You already have a leave applied during these dates' });
        }
        const lastLeave = yield leaveModel_1.default.findOne({ userId }).sort({ createdAt: -1 });
        if (lastLeave) {
            const now = new Date();
            if (lastLeave.lastResetDate.getMonth() !== now.getMonth()) {
                lastLeave.monthlyLeaveCount = 0;
                lastLeave.lastResetDate = now;
            }
            if (lastLeave.monthlyLeaveCount >= 4) {
                return res.status(403).json({ message: 'You have reached your leave limit for this month' });
            }
            lastLeave.monthlyLeaveCount += 1;
            yield lastLeave.save();
        }
        const newLeave = new leaveModel_1.default({
            userId: userId,
            leaveType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            createdAt: new Date(),
            monthlyLeaveCount: lastLeave ? lastLeave.monthlyLeaveCount : 1,
            lastResetDate: lastLeave ? lastLeave.lastResetDate : new Date(),
        });
        const userdata = yield userModel_1.default.findById(userId);
        const savedLeave = yield newLeave.save();
        // Retrieve admin emails
        const admins = yield adminModel_1.default.find({}, 'email');
        const adminEmails = admins.map(admin => admin.email);
        // Retrieve HR emails
        const hrUsers = yield userModel_1.default.find({ position: 'HR' }); // Assuming there's an HR model
        const hrEmails = hrUsers.map(hr => hr.email);
        // Combine admin and HR emails
        const recipients = [...adminEmails, ...hrEmails];
        if (recipients.length === 0) {
            console.log('No admin or HR emails found.');
            return res.status(201).json({
                message: "Leave request created successfully, but no admin or HR emails found.",
            });
        }
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipients, // Change this to the recipient's email
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
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({
            message: "Leave request created successfully and email sent.",
        });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
exports.createLeave = createLeave;
const listingLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const LeavesLists = yield leaveModel_1.default.find({ isChanged: false }).populate('userId');
        if (!LeavesLists) {
            res.status(400).json({ message: 'Leave Requests is empty' });
            return;
        }
        res.status(200).json({ leaves: LeavesLists });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leave Requests' });
    }
});
exports.listingLeaves = listingLeaves;
const listingleavesforUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userLeavelist = yield leaveModel_1.default.find({ userId: userId }).populate('userId');
        if (!userLeavelist) {
            res.status(400).json({ message: 'User Dont have Leave Requests' });
            return;
        }
        res.status(200).json({ leaves: userLeavelist });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error fething leave requests' });
    }
});
exports.listingleavesforUser = listingleavesforUser;
const listdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leaveId } = req.params;
        const details = yield leaveModel_1.default.findById(leaveId).populate('userId');
        if (!details) {
            res.status(400).json({ message: 'details not found' });
            return;
        }
        res.status(200).json({ leave: details });
    }
    catch (error) {
    }
});
exports.listdetails = listdetails;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, userId, comment } = req.body;
    const { leaveId } = req.params;
    console.log('status change request is her mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmme');
    console.log(leaveId);
    try {
        const userLeave = yield leaveModel_1.default.findById(leaveId);
        if (!userLeave) {
            res.status(404).json({ message: 'invalid action' });
            return;
        }
        const user = userLeave.userId.toString();
        const newNotification = new notificationModel_1.default({
            receiver: user,
            type: 'message',
            message: `Your Leave Request Is : ${action} Date:${new Date(userLeave.startDate).toLocaleDateString()} to ${new Date(userLeave.endDate).toLocaleDateString()}`,
        });
        yield newNotification.save();
        app_1.io.to(user).emit('newNotification', newNotification);
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
            res.status(400).json({ message: 'Invalid action.' });
            return;
        }
        console.log('res is here 1');
        yield userLeave.save();
        res.status(200).json({ message: `Leave status has been Updated` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updateing status' });
    }
});
exports.changeStatus = changeStatus;
const leavepageListingdatas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // list of all employees
        const totalEmployees = yield userModel_1.default.countDocuments();
        // list of working emplyee
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const workingEmployees = yield leaveModel_1.default.countDocuments({
            $or: [
                { startDate: { $gt: today } },
                { endDate: { $lt: today } }
            ],
        });
        const notWorkingempo = yield leaveModel_1.default.countDocuments({ status: 'Approved' });
        // pending leave Requests
        const pendingLeaveRequest = yield leaveModel_1.default.countDocuments({ status: 'Pending' });
        // list of current leave employees
        const startOfDay = new Date(today);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const onLeaveToday = yield leaveModel_1.default.find({
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay },
            status: 'Approved'
        }).populate('userId');
        res.status(200).json({
            totalEmployees,
            workingEmployees: totalEmployees - notWorkingempo,
            pendingLeaveRequest,
            onLeaveToday
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching leave page data', error });
    }
});
exports.leavepageListingdatas = leavepageListingdatas;
const managerLeaveMng = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        console.log('request is here');
        const managerDetails = yield userModel_1.default.findById(managerId);
        if (!managerDetails) {
            res.status(404).json({ message: 'Manager not found' });
            return;
        }
        const managerDepId = managerDetails.department;
        const users = yield userModel_1.default.find({ department: managerDepId, position: 'Employee' });
        if (!users || users.length === 0) {
            res.status(400).json({ message: 'No Users Found' });
            return;
        }
        const userIds = users.map(user => user._id); // Collect all user IDs
        const leaves = yield leaveModel_1.default.find({ userId: { $in: userIds } }).populate('userId'); // Find leaves for all users
        res.status(200).json({ leaves });
    }
    catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.managerLeaveMng = managerLeaveMng;

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
exports.setNewEmailService = exports.resetEmailService = exports.generateOtp = exports.employeeDetailsService = exports.dashboardDataService = exports.changePasswordService = exports.resetPassRequestService = exports.updateProfileService = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const MeetingModal_1 = require("../../meetings/model/MeetingModal");
const taskModel_1 = __importDefault(require("../../TaskManagement/models/taskModel"));
const payrollModel_1 = __importDefault(require("../../PayrollManagement/models/payrollModel"));
const leaveModel_1 = __importDefault(require("../../leaveManagement/models/leaveModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const resetPass_1 = __importDefault(require("../middlewares/resetPass"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS,
    },
});
// Business logic functions
const updateProfileService = (userId, updateData, profileImageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
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
    const updatedUser = yield user.save();
    return updatedUser;
});
exports.updateProfileService = updateProfileService;
const resetPassRequestService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield userModel_1.default.findById(userId);
    if (!existUser) {
        throw new Error("User Not Found");
    }
    const token = jsonwebtoken_1.default.sign({ userId: existUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const resetLink = `${process.env.FRONTENDAPI}/employee/reset-password?token=${token}`;
    yield (0, resetPass_1.default)(existUser.email, resetLink);
    return { message: "Verification Link sent Success" };
});
exports.resetPassRequestService = resetPassRequestService;
const changePasswordService = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token || !password) {
        throw new Error("Invalid request");
    }
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId;
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    user.password = hashedPassword;
    yield user.save();
    return { message: "Password has been reset successfully" };
});
exports.changePasswordService = changePasswordService;
const dashboardDataService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const upcomingMeetings = yield MeetingModal_1.Meeting.find({
        participants: userId,
        date: { $gte: new Date() },
        status: 'scheduled'
    });
    const tasks = yield taskModel_1.default.find({ assignedTo: userId });
    const payrollData = yield payrollModel_1.default.find({ employee: userId });
    const leaveRequests = yield leaveModel_1.default.find({ userId });
    return {
        upcomingMeetings,
        tasks,
        payrollData,
        leaveRequests
    };
});
exports.dashboardDataService = dashboardDataService;
const employeeDetailsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userdata = yield userModel_1.default.findById(userId);
    if (!userdata) {
        throw new Error("User Not Found");
    }
    return { userdata };
});
exports.employeeDetailsService = employeeDetailsService;
const generateOtp = () => {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string if needed
};
exports.generateOtp = generateOtp;
const resetEmailService = (userId, newEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const oldUserdata = yield userModel_1.default.findOne({ email: newEmail });
    if (oldUserdata) {
        throw new Error("The email is already taken");
    }
    const userData = yield userModel_1.default.findById(userId);
    if (!userData) {
        throw new Error("User Not found");
    }
    const otp = (0, exports.generateOtp)();
    // Send email notification
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: `OTP - Email Change ${userData.email}`,
        text: `Your email resent OTP is : ${otp}`
    };
    yield new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                reject(error);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });
    });
    return { otp };
});
exports.resetEmailService = resetEmailService;
const setNewEmailService = (userId, newEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield userModel_1.default.findOne({ email: newEmail });
    if (existEmail) {
        throw new Error("The Email is already taken");
    }
    const userData = yield userModel_1.default.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
    if (!userData) {
        throw new Error("User Not Found");
    }
    return { message: "User email Updated success" };
});
exports.setNewEmailService = setNewEmailService;

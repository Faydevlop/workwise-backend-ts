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
exports.setNewEmail = exports.resetEmail = exports.employeedetails = exports.dashboardData = exports.ChangePassword = exports.resetPassRequest = exports.updateProfile = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resetPass_1 = __importDefault(require("../middlewares/resetPass"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const MeetingModal_1 = require("../../meetings/model/MeetingModal");
const taskModel_1 = __importDefault(require("../../TaskManagement/models/taskModel"));
const payrollModel_1 = __importDefault(require("../../PayrollManagement/models/payrollModel"));
const leaveModel_1 = __importDefault(require("../../leaveManagement/models/leaveModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS,
    },
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Update user fields
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.phone = req.body.phone || user.phone;
        user.gender = req.body.gender || user.gender;
        user.address = req.body.address || user.address;
        // Update profile image if it exists
        if (req.file) {
            // Cloudinary will have already handled the upload at this point
            // The URL of the uploaded image is available in `req.file.path` (after multer processes it)
            const uploadedImageUrl = req.file.path;
            // Save the Cloudinary URL to the user's profile image field
            user.profileImageUrl = uploadedImageUrl;
        }
        const updatedUser = yield user.save();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateProfile = updateProfile;
const resetPassRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const existUser = yield userModel_1.default.findById(userId);
        if (!existUser) {
            res.status(401).json({ message: "User Not Found" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: existUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const resetLink = `${process.env.FRONTENDAPI}/employee/reset-password?token=${token}`;
        yield (0, resetPass_1.default)(existUser.email, resetLink);
        res.status(201).json({ message: "Verification Link sent Success" });
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.resetPassRequest = resetPassRequest;
const ChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "invalid request" });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decode.userId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.ChangePassword = ChangePassword;
const dashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const upcomingMeetings = yield MeetingModal_1.Meeting.find({
            participants: userId,
            date: { $gte: new Date() },
            status: 'scheduled'
        });
        const tasks = yield taskModel_1.default.find({ assignedTo: userId });
        const payrollData = yield payrollModel_1.default.find({ employee: userId });
        const leaveRequests = yield leaveModel_1.default.find({ userId });
        res.status(200).json({
            upcomingMeetings,
            tasks,
            payrollData,
            leaveRequests
        });
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.dashboardData = dashboardData;
const employeedetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userdata = yield userModel_1.default.findById(userId);
        if (!userdata) {
            res.status(400).json({ message: 'User Not Found' });
            return;
        }
        res.status(200).json({ userdata });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.employeedetails = employeedetails;
function generateOtp() {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string if needed
}
const resetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { newEmail } = req.body;
        const oldUserdata = yield userModel_1.default.findOne({ email: newEmail });
        if (oldUserdata) {
            res.status(400).json({ message: 'The email is already taken' });
            return;
        }
        const userData = yield userModel_1.default.findById(userId);
        if (!userData) {
            res.status(400).json({ message: 'User Not found' });
            return;
        }
        const otp = generateOtp();
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newEmail, // Change this to the recipient's email
            subject: `OTP - Email Change ${userData.email}`,
            text: `
  
  
  Your email resent OTP is : ${otp}
  
  
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
        res.status(200).json({ otp });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.resetEmail = resetEmail;
const setNewEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { newEmail } = req.body;
        const existEmail = yield userModel_1.default.findOne({ email: newEmail });
        if (existEmail) {
            res.status(400).json({ message: 'The Email is already taken' });
            return;
        }
        const userData = yield userModel_1.default.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
        if (!userData) {
            res.status(400).json({ message: 'User Not Found' });
            return;
        }
        res.status(200).json({ message: 'User email Updated success' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.setNewEmail = setNewEmail;

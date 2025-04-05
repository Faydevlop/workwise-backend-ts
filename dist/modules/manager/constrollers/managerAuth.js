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
exports.ManagerDashboard = exports.managerLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const jwt_1 = require("../../../middlewares/jwt");
const projectModel_1 = __importDefault(require("../../admin/models/projectModel"));
const leaveModel_1 = __importDefault(require("../../leaveManagement/models/leaveModel"));
const MeetingModal_1 = require("../../meetings/model/MeetingModal");
const managerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: 'User not found Please' });
            return;
        }
        const passMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passMatch) {
            res.status(400).json({ message: 'Wrong Password' });
            return;
        }
        if (user.employeeStatus === 'inactive') {
            res.status(400).json({ message: "Account inactive" });
            return;
        }
        if (user.position != 'Manager') {
            res.status(400).json({ message: 'Manager Not Found in this credentials' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id); // Corrected here
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent over HTTPS in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ accessToken, manager: user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occured during login' });
    }
});
exports.managerLogin = managerLogin;
const ManagerDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        console.log('request is here as manager');
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
        const upcomingMeetings = yield MeetingModal_1.Meeting.find({
            createdBy: managerId,
            status: 'scheduled'
        });
        const projects = yield projectModel_1.default.find({ department: managerDepId });
        res.status(200).json({ leaves, upcomingMeetings, projects, });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occured during login' });
    }
});
exports.ManagerDashboard = ManagerDashboard;

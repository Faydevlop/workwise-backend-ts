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
exports.getManagerDashboardData = exports.authenticateManager = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const jwt_1 = require("../../../middlewares/jwt");
const projectModel_1 = __importDefault(require("../../admin/models/projectModel"));
const leaveModel_1 = __importDefault(require("../../leaveManagement/models/leaveModel"));
const MeetingModal_1 = require("../../meetings/model/MeetingModal");
const authenticateManager = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: email });
    if (!user) {
        return { success: false, message: 'User not found Please' };
    }
    const passMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!passMatch) {
        return { success: false, message: 'Wrong Password' };
    }
    if (user.employeeStatus === 'inactive') {
        return { success: false, message: 'Account inactive' };
    }
    if (user.position != 'Manager') {
        return { success: false, message: 'Manager Not Found in this credentials' };
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id);
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return {
        success: true,
        accessToken,
        refreshToken,
        manager: user
    };
});
exports.authenticateManager = authenticateManager;
const getManagerDashboardData = (managerId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const upcomingMeetings = yield MeetingModal_1.Meeting.find({
        createdBy: managerId,
        status: 'scheduled'
    });
    const projects = yield projectModel_1.default.find({ department: managerDepId });
    return {
        success: true,
        data: {
            leaves,
            upcomingMeetings,
            projects
        }
    };
});
exports.getManagerDashboardData = getManagerDashboardData;

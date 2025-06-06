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
exports.changeAdminPassword = exports.fetchDashboardData = exports.removeUser = exports.updateUserDetails = exports.fetchUserById = exports.fetchAllUsers = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const leaveModel_1 = __importDefault(require("../../leaveManagement/models/leaveModel"));
const departmentModel_1 = __importDefault(require("../../Department/model/departmentModel"));
const payrollModel_1 = __importDefault(require("../../PayrollManagement/models/payrollModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const mailVerification_1 = __importDefault(require("../middlewares/mailVerification"));
function generateRandomPassword(length = 12) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, dob, phone, gender, address, position, dateOfJoining, employeeStatus, } = userData;
    const existUser = yield userModel_1.default.findOne({ email });
    if (existUser) {
        throw new Error("User already Exists In this Email");
    }
    const randomPass = generateRandomPassword();
    const hashedPassword = yield bcrypt_1.default.hash(randomPass, 10);
    const newUser = new userModel_1.default({
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
    yield (0, mailVerification_1.default)(email, randomPass, position);
    console.log('Password:', randomPass);
    yield newUser.save();
    return newUser;
});
exports.createUser = createUser;
const fetchAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield userModel_1.default.find().populate('department');
    if (!allUsers || allUsers.length === 0) {
        throw new Error("Users collection is empty");
    }
    return allUsers;
});
exports.fetchAllUsers = fetchAllUsers;
const fetchUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId).populate('department');
    if (!user) {
        throw new Error("User Not found");
    }
    return user;
});
exports.fetchUserById = fetchUserById;
const updateUserDetails = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
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
    const updatedUser = yield user.save();
    return updatedUser;
});
exports.updateUserDetails = updateUserDetails;
const removeUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndDelete(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return { success: true, message: "User delete successful" };
});
exports.removeUser = removeUser;
const fetchDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    const leaves = yield leaveModel_1.default.find({ status: 'Pending' }).populate('userId');
    const department = yield departmentModel_1.default.find();
    const payroll = yield payrollModel_1.default.find().populate('employee');
    const projects = yield projectModel_1.default.find().populate('department');
    return { leaves, department, payroll, projects };
});
exports.fetchDashboardData = fetchDashboardData;
const changeAdminPassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield adminModel_1.default.findById(userId);
    if (!admin) {
        throw new Error("Admin Not Found");
    }
    const isMatch = yield bcrypt_1.default.compare(oldPassword, admin.password);
    if (!isMatch) {
        throw new Error("Incorrect Old Password");
    }
    const saltRounds = 10;
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
    admin.password = hashedNewPassword;
    yield admin.save();
    return { success: true, message: "Password changed successfully" };
});
exports.changeAdminPassword = changeAdminPassword;

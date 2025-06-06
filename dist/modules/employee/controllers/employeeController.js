"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNewEmail = exports.resetEmail = exports.employeedetails = exports.dashboardData = exports.ChangePassword = exports.resetPassRequest = exports.updateProfile = void 0;
const employeeService = __importStar(require("../serviecs/employeeService"));
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.params;
        const profileImageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const updatedUser = yield employeeService.updateProfileService(userId, req.body, profileImageUrl);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(error.message === "User not found" ? 404 : 500).json({
            message: error.message || "Server error"
        });
    }
});
exports.updateProfile = updateProfile;
const resetPassRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield employeeService.resetPassRequestService(userId);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        res.status(error.message === "User Not Found" ? 401 : 500).json({
            message: error.message || "Server error"
        });
    }
});
exports.resetPassRequest = resetPassRequest;
const ChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const result = yield employeeService.changePasswordService(token, password);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error resetting password:", error);
        if (error.message === "Invalid request" || error.message === "User not found") {
            return res.status(400).json({ message: error.message });
        }
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
        const data = yield employeeService.dashboardDataService(userId);
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(error.message === "Unauthorized" ? 401 : 500).json({
            message: error.message || "Internal server error"
        });
    }
});
exports.dashboardData = dashboardData;
const employeedetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield employeeService.employeeDetailsService(userId);
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(error.message === "User Not Found" ? 400 : 500).json({
            message: error.message || "Internal server error"
        });
    }
});
exports.employeedetails = employeedetails;
const resetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { newEmail } = req.body;
        const result = yield employeeService.resetEmailService(userId, newEmail);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error resetting email:', error);
        if (error.message === "The email is already taken" || error.message === "User Not found") {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.resetEmail = resetEmail;
const setNewEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { newEmail } = req.body;
        const result = yield employeeService.setNewEmailService(userId, newEmail);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error setting new email:', error);
        if (error.message === "The Email is already taken" || error.message === "User Not Found") {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.setNewEmail = setNewEmail;

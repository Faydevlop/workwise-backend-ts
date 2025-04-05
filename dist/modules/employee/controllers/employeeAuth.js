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
exports.employeeLogout = exports.employeeLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../../middlewares/jwt");
const employeeLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User Not Found" });
            return;
        }
        const passMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passMatch) {
            res.status(400).json({ message: "Wrong password" });
            return;
        }
        if (user.employeeStatus === 'inactive') {
            res.status(400).json({ message: "Account inactive" });
            return;
        }
        if (user.position != 'Employee') {
            res.status(400).json({ message: 'Employee Not Found in this credentials' });
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
        res.status(200).json({ accessToken, user: user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred during login" });
    }
});
exports.employeeLogin = employeeLogin;
// controllers/authController.ts or wherever your employeeLogin is
const employeeLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: "Logout failed" });
    }
});
exports.employeeLogout = employeeLogout;

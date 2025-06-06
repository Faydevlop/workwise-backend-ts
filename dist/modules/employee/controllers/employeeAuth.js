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
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeLogout = exports.employeeLogin = void 0;
const employeeAuthService_1 = require("../serviecs/employeeAuthService");
const employeeLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        try {
            const { accessToken, refreshToken, user } = yield (0, employeeAuthService_1.loginService)(email, password);
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(200).json({ accessToken, user });
        }
        catch (serviceError) {
            // Handle specific error messages from service
            res.status(400).json({ message: serviceError.message });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred during login" });
    }
});
exports.employeeLogin = employeeLogin;
const employeeLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, employeeAuthService_1.logoutService)();
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: "Logout failed" });
    }
});
exports.employeeLogout = employeeLogout;

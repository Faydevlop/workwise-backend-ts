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
exports.managerDashboard = exports.managerLogin = void 0;
const managerService_1 = require("../services/managerService");
const managerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield (0, managerService_1.authenticateManager)(email, password);
        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ accessToken: result.accessToken, manager: result.manager });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});
exports.managerLogin = managerLogin;
const managerDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        console.log('request is here as manager');
        const result = yield (0, managerService_1.getManagerDashboardData)(managerId);
        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        res.status(200).json(result.data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
    }
});
exports.managerDashboard = managerDashboard;

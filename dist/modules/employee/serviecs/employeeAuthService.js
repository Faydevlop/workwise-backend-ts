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
exports.logoutService = exports.loginService = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../../middlewares/jwt");
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        throw new Error("User Not Found");
    }
    const passMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!passMatch) {
        throw new Error("Wrong password");
    }
    if (user.employeeStatus === 'inactive') {
        throw new Error("Account inactive");
    }
    if (user.position != 'Employee') {
        throw new Error("Employee Not Found in this credentials");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id);
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return {
        accessToken,
        refreshToken,
        user
    };
});
exports.loginService = loginService;
const logoutService = () => __awaiter(void 0, void 0, void 0, function* () {
    return { message: "Logged out successfully" };
});
exports.logoutService = logoutService;

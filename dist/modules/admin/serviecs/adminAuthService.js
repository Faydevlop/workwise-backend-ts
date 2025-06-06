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
exports.authenticateAdmin = exports.createAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const jwt_1 = require("../../../middlewares/jwt");
const createAdmin = (adminData) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = adminData;
    const existingUser = yield adminModel_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("Admin already exists. Please login.");
    }
    const hashedpassword = yield bcrypt_1.default.hash(password, 12);
    const newAdmin = new adminModel_1.default({
        username,
        email,
        password: hashedpassword,
    });
    yield newAdmin.save();
    const accessToken = (0, jwt_1.generateAccessToken)(newAdmin._id);
    const refreshToken = jsonwebtoken_1.default.sign({ userId: newAdmin._id }, process.env.JWT_REFRESH_SECRET || 'workwise', { expiresIn: '7d' });
    return { accessToken, refreshToken, admin: newAdmin };
});
exports.createAdmin = createAdmin;
const authenticateAdmin = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    const user = yield adminModel_1.default.findOne({ email });
    if (!user) {
        throw new Error("User Not found Please login");
    }
    const passMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!passMatch) {
        throw new Error("Wrong Password");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id);
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || 'workwise', { expiresIn: '7d' });
    return { accessToken, refreshToken, admin: user };
});
exports.authenticateAdmin = authenticateAdmin;

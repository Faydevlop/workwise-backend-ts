"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET;
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (!decoded.userId) {
            console.log('no token');
            return res.status(403).json({ message: 'Token missing user ID' });
        }
        req.user = { id: decoded.userId };
        next();
    }
    catch (err) {
        console.error("JWT Error:", err);
        console.log('no token fouund error');
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateJWT = authenticateJWT;

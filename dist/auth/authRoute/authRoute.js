"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jwt_1 = require("../../middlewares/jwt");
const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }
    const decoded = (0, jwt_1.verifyRefreshToken)(token);
    if (!decoded) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
    }
    const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.userId);
    res.status(200).json({ accessToken: newAccessToken });
};
exports.refreshToken = refreshToken;

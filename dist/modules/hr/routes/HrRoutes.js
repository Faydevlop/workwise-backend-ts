"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HrAuth_1 = require("../controllers/HrAuth");
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// Hr Login
router.post('/login', HrAuth_1.HrLogin);
// hr dashboard 
router.get('/dashboard/:userId', jwtMiddleware_1.authenticateJWT, HrAuth_1.hrDashboard);
exports.default = router;

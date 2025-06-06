"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const managerAuth_1 = require("../constrollers/managerAuth");
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// manager Login
router.post('/login', managerAuth_1.managerLogin);
// manager dashboard
router.get('/dashboard/:managerId', jwtMiddleware_1.authenticateJWT, managerAuth_1.managerDashboard);
exports.default = router;

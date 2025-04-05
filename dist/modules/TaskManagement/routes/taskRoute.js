"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const upload_1 = __importDefault(require("../../recruitment/middlewares/upload"));
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// create task route
router.post('/createtask/:ProjectId', jwtMiddleware_1.authenticateJWT, taskController_1.CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId', jwtMiddleware_1.authenticateJWT, taskController_1.listUsers);
// list task details 
router.get(`/taskdetails/:taskId`, jwtMiddleware_1.authenticateJWT, taskController_1.taskdetails);
// listing tasks based on employee
router.get('/listtasks/:employeeId', jwtMiddleware_1.authenticateJWT, taskController_1.listTasks);
// route for attach files
router.post('/attachments/:taskId', jwtMiddleware_1.authenticateJWT, upload_1.default.single('attachments'), taskController_1.uploadAttachments);
// route for geting attachment based on the task id
router.get('/attach/:taskId', jwtMiddleware_1.authenticateJWT, taskController_1.listAttachments);
// delete task route
router.post('/deletetask/:taskId', jwtMiddleware_1.authenticateJWT, taskController_1.deleteTask);
exports.default = router;

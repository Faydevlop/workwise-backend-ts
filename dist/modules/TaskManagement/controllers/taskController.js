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
exports.deleteTask = exports.listAttachments = exports.listTasks = exports.taskdetails = exports.listUsers = exports.uploadAttachments = exports.CreateTask = void 0;
const taskService_1 = __importDefault(require("../services/taskService"));
const CreateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('task create request is here');
    const { ProjectId } = req.params;
    const { taskTitle, status, assignedTo, priority, startDate, dueDate, description, cat } = req.body;
    try {
        const result = yield taskService_1.default.createTask(ProjectId, taskTitle, description, status, dueDate, assignedTo, startDate, priority, cat);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        if (error.message === 'Project not found') {
            res.status(200).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Error creating project" });
        }
    }
});
exports.CreateTask = CreateTask;
const uploadAttachments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        console.log('file data is here');
        // Check if a file is present
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }
        // File URL returned by Cloudinary
        const fileUrl = req.file.path; // Cloudinary URL
        const fileName = req.file.originalname; // Original file name
        const result = yield taskService_1.default.uploadAttachment(taskId, fileUrl, fileName);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Upload error:", error);
        if (error.message === 'Task not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.uploadAttachments = uploadAttachments;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('user list request is here');
    try {
        const { ProjectId } = req.params;
        const result = yield taskService_1.default.getProjectUsers(ProjectId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Project not found' || error.message === 'Department not found') {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error });
        }
    }
});
exports.listUsers = listUsers;
const taskdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const result = yield taskService_1.default.getTaskDetails(taskId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Task is not found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error });
        }
    }
});
exports.taskdetails = taskdetails;
const listTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.params;
        const tasks = yield taskService_1.default.getEmployeeTasks(employeeId);
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.listTasks = listTasks;
const listAttachments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const result = yield taskService_1.default.getTaskAttachments(taskId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error listing attachments:', error);
        if (error.message === 'Task not found') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.listAttachments = listAttachments;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const result = yield taskService_1.default.deleteTask(taskId);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        if (error.message === 'Task not found or unable to delete the Task') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'An error occurred while deleting the task' });
    }
});
exports.deleteTask = deleteTask;

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
exports.TaskService = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const projectModel_1 = __importDefault(require("../../admin/models/projectModel"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
class TaskService {
    createTask(projectId, taskTitle, description, status, dueDate, assignedTo, startDate, priority, cat) {
        return __awaiter(this, void 0, void 0, function* () {
            const isProjectExist = yield projectModel_1.default.findById(projectId);
            if (!isProjectExist) {
                throw new Error('Project not found');
            }
            const newTask = new taskModel_1.default({
                projectId,
                name: taskTitle,
                description,
                status,
                dueDate,
                assignedTo,
                createdAt: startDate,
                priority,
                cat
            });
            yield newTask.save();
            return { message: 'task created successfully' };
        });
    }
    uploadAttachment(taskId, fileUrl, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileUrl || !fileName) {
                throw new Error('No file provided');
            }
            const updatedTask = yield taskModel_1.default.findByIdAndUpdate(taskId, {
                $push: {
                    attachments: {
                        fileName,
                        fileUrl,
                        uploadedAt: new Date(),
                    },
                },
            }, { new: true });
            if (!updatedTask) {
                throw new Error('Task not found');
            }
            return { message: 'Attachment uploaded successfully', task: updatedTask };
        });
    }
    getProjectUsers(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectDetails = yield projectModel_1.default.findById(projectId);
            if (!projectDetails) {
                throw new Error('Project not found');
            }
            const userDetails = yield userModel_1.default.find({
                department: projectDetails.department,
                position: 'Employee'
            });
            return { users: userDetails };
        });
    }
    getTaskDetails(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskDetails = yield taskModel_1.default.findById(taskId).populate('assignedTo');
            if (!taskDetails) {
                throw new Error('Task is not found');
            }
            return { task: taskDetails };
        });
    }
    getEmployeeTasks(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield taskModel_1.default.find({ assignedTo: employeeId })
                .populate('projectId')
                .populate('assignedTo')
                .populate('comments');
            return tasks;
        });
    }
    getTaskAttachments(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskDetails = yield taskModel_1.default.findById(taskId, 'attachments');
            if (!taskDetails) {
                throw new Error('Task not found');
            }
            return { attachments: taskDetails.attachments };
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedTask = yield taskModel_1.default.findByIdAndDelete(taskId);
            if (!deletedTask) {
                throw new Error('Task not found or unable to delete the Task');
            }
            return { message: 'Task deleted successfully' };
        });
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();

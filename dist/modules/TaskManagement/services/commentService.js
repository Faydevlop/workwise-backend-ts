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
exports.CommentService = void 0;
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
class CommentService {
    createComment(commentedBy, comment, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!commentedBy || !comment) {
                throw new Error("Please fill all the forms");
            }
            const newComment = new commentsModel_1.default({
                commentedBy,
                comment,
                taskId
            });
            yield newComment.save();
            return { message: 'Comment Added Successful' };
        });
    }
    listComments(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield commentsModel_1.default.find({ taskId })
                .populate('commentedBy');
            if (!comments || comments.length === 0) {
                throw new Error('No Comments');
            }
            return { comments };
        });
    }
    updateTaskStatus(taskId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            if (!status || !['Pending', 'InProgress', 'Completed'].includes(status)) {
                throw new Error('Invalid status');
            }
            // Update the task status
            const updatedTask = yield taskModel_1.default.findByIdAndUpdate(taskId, { status }, { new: true } // Return the updated task
            );
            if (!updatedTask) {
                throw new Error('Task not found');
            }
            return updatedTask;
        });
    }
}
exports.CommentService = CommentService;
exports.default = new CommentService();

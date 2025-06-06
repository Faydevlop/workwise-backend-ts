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
exports.updatestatus = exports.listComments = exports.createComment = void 0;
const commentService_1 = __importDefault(require("../services/commentService"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { commentedBy, comment } = req.body;
    try {
        const result = yield commentService_1.default.createComment(commentedBy, comment, taskId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createComment = createComment;
const listComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const result = yield commentService_1.default.listComments(taskId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.listComments = listComments;
const updatestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTask = yield commentService_1.default.updateTaskStatus(id, status);
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task status:', error);
        if (error.message === 'Invalid status') {
            res.status(400).json({ message: error.message });
        }
        else if (error.message === 'Task not found') {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});
exports.updatestatus = updatestatus;

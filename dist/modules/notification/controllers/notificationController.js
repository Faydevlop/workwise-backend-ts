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
exports.eachUserNotification = exports.getUsersSortedByLastMessage = exports.checkNotification = exports.createNotification = void 0;
const notificationService_1 = __importDefault(require("../services/notificationService"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, roomId } = req.body;
    try {
        const result = yield notificationService_1.default.createNotification(senderId, receiverId, roomId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ error: 'Failed to send video call notification' });
    }
});
exports.createNotification = createNotification;
const checkNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const notifications = yield notificationService_1.default.checkNotification(userId);
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error("Error checking notifications:", error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
exports.checkNotification = checkNotification;
const getUsersSortedByLastMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId } = req.params;
        const result = yield notificationService_1.default.getUsersSortedByLastMessage(currentUserId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching users sorted by last message:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});
exports.getUsersSortedByLastMessage = getUsersSortedByLastMessage;
const eachUserNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log('notification req is here');
        const result = yield notificationService_1.default.getUserNotifications(userId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No Notifications') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error fetching user notifications:", error);
            res.status(500).json({ message: "Error fetching data" });
        }
    }
});
exports.eachUserNotification = eachUserNotification;

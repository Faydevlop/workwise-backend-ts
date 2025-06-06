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
exports.includedMeetingList = exports.listingallUser = exports.updateMeeting = exports.listforEdit = exports.meetinglist = exports.nextmeet = exports.deleteMeeting = exports.listUser = exports.findusers = exports.createMeeting = void 0;
const meetingService_1 = __importDefault(require("../services/meetingService"));
const MeetingModal_1 = require("../model/MeetingModal");
const createMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield meetingService_1.default.createMeeting(userId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Please fill all the required forms') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error creating meeting:", error);
            res.status(500).json({ message: 'Meeting Schedule Error', error });
        }
    }
});
exports.createMeeting = createMeeting;
const findusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield meetingService_1.default.findUsersByDepartment(userId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Error fetching details of user') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error finding users:", error);
            res.status(500).json({ message: 'Meeting Scheduled error', error });
        }
    }
});
exports.findusers = findusers;
const listUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield MeetingModal_1.Meeting.find({ createdBy: userId })
            .populate('participants')
            .sort({ createdAt: -1 }); // latest first
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Meeting not found') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error listing meetings:", error);
            res.status(500).json({ message: 'Error fetching data', error });
        }
    }
});
exports.listUser = listUser;
const deleteMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetingId } = req.params;
        const result = yield meetingService_1.default.deleteMeeting(meetingId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Meeting deleted unsuccessful') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error deleting meeting:", error);
            res.status(500).json({ message: 'Error fetching data', error });
        }
    }
});
exports.deleteMeeting = deleteMeeting;
const nextmeet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield meetingService_1.default.getUpcomingMeetings();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No upcoming meetings found') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error fetching upcoming meetings:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.nextmeet = nextmeet;
const meetinglist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield meetingService_1.default.listMeetingsForParticipant(userId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Message Not found') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error listing meetings for participant:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.meetinglist = meetinglist;
const listforEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('list req is here');
    try {
        const { meetingId } = req.params;
        const result = yield meetingService_1.default.getMeetingDetailsForEdit(meetingId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Meeting details not found') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error getting meeting details for edit:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.listforEdit = listforEdit;
const updateMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetId } = req.params;
        const result = yield meetingService_1.default.updateMeeting(meetId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Meeting not found') {
            res.status(404).json({ message: error.message });
        }
        else {
            console.error("Error updating meeting:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.updateMeeting = updateMeeting;
const listingallUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield meetingService_1.default.listAllUsers();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No users found') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error listing all users:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.listingallUser = listingallUser;
const includedMeetingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield meetingService_1.default.listAllMeetingsForUser(userId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No Meetings Found') {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error listing included meetings:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.includedMeetingList = includedMeetingList;

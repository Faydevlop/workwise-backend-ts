"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.managerLeaveMng = exports.leavepageListingdatas = exports.changeStatus = exports.listdetails = exports.listingleavesforUser = exports.listingLeaves = exports.createLeave = void 0;
const LeaveService = __importStar(require("../services/leaveServices"));
const leaveModel_1 = __importDefault(require("../models/leaveModel"));
const createLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;
        const result = yield LeaveService.createLeaveRequest(userId, leaveType, startDate, endDate, reason);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(201).json({ message: result.message });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
exports.createLeave = createLeave;
const listingLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield LeaveService.getAllLeaves();
        if (!result.success) {
            res.status(400).json({ message: 'Failed to fetch leave page data' });
            return;
        }
        res.status(200).json({ leaves: result.leaves });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leave Requests' });
    }
});
exports.listingLeaves = listingLeaves;
const listingleavesforUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const leaves = yield leaveModel_1.default.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ leaves });
    }
    catch (error) {
        console.error('Leave fetch error:', error);
        res.status(400).json({ message: 'Error fetching leave requests' });
    }
});
exports.listingleavesforUser = listingleavesforUser;
const listdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leaveId } = req.params;
        const result = yield LeaveService.getLeaveDetails(leaveId);
        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        res.status(200).json({ leave: result.leave });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leave details' });
    }
});
exports.listdetails = listdetails;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { action, userId, comment } = req.body;
        const { leaveId } = req.params;
        console.log('status change request is here');
        console.log(leaveId);
        const result = yield LeaveService.updateLeaveStatus(leaveId, action, comment);
        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        res.status(200).json({ message: result.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status' });
    }
});
exports.changeStatus = changeStatus;
const leavepageListingdatas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield LeaveService.getLeaveDashboardData();
        if (!result.success) {
            res.status(400).json({ message: 'Faild to fetch data' });
            return;
        }
        res.status(200).json(result.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leave page data', error });
    }
});
exports.leavepageListingdatas = leavepageListingdatas;
const managerLeaveMng = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        console.log('request is here');
        const result = yield LeaveService.getManagerLeaves(managerId);
        if (!result.success) {
            res.status(404).json({ message: result.message });
            return;
        }
        res.status(200).json({ leaves: result.leaves });
    }
    catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.managerLeaveMng = managerLeaveMng;

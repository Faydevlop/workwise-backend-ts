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
exports.listViewdata = exports.listdataspecific = exports.hrlisting = exports.addPay = exports.showUser = exports.listDepartmetentwise = exports.listspecificId = exports.listallUsers = exports.listEmployee = exports.UpdatePaymentStatus = exports.UpdatePayroll = exports.AddPayroll = void 0;
const payrollService_1 = __importDefault(require("../services/payrollService"));
const AddPayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield payrollService_1.default.addPayroll(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        if (error.message === "All fields are required" || error.message === "User Not Found") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.AddPayroll = AddPayroll;
const UpdatePayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield payrollService_1.default.updatePayroll(id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        if (error.message === "All fields are required") {
            res.status(400).json({ message: error.message });
        }
        else if (error.message === "Payroll record not found") {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.UpdatePayroll = UpdatePayroll;
const UpdatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payrollId, paymentStatus } = req.body;
        const result = yield payrollService_1.default.updatePaymentStatus(payrollId, paymentStatus);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        if (error.message === "Payroll ID and payment status are required") {
            res.status(400).json({ message: error.message });
        }
        else if (error.message === "Payroll record not found") {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.UpdatePaymentStatus = UpdatePaymentStatus;
const listEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield payrollService_1.default.listEmployeesWithoutPayroll();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "No users found without payroll") {
            res.status(400).json({ message: "User not found" });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.listEmployee = listEmployee;
const listallUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield payrollService_1.default.listAllUsersWithPayroll();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "No users found with payroll") {
            res.status(400).json({ message: "Users not found" });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.listallUsers = listallUsers;
const listspecificId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { payrollId } = req.params;
    try {
        const result = yield payrollService_1.default.getPayrollDetails(payrollId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "Payroll details not found") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.listspecificId = listspecificId;
const listDepartmetentwise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        const result = yield payrollService_1.default.listUsersByDepartment(managerId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "Manager information or department not found" ||
            error.message === "No users found in this department") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.listDepartmetentwise = listDepartmetentwise;
const showUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield payrollService_1.default.getUserDetails(userId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.showUser = showUser;
const addPay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('update request is here');
    try {
        const { payrollId } = req.params;
        const { deduction, bonuses } = req.body;
        const result = yield payrollService_1.default.addPayAdjustment(payrollId, deduction || 0, bonuses || 0);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "Payroll details not found") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.addPay = addPay;
const hrlisting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield payrollService_1.default.getAllPayrollData();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "No payroll exists") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.hrlisting = hrlisting;
const listdataspecific = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req is here');
        const { userId } = req.params;
        const result = yield payrollService_1.default.getUserPayroll(userId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === "No payroll data found") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
exports.listdataspecific = listdataspecific;
const listViewdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield payrollService_1.default.getDashboardStats();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.listViewdata = listViewdata;

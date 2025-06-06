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
exports.PayrollService = void 0;
const payrollModel_1 = __importDefault(require("../models/payrollModel"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
class PayrollService {
    /**
     * Calculate total pay based on salary parameters
     */
    calculateTotalPay(baseSalary, bonus, deductions, payPeriod, payPeriodStart, payPeriodEnd) {
        const startDate = new Date(payPeriodStart);
        const endDate = new Date(payPeriodEnd);
        const monthsCount = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) + 1;
        const monthlyBaseSalary = baseSalary / 12;
        const perMonthSalary = Math.round(monthlyBaseSalary + bonus - deductions);
        const totalAmount = Math.round(perMonthSalary * monthsCount);
        return { totalAmount, perMonthSalary };
    }
    /**
     * Add a new payroll record
     */
    addPayroll(payrollData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId, payPeriodStart, payPeriodEnd, payPeriod, baseSalary, bonus = 0, deductions = 0, paymentStatus, paymentMethod } = payrollData;
            // Input validation
            if (!employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod ||
                !baseSalary || !paymentStatus || !paymentMethod) {
                throw new Error("All fields are required");
            }
            // Calculate the total amount and per month salary
            const { totalAmount, perMonthSalary } = this.calculateTotalPay(baseSalary, bonus, deductions, payPeriod, new Date(payPeriodStart), new Date(payPeriodEnd));
            // Create new payroll record
            const newPayroll = new payrollModel_1.default({
                employee: employeeId,
                payPeriodStart,
                payPeriodEnd,
                payPeriod,
                baseSalary,
                bonuses: 0,
                deductions: 0,
                totalAmount,
                permonthsalary: Number(perMonthSalary),
                paymentStatus,
                paymentMethod,
            });
            // Verify employee exists
            const user = yield userModel_1.default.findById(employeeId);
            if (!user) {
                throw new Error("User Not Found");
            }
            // Update user with payroll reference
            user.payroll = newPayroll._id;
            yield user.save();
            // Save payroll record
            yield newPayroll.save();
            return { message: "Payroll record updated successfully", data: newPayroll };
        });
    }
    /**
     * Update an existing payroll record
     */
    updatePayroll(id, payrollData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId, payPeriodStart, payPeriodEnd, payPeriod, baseSalary, bonus = 0, deductions = 0, paymentStatus, paymentMethod } = payrollData;
            // Input validation
            if (!id || !employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod ||
                !baseSalary || !paymentStatus || !paymentMethod) {
                throw new Error("All fields are required");
            }
            // Find the payroll record by ID
            const payroll = yield payrollModel_1.default.findById(id);
            if (!payroll) {
                throw new Error("Payroll record not found");
            }
            // Calculate the total amount and per month salary
            const { totalAmount, perMonthSalary } = this.calculateTotalPay(baseSalary, bonus, deductions, payPeriod, new Date(payPeriodStart), new Date(payPeriodEnd));
            // Update the payroll record
            payroll.employee = employeeId;
            payroll.payPeriodStart = new Date(payPeriodStart);
            payroll.payPeriodEnd = new Date(payPeriodEnd);
            payroll.payPeriod = payPeriod;
            payroll.baseSalary = baseSalary;
            payroll.bonuses = bonus;
            payroll.deductions = deductions;
            payroll.totalAmount = totalAmount;
            payroll.permonthsalary = Number(perMonthSalary);
            payroll.paymentStatus = paymentStatus;
            payroll.paymentMethod = paymentMethod;
            yield payroll.save();
            return { message: "Payroll record updated successfully", data: payroll };
        });
    }
    /**
     * Update payment status
     */
    updatePaymentStatus(payrollId, paymentStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payrollId || !paymentStatus) {
                throw new Error("Payroll ID and payment status are required");
            }
            const payroll = yield payrollModel_1.default.findById(payrollId);
            if (!payroll) {
                throw new Error("Payroll record not found");
            }
            payroll.paymentStatus = paymentStatus;
            // If the payment is made, reset bonuses and deductions
            if (paymentStatus === 'Paid') {
                payroll.bonuses = 0;
                payroll.deductions = 0;
            }
            yield payroll.save();
            return { message: "Payment status updated successfully", data: payroll };
        });
    }
    /**
     * List employees without payroll
     */
    listEmployeesWithoutPayroll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.find({ payroll: null });
            if (!users || users.length === 0) {
                throw new Error("No users found without payroll");
            }
            return { users };
        });
    }
    /**
     * List all users with payroll
     */
    listAllUsersWithPayroll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.find({ payroll: { $ne: null } }).populate('payroll');
            if (!users || users.length === 0) {
                throw new Error("No users found with payroll");
            }
            return { users };
        });
    }
    /**
     * Get specific payroll details
     */
    getPayrollDetails(payrollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payrollDetails = yield payrollModel_1.default.findById(payrollId).populate('employee');
            if (!payrollDetails) {
                throw new Error("Payroll details not found");
            }
            return { employee: payrollDetails };
        });
    }
    /**
     * List users by department
     */
    listUsersByDepartment(managerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const managerInfo = yield userModel_1.default.findById(managerId).populate('department');
            if (!managerInfo || !managerInfo.department) {
                throw new Error("Manager information or department not found");
            }
            const users = yield userModel_1.default.find({
                department: managerInfo.department,
                position: 'Employee'
            }).populate('payroll');
            if (!users || users.length === 0) {
                throw new Error("No users found in this department");
            }
            return { users };
        });
    }
    /**
     * Get user details with payroll
     */
    getUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(userId).populate('payroll');
            if (!user) {
                throw new Error("User not found");
            }
            return { user };
        });
    }
    /**
     * Add bonus or deduction to payroll
     */
    addPayAdjustment(payrollId, deduction, bonuses) {
        return __awaiter(this, void 0, void 0, function* () {
            const payroll = yield payrollModel_1.default.findById(payrollId);
            if (!payroll) {
                throw new Error("Payroll details not found");
            }
            // Update the deduction and bonuses
            payroll.deductions = (payroll.deductions || 0) + Number(deduction);
            payroll.bonuses = (payroll.bonuses || 0) + Number(bonuses);
            payroll.totalAmount = payroll.totalAmount - Number(deduction) + Number(bonuses);
            yield payroll.save();
            return { message: "Payroll details updated successfully" };
        });
    }
    /**
     * List all payroll data for HR
     */
    getAllPayrollData() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPayrollData = yield payrollModel_1.default.find().populate('employee');
            if (!allPayrollData || allPayrollData.length === 0) {
                throw new Error("No payroll exists");
            }
            return { payroll: allPayrollData };
        });
    }
    /**
     * Get specific user payroll
     */
    getUserPayroll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payrollData = yield payrollModel_1.default.findOne({ employee: userId });
            if (!payrollData) {
                throw new Error("No payroll data found");
            }
            return { payroll: payrollData };
        });
    }
    /**
     * Get dashboard statistics
     */
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUser = yield userModel_1.default.find();
            const totalUserNotPayroll = yield userModel_1.default.find({ payroll: null });
            return {
                listView: {
                    totalUser: totalUser.length,
                    nopayrollUser: totalUserNotPayroll.length
                }
            };
        });
    }
}
exports.PayrollService = PayrollService;
exports.default = new PayrollService();

import Payroll from "../models/payrollModel";
import User from "../../employee/models/userModel";
import mongoose from "mongoose";

export class PayrollService {
  /**
   * Calculate total pay based on salary parameters
   */
  calculateTotalPay(
    baseSalary: number,
    bonus: number,
    deductions: number,
    payPeriod: string,
    payPeriodStart: Date,
    payPeriodEnd: Date
  ) {
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
  async addPayroll(payrollData: {
    employeeId: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    payPeriod: string;
    baseSalary: number;
    bonus?: number;
    deductions?: number;
    paymentStatus: string;
    paymentMethod: string;
  }) {
    const { 
      employeeId, 
      payPeriodStart, 
      payPeriodEnd, 
      payPeriod, 
      baseSalary, 
      bonus = 0, 
      deductions = 0, 
      paymentStatus, 
      paymentMethod 
    } = payrollData;

    // Input validation
    if (!employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod || 
        !baseSalary || !paymentStatus || !paymentMethod) {
      throw new Error("All fields are required");
    }

    // Calculate the total amount and per month salary
    const { totalAmount, perMonthSalary } = this.calculateTotalPay(
      baseSalary, 
      bonus, 
      deductions, 
      payPeriod, 
      new Date(payPeriodStart), 
      new Date(payPeriodEnd)
    );

    // Create new payroll record
    const newPayroll = new Payroll({
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
    const user = await User.findById(employeeId);
    if (!user) {
      throw new Error("User Not Found");
    }

    // Update user with payroll reference
    user.payroll = newPayroll._id as mongoose.Schema.Types.ObjectId;
    await user.save();

    // Save payroll record
    await newPayroll.save();

    return { message: "Payroll record updated successfully", data: newPayroll };
  }

  /**
   * Update an existing payroll record
   */
  async updatePayroll(id: string, payrollData: {
    employeeId: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    payPeriod: string;
    baseSalary: number;
    bonus?: number;
    deductions?: number;
    paymentStatus: string;
    paymentMethod: string;
  }) {
    const { 
      employeeId, 
      payPeriodStart, 
      payPeriodEnd, 
      payPeriod, 
      baseSalary, 
      bonus = 0, 
      deductions = 0, 
      paymentStatus, 
      paymentMethod 
    } = payrollData;

    // Input validation
    if (!id || !employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod || 
        !baseSalary || !paymentStatus || !paymentMethod) {
      throw new Error("All fields are required");
    }

    // Find the payroll record by ID
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      throw new Error("Payroll record not found");
    }

    // Calculate the total amount and per month salary
    const { totalAmount, perMonthSalary } = this.calculateTotalPay(
      baseSalary, 
      bonus, 
      deductions, 
      payPeriod, 
      new Date(payPeriodStart), 
      new Date(payPeriodEnd)
    );

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

    await payroll.save();

    return { message: "Payroll record updated successfully", data: payroll };
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(payrollId: string, paymentStatus: string) {
    if (!payrollId || !paymentStatus) {
      throw new Error("Payroll ID and payment status are required");
    }

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
      throw new Error("Payroll record not found");
    }

    payroll.paymentStatus = paymentStatus ;

    // If the payment is made, reset bonuses and deductions
    if (paymentStatus === 'Paid') {
      payroll.bonuses = 0;
      payroll.deductions = 0;
    }

    await payroll.save();
    return { message: "Payment status updated successfully", data: payroll };
  }

  /**
   * List employees without payroll
   */
  async listEmployeesWithoutPayroll() {
    const users = await User.find({ payroll: null });
    if (!users || users.length === 0) {
      throw new Error("No users found without payroll");
    }
    return { users };
  }

  /**
   * List all users with payroll
   */
  async listAllUsersWithPayroll() {
    const users = await User.find({ payroll: { $ne: null } }).populate('payroll');
    if (!users || users.length === 0) {
      throw new Error("No users found with payroll");
    }
    return { users };
  }

  /**
   * Get specific payroll details
   */
  async getPayrollDetails(payrollId: string) {
    const payrollDetails = await Payroll.findById(payrollId).populate('employee');
    if (!payrollDetails) {
      throw new Error("Payroll details not found");
    }
    return { employee: payrollDetails };
  }

  /**
   * List users by department
   */
  async listUsersByDepartment(managerId: string) {
    const managerInfo = await User.findById(managerId).populate('department');
    if (!managerInfo || !managerInfo.department) {
      throw new Error("Manager information or department not found");
    }

    const users = await User.find({
      department: managerInfo.department,
      position: 'Employee'
    }).populate('payroll');

    if (!users || users.length === 0) {
      throw new Error("No users found in this department");
    }

    return { users };
  }

  /**
   * Get user details with payroll
   */
  async getUserDetails(userId: string) {
    const user = await User.findById(userId).populate('payroll');
    if (!user) {
      throw new Error("User not found");
    }
    return { user };
  }

  /**
   * Add bonus or deduction to payroll
   */
  async addPayAdjustment(payrollId: string, deduction: number, bonuses: number) {
    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
      throw new Error("Payroll details not found");
    }

    // Update the deduction and bonuses
    payroll.deductions = (payroll.deductions || 0) + Number(deduction);
    payroll.bonuses = (payroll.bonuses || 0) + Number(bonuses);
    payroll.totalAmount = payroll.totalAmount - Number(deduction) + Number(bonuses);

    await payroll.save();
    return { message: "Payroll details updated successfully" };
  }

  /**
   * List all payroll data for HR
   */
  async getAllPayrollData() {
    const allPayrollData = await Payroll.find().populate('employee');
    if (!allPayrollData || allPayrollData.length === 0) {
      throw new Error("No payroll exists");
    }
    return { payroll: allPayrollData };
  }

  /**
   * Get specific user payroll
   */
  async getUserPayroll(userId: string) {
    const payrollData = await Payroll.findOne({ employee: userId });
    if (!payrollData) {
      throw new Error("No payroll data found");
    }
    return { payroll: payrollData };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const totalUser = await User.find();
    const totalUserNotPayroll = await User.find({ payroll: null });

    return {
      listView: {
        totalUser: totalUser.length,
        nopayrollUser: totalUserNotPayroll.length
      }
    };
  }
}

export default new PayrollService();
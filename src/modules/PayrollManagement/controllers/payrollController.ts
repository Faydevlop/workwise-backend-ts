import { Request, Response } from "express";
import payrollService from "../services/payrollService";

export const AddPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await payrollService.addPayroll(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        console.error(error);
        if (error.message === "All fields are required" || error.message === "User Not Found") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const UpdatePayroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await payrollService.updatePayroll(id, req.body);
        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        if (error.message === "All fields are required") {
            res.status(400).json({ message: error.message });
        } else if (error.message === "Payroll record not found") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const UpdatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { payrollId, paymentStatus } = req.body;
        const result = await payrollService.updatePaymentStatus(payrollId, paymentStatus);
        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        if (error.message === "Payroll ID and payment status are required") {
            res.status(400).json({ message: error.message });
        } else if (error.message === "Payroll record not found") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const listEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await payrollService.listEmployeesWithoutPayroll();
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "No users found without payroll") {
            res.status(400).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const listallUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await payrollService.listAllUsersWithPayroll();
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "No users found with payroll") {
            res.status(400).json({ message: "Users not found" });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const listspecificId = async (req: Request, res: Response) => {
    const { payrollId } = req.params;
    
    try {
        const result = await payrollService.getPayrollDetails(payrollId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "Payroll details not found") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const listDepartmetentwise = async (req: Request, res: Response): Promise<void> => {
    try {
        const { managerId } = req.params;
        const result = await payrollService.listUsersByDepartment(managerId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "Manager information or department not found" || 
            error.message === "No users found in this department") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const showUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const result = await payrollService.getUserDetails(userId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "User not found") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const addPay = async (req: Request, res: Response) => {
    console.log('update request is here');
    
    try {
        const { payrollId } = req.params;
        const { deduction, bonuses } = req.body;
        const result = await payrollService.addPayAdjustment(payrollId, deduction || 0, bonuses || 0);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "Payroll details not found") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const hrlisting = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await payrollService.getAllPayrollData();
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "No payroll exists") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const listdataspecific = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('req is here');
        
        const { userId } = req.params;
        const result = await payrollService.getUserPayroll(userId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "No payroll data found") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

export const listViewdata = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await payrollService.getDashboardStats();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
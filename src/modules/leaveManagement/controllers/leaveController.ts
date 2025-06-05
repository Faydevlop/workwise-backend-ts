import { Request, Response } from "express";
import * as LeaveService from "../services/leaveServices";
import Leave from "../models/leaveModel";

export const createLeave = async (req: Request, res: Response) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const result = await LeaveService.createLeaveRequest(userId, leaveType, startDate, endDate, reason);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    return res.status(201).json({ message: result.message });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const listingLeaves = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await LeaveService.getAllLeaves();
    
    if (!result.success) {
      res.status(400).json({ message: 'Failed to fetch leave page data' });
      return;
    }

    res.status(200).json({ leaves: result.leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leave Requests' });
  }
};

export const listingleavesforUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const leaves = await Leave.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    console.error('Leave fetch error:', error);
    res.status(400).json({ message: 'Error fetching leave requests' });
  }
};

export const listdetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { leaveId } = req.params;
    const result = await LeaveService.getLeaveDetails(leaveId);
    
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(200).json({ leave: result.leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leave details' });
  }
};

export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, userId, comment } = req.body;
    const { leaveId } = req.params;
    console.log('status change request is here');
    console.log(leaveId);
    
    const result = await LeaveService.updateLeaveStatus(leaveId, action, comment);
    
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating status' });
  }
};

export const leavepageListingdatas = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await LeaveService.getLeaveDashboardData();
    
    if (!result.success) {
      res.status(400).json({ message: 'Faild to fetch data' });
      return;
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leave page data', error });
  }
};

export const managerLeaveMng = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId } = req.params;
    console.log('request is here');
    
    const result = await LeaveService.getManagerLeaves(managerId);
    
    if (!result.success) {
      res.status(404).json({ message: result.message });
      return;
    }

    res.status(200).json({ leaves: result.leaves });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'Server Error' });
  }
};
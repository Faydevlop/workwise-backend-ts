import { Request, Response } from "express";
import meetingService from "../services/meetingService";
import { Meeting } from "../model/MeetingModal";

export const createMeeting = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    const result = await meetingService.createMeeting(userId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Please fill all the required forms') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error creating meeting:", error);
      res.status(500).json({ message: 'Meeting Schedule Error', error });
    }
  }
};

export const findusers = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    const result = await meetingService.findUsersByDepartment(userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Error fetching details of user') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error finding users:", error);
      res.status(500).json({ message: 'Meeting Scheduled error', error });
    }
  }
};

export const listUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const result = await Meeting.find({ createdBy: userId })
      .populate('participants')
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Meeting not found') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error listing meetings:", error);
      res.status(500).json({ message: 'Error fetching data', error });
    }
  }
};

export const deleteMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { meetingId } = req.params;
    const result = await meetingService.deleteMeeting(meetingId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Meeting deleted unsuccessful') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error deleting meeting:", error);
      res.status(500).json({ message: 'Error fetching data', error });
    }
  }
};

export const nextmeet = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await meetingService.getUpcomingMeetings();
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'No upcoming meetings found') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error fetching upcoming meetings:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const meetinglist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await meetingService.listMeetingsForParticipant(userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Message Not found') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error listing meetings for participant:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const listforEdit = async (req: Request, res: Response): Promise<void> => {
  console.log('list req is here');
  
  try {
    const { meetingId } = req.params;
    const result = await meetingService.getMeetingDetailsForEdit(meetingId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Meeting details not found') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error getting meeting details for edit:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const updateMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { meetId } = req.params;
    const result = await meetingService.updateMeeting(meetId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Meeting not found') {
      res.status(404).json({ message: error.message });
    } else {
      console.error("Error updating meeting:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const listingallUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await meetingService.listAllUsers();
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'No users found') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error listing all users:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const includedMeetingList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await meetingService.listAllMeetingsForUser(userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'No Meetings Found') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error listing included meetings:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
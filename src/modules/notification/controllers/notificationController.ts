import { Request, Response } from "express";
import notificationService from "../services/notificationService";

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  const { senderId, receiverId, roomId } = req.body;

  try {
    const result = await notificationService.createNotification(senderId, receiverId, roomId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: 'Failed to send video call notification' });
  }
};

export const checkNotification = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    const notifications = await notificationService.checkNotification(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error checking notifications:", error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getUsersSortedByLastMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentUserId } = req.params;
    const result = await notificationService.getUsersSortedByLastMessage(currentUserId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users sorted by last message:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const eachUserNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    console.log('notification req is here');
    
    const result = await notificationService.getUserNotifications(userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'No Notifications') {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error fetching user notifications:", error);
      res.status(500).json({ message: "Error fetching data" });
    }
  }
};
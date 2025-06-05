import notificationModel from "../model/notificationModel";
import mongoose from "mongoose";
import User from "../../employee/models/userModel";
import Message from "../../chat/chatModel";

export class NotificationService {
  /**
   * Create a new video call notification
   */
  async createNotification(senderId: string, receiverId: string, roomId: string) {
    // Create a new notification in the database
    const newNotification = new notificationModel({
      sender: senderId,
      receiver: receiverId,
      type: 'video-call',
      roomId: roomId,
      timestamp: new Date()
    });

    await newNotification.save();
    return { message: 'Video call notification sent!' };
  }

  /**
   * Check for unread notifications for a user and mark them as sent
   */
  async checkNotification(userId: string) {
    // Find the notification for the user that hasn't been marked as sent
    const notifications = await notificationModel.find({
      receiver: userId,
      isNotificationSend: false
    });

    // If there are notifications, mark them as sent
    if (notifications.length > 0) {
      await notificationModel.updateMany(
        { receiver: userId, isNotificationSend: false },
        { $set: { isNotificationSend: true } }
      );
    }

    return notifications;
  }

  /**
   * Get users sorted by their last message with the current user
   */
  async getUsersSortedByLastMessage(currentUserId: string) {
    // Fetch users who have exchanged messages with the current user
    const latestMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { receiver: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }  // Sort by latest messages first
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$$ROOT" }  // Capture the first (most recent) message for each user
        }
      }
    ]);

    // Extract user IDs from the aggregation result
    const userIdsWithMessages = latestMessages.map((message: { _id: mongoose.Types.ObjectId }) => message._id);

    // Fetch user details for those who have exchanged messages
    let usersWithMessages = await User.find({ _id: { $in: userIdsWithMessages } });

    // Also fetch all other users who haven't exchanged messages yet
    let usersWithoutMessages = await User.find({
      _id: { $nin: [new mongoose.Types.ObjectId(currentUserId), ...userIdsWithMessages] }
    });

    // Combine both sets of users, placing those with recent messages on top
    let allUsers = [
      ...usersWithMessages, // Users with messages (sorted by most recent)
      ...usersWithoutMessages // Users without any message interaction
    ];

    return { users: allUsers };
  }

  /**
   * Get all message notifications for a specific user
   */
  async getUserNotifications(userId: string) {
    const allNotifications = await notificationModel.find({
      receiver: userId,
      type: 'message'
    });

    if (!allNotifications || allNotifications.length === 0) {
      throw new Error('No Notifications');
    }

    return { notifications: allNotifications };
  }
}

export default new NotificationService();
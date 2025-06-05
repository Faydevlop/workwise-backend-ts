import { Meeting } from "../model/MeetingModal";
import User from "../../employee/models/userModel";
import moment from "moment";
import notificationModel from "../../notification/model/notificationModel";
import { io } from "../../../app";

export class MeetingService {
  /**
   * Format time to 24-hour format if it's in 12-hour format
   */
  formatTime(time: string): string {
    let formattedTime = time;
    if (time.match(/(AM|PM)$/i)) {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier.toUpperCase() === "PM" && hours < 12) {
        hours += 12;
      } else if (modifier.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
    return formattedTime;
  }

  /**
   * Create a new meeting and notify participants
   */
  async createMeeting(userId: string, meetingData: {
    meetingName: string;
    date: string;
    participants: string[];
    topic: string;
    meetingLink: string;
    time: string;
  }) {
    const { meetingName, date, participants, topic, meetingLink, time } = meetingData;

    if (!meetingName || !date || !participants || !topic || !meetingLink || !time) {
      throw new Error('Please fill all the required forms');
    }

    // Format time to 24-hour format if needed
    const formattedTime = this.formatTime(time);

    // Create new meeting
    const newMeeting = new Meeting({
      meetingName,
      date,
      participants,
      topic,
      link: meetingLink,
      createdBy: userId,
      time: formattedTime
    });

    await newMeeting.save();

    // Create and send notifications to all participants
    for (const participant of participants) {
      const newNotification = new notificationModel({
        sender: userId,
        receiver: participant,
        type: 'message',
        message: `You have been invited to a meeting: ${meetingName} on ${date} at ${formattedTime}.`,
      });

      await newNotification.save();
      io.to(participant).emit('newNotification', newNotification);
    }

    return { message: 'Meeting Scheduled Successfully' };
  }

  /**
   * Find users in the same department as the specified user
   */
  async findUsersByDepartment(userId: string) {
    const managerDetails = await User.findById(userId);
    
    if (!managerDetails) {
      throw new Error('Error fetching details of user');
    }

    const users = await User.find({ department: managerDetails.department });
    return { users };
  }

  /**
   * List meetings created by a specific user
   */
  async listUserMeetings(userId: string) {
    const meetingDetails = await Meeting.find({ createdBy: userId });

    if (!meetingDetails || meetingDetails.length === 0) {
      throw new Error('Meeting not found');
    }

    return { listData: meetingDetails };
  }

  /**
   * Delete a meeting by its ID
   */
  async deleteMeeting(meetingId: string) {
    const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);

    if (!deletedMeeting) {
      throw new Error('Meeting deleted unsuccessful');
    }

    return { message: 'Meeting deleted successful' };
  }

  /**
   * Get upcoming meetings
   */
  async getUpcomingMeetings() {
    const now = moment();

    // Parse the current date and time for better comparison
    const currentDate = now.startOf('day').toDate();
    const currentTime = now.format('HH:mm');

    // Find all meetings that are scheduled for the future, sorted by date and time
    const upcomingMeetings = await Meeting.find({
      $or: [
        {
          date: { $gt: currentDate }, // Meetings after today
        },
        {
          date: currentDate,
          time: { $gte: currentTime }, // Meetings today but after the current time
          status: 'scheduled',
        }
      ]
    })
    .sort({ date: 1, time: 1 }); // Sort by date and then by time

    if (upcomingMeetings.length === 0) {
      throw new Error('No upcoming meetings found');
    }

    return { upcomingMeetings };
  }

  /**
   * List meetings where the user is a participant
   */
  async listMeetingsForParticipant(userId: string) {
    const listingData = await Meeting.find({ participants: { $in: [userId] } });

    if (!listingData || listingData.length === 0) {
      throw new Error('Message Not found');
    }

    return { data: listingData };
  }

  /**
   * Get meeting details for editing
   */
  async getMeetingDetailsForEdit(meetingId: string) {
    const meetDetails = await Meeting.findById(meetingId);

    if (!meetDetails) {
      throw new Error('Meeting details not found');
    }

    return { meetingData: meetDetails };
  }

  /**
   * Update meeting details
   */
  async updateMeeting(meetId: string, updatedData: {
    meetingName: string;
    date: string;
    participants?: string[];
    meetingLink: string;
    topic: string;
    time: string;
  }) {
    const { meetingName, date, participants, meetingLink, topic, time } = updatedData;

    // Fetch the existing meeting details
    const existingMeeting = await Meeting.findById(meetId);

    if (!existingMeeting) {
      throw new Error('Meeting not found');
    }

    // Create an object to store the fields to update
    const updatedFields: any = {
      meetingName,
      date,
      meetingLink,
      topic,
      time,
    };

    // Only update participants if new participants are provided
    if (participants && participants.length > 0) {
      updatedFields.participants = participants;
    }

    // Update the meeting details
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetId,
      updatedFields,
      { new: true } // return the updated document
    );

    return { message: 'Meeting updated successfully', meetingData: updatedMeeting };
  }

  /**
   * List all users
   */
  async listAllUsers() {
    const allUsers = await User.find();

    if (!allUsers || allUsers.length === 0) {
      throw new Error('No users found');
    }

    return { users: allUsers };
  }

  /**
   * List meetings where the user is either creator or participant
   */
  async listAllMeetingsForUser(userId: string) {
    const meetings = await Meeting.find({
      $or: [
        { createdBy: userId },
        { participants: { $in: [userId] } }
      ]
    });

    if (!meetings || meetings.length === 0) {
      throw new Error('No Meetings Found');
    }

    return { meetings };
  }
}

export default new MeetingService();
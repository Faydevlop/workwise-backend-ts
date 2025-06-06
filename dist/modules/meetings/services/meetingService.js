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
exports.MeetingService = void 0;
const MeetingModal_1 = require("../model/MeetingModal");
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const moment_1 = __importDefault(require("moment"));
const notificationModel_1 = __importDefault(require("../../notification/model/notificationModel"));
const app_1 = require("../../../app");
class MeetingService {
    /**
     * Format time to 24-hour format if it's in 12-hour format
     */
    formatTime(time) {
        let formattedTime = time;
        if (time.match(/(AM|PM)$/i)) {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier.toUpperCase() === "PM" && hours < 12) {
                hours += 12;
            }
            else if (modifier.toUpperCase() === "AM" && hours === 12) {
                hours = 0;
            }
            formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        }
        return formattedTime;
    }
    /**
     * Create a new meeting and notify participants
     */
    createMeeting(userId, meetingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meetingName, date, participants, topic, meetingLink, time } = meetingData;
            if (!meetingName || !date || !participants || !topic || !meetingLink || !time) {
                throw new Error('Please fill all the required forms');
            }
            // Format time to 24-hour format if needed
            const formattedTime = this.formatTime(time);
            // Create new meeting
            const newMeeting = new MeetingModal_1.Meeting({
                meetingName,
                date,
                participants,
                topic,
                link: meetingLink,
                createdBy: userId,
                time: formattedTime
            });
            yield newMeeting.save();
            // Create and send notifications to all participants
            for (const participant of participants) {
                const newNotification = new notificationModel_1.default({
                    sender: userId,
                    receiver: participant,
                    type: 'message',
                    message: `You have been invited to a meeting: ${meetingName} on ${date} at ${formattedTime}.`,
                });
                yield newNotification.save();
                app_1.io.to(participant).emit('newNotification', newNotification);
            }
            return { message: 'Meeting Scheduled Successfully' };
        });
    }
    /**
     * Find users in the same department as the specified user
     */
    findUsersByDepartment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const managerDetails = yield userModel_1.default.findById(userId);
            if (!managerDetails) {
                throw new Error('Error fetching details of user');
            }
            const users = yield userModel_1.default.find({ department: managerDetails.department });
            return { users };
        });
    }
    /**
     * List meetings created by a specific user
     */
    listUserMeetings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const meetingDetails = yield MeetingModal_1.Meeting.find({ createdBy: userId });
            if (!meetingDetails || meetingDetails.length === 0) {
                throw new Error('Meeting not found');
            }
            return { listData: meetingDetails };
        });
    }
    /**
     * Delete a meeting by its ID
     */
    deleteMeeting(meetingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedMeeting = yield MeetingModal_1.Meeting.findByIdAndDelete(meetingId);
            if (!deletedMeeting) {
                throw new Error('Meeting deleted unsuccessful');
            }
            return { message: 'Meeting deleted successful' };
        });
    }
    /**
     * Get upcoming meetings
     */
    getUpcomingMeetings() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = (0, moment_1.default)();
            // Parse the current date and time for better comparison
            const currentDate = now.startOf('day').toDate();
            const currentTime = now.format('HH:mm');
            // Find all meetings that are scheduled for the future, sorted by date and time
            const upcomingMeetings = yield MeetingModal_1.Meeting.find({
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
        });
    }
    /**
     * List meetings where the user is a participant
     */
    listMeetingsForParticipant(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listingData = yield MeetingModal_1.Meeting.find({ participants: { $in: [userId] } });
            if (!listingData || listingData.length === 0) {
                throw new Error('Message Not found');
            }
            return { data: listingData };
        });
    }
    /**
     * Get meeting details for editing
     */
    getMeetingDetailsForEdit(meetingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const meetDetails = yield MeetingModal_1.Meeting.findById(meetingId);
            if (!meetDetails) {
                throw new Error('Meeting details not found');
            }
            return { meetingData: meetDetails };
        });
    }
    /**
     * Update meeting details
     */
    updateMeeting(meetId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meetingName, date, participants, meetingLink, topic, time } = updatedData;
            // Fetch the existing meeting details
            const existingMeeting = yield MeetingModal_1.Meeting.findById(meetId);
            if (!existingMeeting) {
                throw new Error('Meeting not found');
            }
            // Create an object to store the fields to update
            const updatedFields = {
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
            const updatedMeeting = yield MeetingModal_1.Meeting.findByIdAndUpdate(meetId, updatedFields, { new: true } // return the updated document
            );
            return { message: 'Meeting updated successfully', meetingData: updatedMeeting };
        });
    }
    /**
     * List all users
     */
    listAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield userModel_1.default.find();
            if (!allUsers || allUsers.length === 0) {
                throw new Error('No users found');
            }
            return { users: allUsers };
        });
    }
    /**
     * List meetings where the user is either creator or participant
     */
    listAllMeetingsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const meetings = yield MeetingModal_1.Meeting.find({
                $or: [
                    { createdBy: userId },
                    { participants: { $in: [userId] } }
                ]
            });
            if (!meetings || meetings.length === 0) {
                throw new Error('No Meetings Found');
            }
            return { meetings };
        });
    }
}
exports.MeetingService = MeetingService;
exports.default = new MeetingService();

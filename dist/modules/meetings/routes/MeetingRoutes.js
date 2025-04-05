"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MeetingController_1 = require("../controller/MeetingController");
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// Adding New Meeting
router.post('/addmeeting/:userId', jwtMiddleware_1.authenticateJWT, MeetingController_1.createMeeting);
// listing users - add meeting form
router.get('/listuser/:userId', jwtMiddleware_1.authenticateJWT, MeetingController_1.findusers);
// listing meeting details - manager
router.get('/listmeeting/:userId', jwtMiddleware_1.authenticateJWT, MeetingController_1.listUser);
// delete meeting
router.post('/deletemeeting/:meetingId', jwtMiddleware_1.authenticateJWT, MeetingController_1.deleteMeeting);
// show the details of the next meet
router.get('/nextmeet', jwtMiddleware_1.authenticateJWT, MeetingController_1.nextmeet);
// listing for editpage
router.get('/listmeeiting/:meetingId/list', jwtMiddleware_1.authenticateJWT, MeetingController_1.listforEdit);
// meet update route
router.put('/update/:meetId', jwtMiddleware_1.authenticateJWT, MeetingController_1.updateMeeting);
// hr - admin usege routes
// listing all users for add user
router.get('/listallUsers', jwtMiddleware_1.authenticateJWT, MeetingController_1.listingallUser);
// listing of included list manager - hr - admin
router.get('/listincludedmeet/:userId', jwtMiddleware_1.authenticateJWT, MeetingController_1.includedMeetingList);
// listing meeting details for employees
router.get('/listmeeting/:userId/employee', jwtMiddleware_1.authenticateJWT, MeetingController_1.meetinglist);
exports.default = router;

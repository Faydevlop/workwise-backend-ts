import express , {Router} from 'express'
import { createMeeting, deleteMeeting, findusers, includedMeetingList, listforEdit, listingallUser, listUser, meetinglist, nextmeet, updateMeeting } from '../controller/MeetingController';
import { authenticateJWT } from '../../../middlewares/jwtMiddleware';
const router:Router = express.Router();

// Adding New Meeting
router.post('/addmeeting/:userId',authenticateJWT,createMeeting);
// listing users - add meeting form
router.get('/listuser/:userId',authenticateJWT,findusers)
// listing meeting details - manager
router.get('/listmeeting/:userId',authenticateJWT,listUser)
// delete meeting
router.post('/deletemeeting/:meetingId',authenticateJWT,deleteMeeting)
// show the details of the next meet
router.get('/nextmeet',authenticateJWT,nextmeet)
// listing for editpage
router.get('/listmeeiting/:meetingId/list',authenticateJWT,listforEdit)
// meet update route
router.put('/update/:meetId',authenticateJWT,updateMeeting)

// hr - admin usege routes
// listing all users for add user
router.get('/listallUsers',authenticateJWT,listingallUser)
// listing of included list manager - hr - admin
router.get('/listincludedmeet/:userId',authenticateJWT,includedMeetingList)

// listing meeting details for employees
router.get('/listmeeting/:userId/employee',authenticateJWT,meetinglist)


export default router
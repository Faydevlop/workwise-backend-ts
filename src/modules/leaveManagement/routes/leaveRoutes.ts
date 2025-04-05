import express , {Router} from 'express'
import { changeStatus, createLeave, leavepageListingdatas, listdetails, listingLeaves, listingleavesforUser, managerLeaveMng } from '../controllers/leaveController';
import { authenticateJWT } from '../../../middlewares/jwtMiddleware';

const router:Router = express.Router();

// create or apply leave
router.post('/applyLeave',authenticateJWT,createLeave)
// list all leaves - admin
router.get('/getAllLeaves',authenticateJWT,listingLeaves);
// list user specific requests - employee , manager 
router.get('/getleaves/:userId',authenticateJWT,listingleavesforUser)
// leave status managing
router.post('/status/:leaveId',authenticateJWT,changeStatus)
// leave page listing data
router.get('/listdata',authenticateJWT,leavepageListingdatas)
// list deatils of leave request
router.get('/getdetails/:leaveId',authenticateJWT,listdetails);
// leave management for manager to manage leave requests of the employees
router.get('/managerleaveget/:managerId',authenticateJWT,managerLeaveMng)

export default router
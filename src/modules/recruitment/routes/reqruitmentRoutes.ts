import express , {Router} from 'express'
import { createRecruitment, deleteItem, deleteJobapplications, getUserData, listIReq, listrquirements, listspecific, referJob, updataJonlist } from '../controller/requirementController';
import upload from '../middlewares/upload'
import { authenticateJWT } from '../../../middlewares/jwtMiddleware';
const router:Router = express.Router();

// creating job post 
router.post('/createpost',authenticateJWT,createRecruitment)
// listing jobs
router.get('/listitems',authenticateJWT,listrquirements);
// delete job listings
router.delete('/deleteitem/:listId',authenticateJWT,deleteItem)
// refer job route - post
router.post('/referjob',authenticateJWT,upload.single('resume'),referJob)
// listing jobs
router.get('/listJob',authenticateJWT,listIReq) 
// listing sepecific details of the req details
router.get('/listDetails/:reqId',authenticateJWT,listspecific)
// delete job applications 
router.delete('/deleteapplication/:applicationId',authenticateJWT,deleteJobapplications)
// listing data for edit form
router.get('/getdata/:jobId',authenticateJWT,getUserData)
// update job listing data form - post
router.put('/update/:jobId',authenticateJWT,updataJonlist)




export default router
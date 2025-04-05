import express , {Router} from 'express'
import { CreateTask, deleteTask, listAttachments, listTasks, listUsers, taskdetails, uploadAttachments } from '../controllers/taskController';
import upload from '../../recruitment/middlewares/upload';
import { authenticateJWT } from '../../../middlewares/jwtMiddleware';

const router:Router = express.Router();

// create task route
router.post('/createtask/:ProjectId',authenticateJWT,CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId',authenticateJWT,listUsers)
// list task details 
router.get(`/taskdetails/:taskId`,authenticateJWT,taskdetails)
// listing tasks based on employee
router.get('/listtasks/:employeeId',authenticateJWT,listTasks as unknown as express.RequestHandler)
// route for attach files
router.post('/attachments/:taskId',authenticateJWT,upload.single('attachments'),uploadAttachments)
// route for geting attachment based on the task id
router.get('/attach/:taskId',authenticateJWT,listAttachments)
// delete task route
router.post('/deletetask/:taskId',authenticateJWT,deleteTask)



export default router
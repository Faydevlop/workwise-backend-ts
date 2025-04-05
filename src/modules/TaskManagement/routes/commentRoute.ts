import express,{Router} from 'express'
import { createComment, listComments, updatestatus } from '../controllers/commentController';
import { authenticateJWT } from '../../../middlewares/jwtMiddleware';

const router:Router = express.Router();

// Create comment
router.post('/addcomment/:taskId',authenticateJWT,createComment)
// list comments based on the tasks
router.get('/listcomments/:taskId',authenticateJWT,listComments)
// update the the status based on the action
router.put('/updatestatus/:id',authenticateJWT,updatestatus)



export default router
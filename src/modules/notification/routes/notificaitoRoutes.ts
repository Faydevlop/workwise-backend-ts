import express, { Router } from "express";
import { checkNotification, createNotification, eachUserNotification, getUsersSortedByLastMessage } from "../controllers/notificationController";
import { authenticateJWT } from "../../../middlewares/jwtMiddleware";
const router: Router = express.Router();

router.post('/',createNotification)

router.get('/:userId',authenticateJWT,checkNotification)
// getting leatest notification list
router.get('/getlist/:currentUserId',authenticateJWT,getUsersSortedByLastMessage)
// getting normal messages
router.get('/getnotify/:userId',authenticateJWT,eachUserNotification)

export default router;
import express, { Router } from "express";
import { employeeLogin } from "../controllers/employeeAuth";
import {
  ChangePassword,
  dashboardData,
  employeedetails,
  resetEmail,
  resetPassRequest,
  setNewEmail,
  updateProfile,
} from "../controllers/employeeController";
import upload from "../middlewares/upload";
import { protect } from "../../../middlewares/jwtMiddleware";
// import { updatePicture } from '../controllers/employeeController';

const router: Router = express.Router();

// employee Login
router.post("/login", employeeLogin);
// update Profile
router.put(
  "/editprofile/:userId",
  upload.single("profilePhoto"),
  updateProfile
);
// update reset with link
router.post("/reqest-reset-password/:userId", resetPassRequest);
// update password
router.post("/reset-password", ChangePassword);
// employee dashboard data
router.get('/dashboard/:userId',dashboardData)
// user data for vedio call page 
router.get('/userdata/:userId',employeedetails)
// sending otp for email 
router.post('/resetEmail/:userId',resetEmail)
// updating email 
router.post('/updateEmail/:userId',setNewEmail)

export default router;

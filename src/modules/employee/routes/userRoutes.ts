import express, { Router } from "express";
import { employeeLogin, employeeLogout } from "../controllers/employeeAuth";
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
import { authenticateJWT } from "../../../middlewares/jwtMiddleware";

// import { protect } from "../../../middlewares/jwtMiddleware";
// import { updatePicture } from '../controllers/employeeController';

const router: Router = express.Router();

// employee Login
router.post("/login", employeeLogin);
// employee logout
router.post("/logout", employeeLogout);
// update Profile
router.put(
  "/editprofile/:userId",
  upload.single("profilePhoto"),
  updateProfile
);
// update reset with link
router.post("/reqest-reset-password/:userId",authenticateJWT, resetPassRequest);
// update password
router.post("/reset-password", authenticateJWT,ChangePassword);
// employee dashboard data
router.get(
  '/dashboard',
  authenticateJWT,
  dashboardData as unknown as express.RequestHandler
);
// user data for vedio call page 
router.get('/userdata/:userId',authenticateJWT,employeedetails)
// sending otp for email 
router.post('/resetEmail/:userId',authenticateJWT,resetEmail)
// updating email 
router.post('/updateEmail/:userId',authenticateJWT,setNewEmail)

export default router;

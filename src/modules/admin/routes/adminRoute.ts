import express, { Router } from "express";
import { adminLogin, adminSignup } from "../controllers/adminAuthController";
// import authenticateJWT from "../../../middlewares/jwtMiddleware";







import {
  AddUser,
  adminChagePass,
  adminDashboard,
  deleteUser,
  getAllUsers,
  getSpecificUser,
  updateUser,
} from "../controllers/adminController";

import {
  addNewProject,
  deleteProject,
  editProject,
  getprojectdetails,
  listProjects,
  listTasks,
  projectlisting,
} from "../controllers/projectController";
import { authenticateJWT } from "../../../middlewares/jwtMiddleware";

const router: Router = express.Router();

// admin login
router.post("/signup", adminSignup);
// admin signup
router.post("/login", adminLogin);

// protected routes

// Adding new User with email verification
router.post("/adduser",authenticateJWT, AddUser);
// Getting all the user Data
router.get("/getusers",authenticateJWT, getAllUsers);
// get detials of specific user
router.get("/getuser/:userId",authenticateJWT, getSpecificUser);
// update user data
router.put("/updateuser/:userId",authenticateJWT, updateUser);
// delete a specific user
router.delete("/deleteuser/:userId",authenticateJWT, deleteUser);
// get managers and employees
// router.get("/getmanagers",protect, getAllmanager);
// router.get("/getUnassignedemployees",protect, getAvilableempo);
// post for creating new project
router.post("/addNewProject",authenticateJWT, addNewProject);
// get for project listing
router.get("/getprojects",authenticateJWT, listProjects);
// geting specific project details
router.get("/project/:projectId",authenticateJWT, getprojectdetails);
// edting project
router.post("/editproject/:projectId",authenticateJWT, editProject);
// delete project
router.post("/deleteproject/:projectId",authenticateJWT,deleteProject)
// project listing in tasks
router.get('/projectlist/:managerId',authenticateJWT,projectlisting)
// admin project wise task listing
router.get('/listtask/:projectId',authenticateJWT,listTasks)
// admin dashboard 
router.get('/dashboard',authenticateJWT,adminDashboard)
// admin change password
router.post('/changepass/:userId',authenticateJWT,adminChagePass)

export default router;

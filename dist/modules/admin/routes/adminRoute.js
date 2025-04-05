"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = require("../controllers/adminAuthController");
// import authenticateJWT from "../../../middlewares/jwtMiddleware";
const adminController_1 = require("../controllers/adminController");
const projectController_1 = require("../controllers/projectController");
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// admin login
router.post("/signup", adminAuthController_1.adminSignup);
// admin signup
router.post("/login", adminAuthController_1.adminLogin);
// protected routes
// Adding new User with email verification
router.post("/adduser", jwtMiddleware_1.authenticateJWT, adminController_1.AddUser);
// Getting all the user Data
router.get("/getusers", jwtMiddleware_1.authenticateJWT, adminController_1.getAllUsers);
// get detials of specific user
router.get("/getuser/:userId", jwtMiddleware_1.authenticateJWT, adminController_1.getSpecificUser);
// update user data
router.put("/updateuser/:userId", jwtMiddleware_1.authenticateJWT, adminController_1.updateUser);
// delete a specific user
router.delete("/deleteuser/:userId", jwtMiddleware_1.authenticateJWT, adminController_1.deleteUser);
// get managers and employees
// router.get("/getmanagers",protect, getAllmanager);
// router.get("/getUnassignedemployees",protect, getAvilableempo);
// post for creating new project
router.post("/addNewProject", jwtMiddleware_1.authenticateJWT, projectController_1.addNewProject);
// get for project listing
router.get("/getprojects", jwtMiddleware_1.authenticateJWT, projectController_1.listProjects);
// geting specific project details
router.get("/project/:projectId", jwtMiddleware_1.authenticateJWT, projectController_1.getprojectdetails);
// edting project
router.post("/editproject/:projectId", jwtMiddleware_1.authenticateJWT, projectController_1.editProject);
// delete project
router.post("/deleteproject/:projectId", jwtMiddleware_1.authenticateJWT, projectController_1.deleteProject);
// project listing in tasks
router.get('/projectlist/:managerId', jwtMiddleware_1.authenticateJWT, projectController_1.projectlisting);
// admin project wise task listing
router.get('/listtask/:projectId', jwtMiddleware_1.authenticateJWT, projectController_1.listTasks);
// admin dashboard 
router.get('/dashboard', jwtMiddleware_1.authenticateJWT, adminController_1.adminDashboard);
// admin change password
router.post('/changepass/:userId', jwtMiddleware_1.authenticateJWT, adminController_1.adminChagePass);
exports.default = router;

import express, { Router } from "express";
import { addDepartment, deleteDepartment, deleteUser, editDetails, listDetails, listManager, listNonDepartmentempo, showDepartments } from "../controllers/departmentController";
import { authenticateJWT } from "../../../middlewares/jwtMiddleware";

const router:Router = express.Router();

// listing users with no department
router.get('/getUsers', authenticateJWT,listNonDepartmentempo)
// listing manager for Hod
router.get('/listmanager',authenticateJWT,listManager)
// add department
router.post('/add',authenticateJWT,addDepartment)
//listing departments
router.get('/list',authenticateJWT,showDepartments)
// delete department
router.post('/delete/:departmentId',authenticateJWT,deleteDepartment)
// list department details (sepecific)
router.get('/details/:departmentId',authenticateJWT,listDetails)
// edit department details
router.put('/edit/:departmentId',authenticateJWT,editDetails);
// deleting user from department
router.delete('/delete/:departmentId',authenticateJWT,deleteUser)

export default router
import express , {Router} from 'express'
import { addPay, AddPayroll, hrlisting, listallUsers, listdataspecific, listDepartmetentwise, listEmployee, listspecificId, listViewdata, showUser, UpdatePaymentStatus } from '../controllers/payrollController';
import { authenticateJWT } from '../../../middlewares/jwtMiddleware';

const router:Router = express.Router();
// adding payroll
router.post('/addpayroll',authenticateJWT,AddPayroll);
// updating payroll
router.post('/updatepayroll/:id',authenticateJWT,AddPayroll);
// listing employee who does not have payroll
router.get('/listEmpo',authenticateJWT,listEmployee)
// lsiting add employee details   
router.get('/listusers',authenticateJWT,listallUsers)
// listing of specific details 
router.get('/listdetails/:payrollId',authenticateJWT,listspecificId)
// listing of payroll in deparmentwise
router.get('/listdepartmentwise/:managerId',authenticateJWT,listDepartmetentwise)
// show user for deduction and bonus (manager)
router.get('/showdata/:userId',authenticateJWT,showUser)
// adding deduction and the bouneses
router.post('/addpay/:payrollId',authenticateJWT,addPay)
// update status of the payment
router.post('/updatestatus',authenticateJWT,UpdatePaymentStatus)
// payroll listing for hr 
router.get('/hrlist',authenticateJWT,hrlisting)
// listing data based on the User id
router.get('/userlist/:userId',authenticateJWT,listdataspecific)
// listing view datas
router.get('/viewlist',authenticateJWT,listViewdata)


export default router
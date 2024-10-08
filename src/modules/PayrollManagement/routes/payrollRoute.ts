import express , {Router} from 'express'
import { addPay, AddPayroll, hrlisting, listallUsers, listdataspecific, listDepartmetentwise, listEmployee, listspecificId, listViewdata, showUser, UpdatePaymentStatus } from '../controllers/payrollController';

const router:Router = express.Router();
// adding payroll
router.post('/addpayroll',AddPayroll);
// updating payroll
router.post('/updatepayroll/:id',AddPayroll);
// listing employee who does not have payroll
router.get('/listEmpo',listEmployee)
// lsiting add employee details   
router.get('/listusers',listallUsers)
// listing of specific details 
router.get('/listdetails/:payrollId',listspecificId)
// listing of payroll in deparmentwise
router.get('/listdepartmentwise/:managerId',listDepartmetentwise)
// show user for deduction and bonus (manager)
router.get('/showdata/:userId',showUser)
// adding deduction and the bouneses
router.post('/addpay/:payrollId',addPay)
// update status of the payment
router.post('/updatestatus',UpdatePaymentStatus)
// payroll listing for hr 
router.get('/hrlist',hrlisting)
// listing data based on the User id
router.get('/userlist/:userId',listdataspecific)
// listing view datas
router.get('/viewlist',listViewdata)


export default router
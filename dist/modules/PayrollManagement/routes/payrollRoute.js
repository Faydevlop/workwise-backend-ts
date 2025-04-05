"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payrollController_1 = require("../controllers/payrollController");
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// adding payroll
router.post('/addpayroll', jwtMiddleware_1.authenticateJWT, payrollController_1.AddPayroll);
// updating payroll
router.post('/updatepayroll/:id', jwtMiddleware_1.authenticateJWT, payrollController_1.AddPayroll);
// listing employee who does not have payroll
router.get('/listEmpo', jwtMiddleware_1.authenticateJWT, payrollController_1.listEmployee);
// lsiting add employee details   
router.get('/listusers', jwtMiddleware_1.authenticateJWT, payrollController_1.listallUsers);
// listing of specific details 
router.get('/listdetails/:payrollId', jwtMiddleware_1.authenticateJWT, payrollController_1.listspecificId);
// listing of payroll in deparmentwise
router.get('/listdepartmentwise/:managerId', jwtMiddleware_1.authenticateJWT, payrollController_1.listDepartmetentwise);
// show user for deduction and bonus (manager)
router.get('/showdata/:userId', jwtMiddleware_1.authenticateJWT, payrollController_1.showUser);
// adding deduction and the bouneses
router.post('/addpay/:payrollId', jwtMiddleware_1.authenticateJWT, payrollController_1.addPay);
// update status of the payment
router.post('/updatestatus', jwtMiddleware_1.authenticateJWT, payrollController_1.UpdatePaymentStatus);
// payroll listing for hr 
router.get('/hrlist', jwtMiddleware_1.authenticateJWT, payrollController_1.hrlisting);
// listing data based on the User id
router.get('/userlist/:userId', jwtMiddleware_1.authenticateJWT, payrollController_1.listdataspecific);
// listing view datas
router.get('/viewlist', jwtMiddleware_1.authenticateJWT, payrollController_1.listViewdata);
exports.default = router;

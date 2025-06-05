import express , {Router} from 'express'
import { managerDashboard, managerLogin } from '../constrollers/managerAuth'
import { authenticateJWT } from '../../../middlewares/jwtMiddleware'


const router:Router = express.Router()

// manager Login
router.post('/login',managerLogin)
// manager dashboard
router.get('/dashboard/:managerId',authenticateJWT,managerDashboard)


export default router

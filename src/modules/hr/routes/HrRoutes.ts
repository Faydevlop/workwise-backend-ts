import express , {Router} from 'express'
import { hrDashboard, HrLogin } from '../controllers/HrAuth'
import { authenticateJWT } from '../../../middlewares/jwtMiddleware'

const router:Router = express.Router()

// Hr Login
router.post('/login',HrLogin)
// hr dashboard 
router.get('/dashboard/:userId',authenticateJWT,hrDashboard)

export default router
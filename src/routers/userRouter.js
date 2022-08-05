import { Router } from 'express'
import { signUp } from '../controllers/userController.js'
import validateUser from '../middlewares/userValidation.js'

const router = Router()

router.post('/signup', validateUser, signUp)

export default router

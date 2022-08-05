import { Router } from 'express'
import { signIn, signUp } from '../controllers/userController.js'
import validateLogin from '../middlewares/loginValidation.js'
import validateUser from '../middlewares/userValidation.js'

const router = Router()

router.post('/signup', validateUser, signUp)
router.post('/signin', validateLogin, signIn)

export default router

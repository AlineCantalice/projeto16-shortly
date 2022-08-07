import { Router } from 'express'
import {
  getRanking,
  getUserData,
  signIn,
  signUp,
} from '../controllers/userController.js'
import validateLogin from '../middlewares/loginValidation.js'
import validateUser from '../middlewares/userValidation.js'

const router = Router()

router.post('/signup', validateUser, signUp)
router.post('/signin', validateLogin, signIn)
router.get('/users/me', getUserData)
router.get('/ranking', getRanking)

export default router

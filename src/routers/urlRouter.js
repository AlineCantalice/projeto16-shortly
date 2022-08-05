import { Router } from 'express'
import { createShortUrl, getUrlById } from '../controllers/urlController.js'
import validateUrl from '../middlewares/urlValidation.js'

const router = Router()

router.post('/urls/shorten', validateUrl, createShortUrl)
router.get('/urls/:id', getUrlById)

export default router

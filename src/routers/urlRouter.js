import { Router } from 'express'
import { createShortUrl, getUrlById, redirectToUrl } from '../controllers/urlController.js'
import validateUrl from '../middlewares/urlValidation.js'

const router = Router()

router.post('/urls/shorten', validateUrl, createShortUrl)
router.get('/urls/:id', getUrlById)
router.get('/urls/open/:shortUrl', redirectToUrl)

export default router

import { Router } from 'express'
import { fetch, login, register, updateProfile, verify } from '../../controller/AuthController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify/id=:id', verify)
router.get('/fetch', [checkJwt, fetch])
router.post('/update', [checkJwt, updateProfile])

export default router

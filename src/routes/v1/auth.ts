import { Router } from 'express'
import { login, register, verify } from '../../controller/AuthController'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify/id=:id', verify)

export default router

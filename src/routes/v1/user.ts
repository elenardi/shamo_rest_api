import { Router } from 'express'
import { getUser, getUserAuth } from '../../controller/UserController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.get('/all', [checkJwt, getUser])
router.get('/auth', [checkJwt, getUserAuth])

export default router

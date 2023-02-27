import { Router } from 'express'
import { getUser } from '../../controller/UserController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.get('/all', [checkJwt, getUser])

export default router

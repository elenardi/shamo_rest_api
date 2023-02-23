import { Router } from 'express'
import { getUser } from '../../controller/UserController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.get('/all/limit=:limit&page=:page', [checkJwt, getUser])

export default router

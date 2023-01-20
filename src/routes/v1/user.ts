import { Router } from 'express'
import { fetch, getUser, updateUser } from '../../controller/UserController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.get('/all', [checkJwt, getUser])
router.get('/fetch', [checkJwt, fetch])
router.post('/update', [checkJwt, updateUser])

export default router

import { Router } from 'express'
import { createCategory } from '../../controller/CategoryController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createCategory])

export default router

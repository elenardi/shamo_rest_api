import { Router } from 'express'
import { createProduct } from '../../controller/ProductController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createProduct])

export default router

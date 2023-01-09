import { Router } from 'express'
import { createProduct, updateProduct } from '../../controller/ProductController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createProduct])
router.patch('/update/id=:id', [checkJwt, updateProduct])

export default router

import { Router } from 'express'
import { createProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../../controller/ProductController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createProduct])
router.patch('/update', [checkJwt, updateProduct])
router.get('/all', [checkJwt, getAllProduct])
router.get('/', [checkJwt, getProductById])
router.delete('/delete', [checkJwt, deleteProduct])

export default router

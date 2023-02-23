import { Router } from 'express'
import { createProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../../controller/ProductController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createProduct])
router.patch('/update/id=:id', [checkJwt, updateProduct])
router.get('/all/limit=:limit&page=:page', [checkJwt, getAllProduct])
router.get('/id=:id', [checkJwt, getProductById])
router.delete('/delete/id=:id', [checkJwt, deleteProduct])

export default router

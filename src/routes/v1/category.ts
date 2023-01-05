import { Router } from 'express'
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../../controller/CategoryController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createCategory])
router.patch('/update/id=:id', [checkJwt, updateCategory])
router.get('/all', [checkJwt, getAllCategory])
router.delete('/delete/id=:id', [checkJwt, deleteCategory])

export default router

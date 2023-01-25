import { Router } from 'express'

import auth from './auth'
import user from './user'
import category from './category'
import product from './product'
import transaction from './transaction'

const router = Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/category', category)
router.use('/product', product)
router.use('/transaction', transaction)

export default router

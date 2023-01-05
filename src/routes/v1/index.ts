import { Router } from 'express'

import auth from './auth'
import user from './user'
import category from './category'

const router = Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/category/create', category)

export default router

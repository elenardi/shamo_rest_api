import { Router } from 'express'
import { createTransaction } from '../../controller/TransactionController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createTransaction])

export default router
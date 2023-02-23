import { Router } from 'express'
import { createTransaction, getAllTransaction } from '../../controller/TransactionController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.post('/create', [checkJwt, createTransaction])
router.get('/all/limit=:limit&page=:page', [checkJwt, getAllTransaction])

export default router
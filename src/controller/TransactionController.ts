import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
import { User, UserRole } from "../entity/User"
import { Transaction } from "../entity/Transaction"
import { TransactionDetail } from "../entity/TransactionDetail"
import { Product } from "../entity/Product"
const { successResponse, errorResponse, validationResponse } = require('../utils/response')
import buildPaginator from 'pagination-apis'

const transactionRepository = AppDataSource.getRepository(Transaction)
const transactionDetailRepository = AppDataSource.getRepository(TransactionDetail)
const userRepository = AppDataSource.getRepository(User)
const productRepository = AppDataSource.getRepository(Product)

export const createTransaction = async(request: Request, response: Response, next: NextFunction) => {
    const createTransactionSchema = (input) => Joi.object({
        address: Joi.string().optional().allow(null, ''),
        payment: Joi.string().required(),
        total_price: Joi.number().required(),
        shepping_price: Joi.number().required(),
        status: Joi.string().optional(),
        item: Joi.array().items({
            product_id: Joi.string().required(),
            quantity: Joi.number().required(),
        }).required(),
    }).validate(input)

    try {
        if (request.jwtPayload.role !== UserRole.CUSTOMER){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const schema = createTransactionSchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
        }

        const user = await userRepository.findOneBy({id: request.jwtPayload.id})

        const newTransaction = new Transaction()
        newTransaction.address = body.address
        newTransaction.payment = body.payment
        newTransaction.totalPrice = body.total_price
        newTransaction.sheppingPrice = body.shepping_price
        newTransaction.status = body.status
        newTransaction.user = user

        await transactionRepository.save(newTransaction)

        for (let i=0; i < body.item.length; i++) {
            const product = await productRepository.findOneBy({id: body.item[i].product_id})

            const newTransactionDetail = new TransactionDetail()
            newTransactionDetail.user = user
            newTransactionDetail.product = product
            newTransactionDetail.transaction = newTransaction
            newTransactionDetail.quantity = body.item[i].quantity

            await transactionDetailRepository.save(newTransactionDetail)
        }

        return response.status(201).send(successResponse('Success create transaction', {data: newTransaction}, 201))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const getAllTransaction = async(request: Request, response: Response, next: NextFunction) => {
    try {
        const { skip, limit, paginate } = buildPaginator({page: String(request.query.page), limit: String(request.query.limit)})
        if(request.jwtPayload.role === UserRole.ADMIN) {
            const [data, total] = await transactionRepository.findAndCount({
                relations: {
                    user: true,
                    transaction_detail: {
                        product: true
                    },
                },
                order: {
                    createdAt: 'DESC'
                },
                select: {
                    user: {
                        id: true,
                        fullname: true,
                        phoneNumber: true,
                    },
                    transaction_detail: {
                        id: true,
                        quantity: true,
                        product: {
                            id: true,
                            name: true,
                            price: true,
                            desc: true,
                            tags: true
                        }
                    }
                },
                skip,
                take: limit
            })
            return response.status(200).send(successResponse('Success show all transaction', paginate(data, total), 200))
        } else {
            const [data, total] = await transactionRepository.findAndCount({
                where: {
                    user: {
                        id: request.jwtPayload.id
                    }
                },
                relations: {
                    transaction_detail: {
                        product: true
                    },
                },
                order: {
                    createdAt: 'DESC'
                },
                select: {
                    transaction_detail: {
                        id: true,
                        quantity: true,
                        product: {
                            id: true,
                            name: true,
                            price: true,
                            desc: true,
                            tags: true
                        }
                    }
                }
            })
            return response.status(200).send(successResponse('Success show all transaction', paginate(data, total), 200))
        }
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
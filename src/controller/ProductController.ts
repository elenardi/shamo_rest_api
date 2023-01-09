import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
import { UserRole } from "../entity/User"
import { Product } from "../entity/Product"
import { Category } from "../entity/Category"
const { successResponse, errorResponse, validationResponse } = require('../utils/response')

const categoryRepository = AppDataSource.getRepository(Category)
const productRepository = AppDataSource.getRepository(Product)

export const createProduct = async(request: Request, response: Response, next: NextFunction) => {
    const createProductSchema = (input) => Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        desc: Joi.string().required(),
        tags: Joi.string().required(),
        categoryId: Joi.string().required()
    }).validate(input)

    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const errors = createProductSchema(request.body)
        if ('error' in errors) {
            return response.status(422).send(validationResponse(errors))
        }

        const category = await categoryRepository.findOneBy({id: body.categoryId})
        if(!category){
            return response.status(404).send(errorResponse("Category not found", 404))
        }

        const newProduct = new Product()
        newProduct.name = body.name
        newProduct.price = body.price
        newProduct.desc = body.desc
        newProduct.tags = body.tags
        newProduct.category = category

        await productRepository.save(newProduct)

        return response.status(201).send(successResponse('Success create product', {data: newProduct}, 201))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const updateProduct = async(request: Request, response: Response, next: NextFunction) => {
    const updateProductSchema = (input) => Joi.object({
        name: Joi.string(),
        price: Joi.number(),
        desc: Joi.string(),
        tags: Joi.string(),
        categoryId: Joi.string()
    }).validate(input)

    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const errors = updateProductSchema(request.body)
        if ('error' in errors) {
            return response.status(422).send(validationResponse(errors))
        }

        const product = await productRepository.findOneBy({id: request.params.id})
        if(!product){
            return response.status(409).send(errorResponse("Product not found", 409))
        } 
        
        product.name = body.name
        product.price = body.price
        product.desc = body.desc
        product.tags = body.tags
        product.category = body.categoryId

        await productRepository.save(product)

        return response.status(200).send(successResponse('Success update product', {data: product}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
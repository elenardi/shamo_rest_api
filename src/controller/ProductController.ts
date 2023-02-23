import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
import { UserRole } from "../entity/User"
import { Product } from "../entity/Product"
import { Category } from "../entity/Category"
import { ProductGallery } from "../entity/ProductGallery"
const { successResponse, errorResponse, validationResponse } = require('../utils/response')
const sharp = require("sharp")

const categoryRepository = AppDataSource.getRepository(Category)
const productRepository = AppDataSource.getRepository(Product)
const productGalleryRepository = AppDataSource.getRepository(ProductGallery)

export const createProduct = async(request: Request, response: Response, next: NextFunction) => {
    const createProductSchema = (input) => Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        desc: Joi.string().required(),
        tags: Joi.string().required(),
        categoryId: Joi.string().required(),
        productImage: Joi.array().items({
            image: Joi.string().optional()
        }).optional()
    }).validate(input)

    try {
        if (request.jwtPayload.role === UserRole.CUSTOMER){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const schema = createProductSchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
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

        if (typeof body.productImage !== 'undefined' && body.productImage.length !== 0) {
            for(let i=0; i < body.productImage.length; i++){
                try {
                    let parts = body.productImage[i].image.split(';')
                    let imageData = parts[1].split(',')[1]
                    const img = Buffer.from(imageData, 'base64')
                    const imageName = `${Date.now()}.jpeg`

                    await sharp(img)
                    .resize(280, 175)
                    .toFormat("jpeg", { mozjpeg: true })
                    .jpeg({ quality: 100 })
                    .toFile(`./public/assets/images/product/${imageName}`)

                    const newProductGallery = new ProductGallery()
                    newProductGallery.product = newProduct
                    newProductGallery.url = `/assets/images/product/${imageName}`
                    await productGalleryRepository.save(newProductGallery)
                } catch (error) {
                    return response.status(400).send(errorResponse(error, 400))
                }
            }
        }

        return response.status(201).send(successResponse('Success create product', {data: newProduct}, 201))
    } catch (error) {
        // const e = response.status(400).send(errorResponse(error, 400))
        return next(errorResponse(error, 400))
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
        if (request.jwtPayload.role === UserRole.CUSTOMER){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const schema = updateProductSchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
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

export const getAllProduct = async(request: Request, response: Response, next: NextFunction) => {
    try {
        const product = await productRepository.find({relations: ['category'], order: {name: 'ASC'}})
        return response.status(200).send(successResponse('Success show all product', {data: product}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const getProductById = async(request: Request, response: Response, next: NextFunction) => {
    try {
        const product = await productRepository.findOneBy({id: request.params.id})
        if(!product){
            return response.status(409).send(errorResponse("Product not found", 409))
        }
        return response.status(200).send(successResponse('Success show product by id', {data: product}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const deleteProduct = async(request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.jwtPayload.role === UserRole.CUSTOMER){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const product = await productRepository.findOneBy({id: request.params.id})

        if(!product){
            return response.status(404).send(errorResponse('Product not found', 404))
        }

        await productRepository.softDelete(request.params.id)

        return response.status(200).send(successResponse('Success delete product', {data: null}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
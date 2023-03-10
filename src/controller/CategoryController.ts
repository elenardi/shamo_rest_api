import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
import { Category } from "../entity/Category"
import { UserRole } from "../entity/User"
const { successResponse, errorResponse, validationResponse } = require('../utils/response')

const categoryRepository = AppDataSource.getRepository(Category)

export const createCategory = async(request: Request, response: Response, next: NextFunction) => {
    const createCategorySchema = (input) => Joi.object({
        name: Joi.string().uppercase().required(),
    }).validate(input)

    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const schema = createCategorySchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
        }

        const category = await categoryRepository.findOneBy({name: body.name})
        if(category){
            return response.status(409).send(errorResponse("Category Already Exists", 409))
        }

        const newCategory = new Category()
        newCategory.name = body.name

        await categoryRepository.save(newCategory)

        return response.status(201).send(successResponse('Success create category', {data: newCategory}, 201))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const updateCategory = async(request: Request, response: Response, next: NextFunction) => {
    const updateCategorySchema = (input) => Joi.object({
        name: Joi.string().uppercase().required(),
    }).validate(input)

    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const body = request.body
        const schema = updateCategorySchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
        }

        const category = await categoryRepository.findOneBy({name: body.name})
        if(category){
            return response.status(409).send(errorResponse("Category Already Exists", 409))
        } 

        const setCategory = await categoryRepository.findOneBy({id: String(request.query.id)})

        if(!setCategory){
            return response.status(404).send(errorResponse('Category not found', 404))
        }
        setCategory.name = body.name

        await categoryRepository.save(setCategory)

        return response.status(200).send(successResponse('Success update category', {data: setCategory}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const getAllCategory = async(request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const category = await categoryRepository.find({order: {name: 'ASC'}})

        return response.status(200).send(successResponse('Success show all category', {data: category}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const deleteCategory = async(request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const category = await categoryRepository.findOneBy({id: String(request.query.id)})

        if(!category){
            return response.status(404).send(errorResponse('Category not found', 404))
        }

        await categoryRepository.softDelete(String(request.query.id))

        return response.status(200).send(successResponse('Success delete category', {data: null}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
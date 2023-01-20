import { NextFunction, Request, Response } from "express"
import { User, UserRole } from "../entity/User"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = Joi.extend(joiPasswordExtendCore)
const { successResponse, errorResponse, validationResponse } = require('../utils/response')

const userRepository = AppDataSource.getRepository(User)

export const getUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const user = await userRepository.find()

        return response.status(200).send(successResponse('List User', {data: user}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const fetch = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = await userRepository.findOneBy({id: request.jwtPayload.id})
        return response.status(200).send(successResponse('User Authorized', {data: user}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
    const updateUserSchema = (input) => Joi.object({
        fullname: Joi.string(),
        username: Joi.string().min(5).max(200),
        email: Joi.string().email(),
        phoneNumber: Joi.string().min(10).max(15),
    }).validate(input)
    try {
        const body = request.body
        const errors = updateUserSchema(request.body)
        if ('error' in errors) {
            return response.status(422).send(validationResponse(errors))
        }

        const user = await userRepository.findOneBy({id: request.jwtPayload.id})

        let handlePhoneNumber = body.phoneNumber.trim()
                handlePhoneNumber = handlePhoneNumber.replace(" ","")
                handlePhoneNumber = handlePhoneNumber.replace("-","")
                handlePhoneNumber = handlePhoneNumber.replace("(","")
                handlePhoneNumber = handlePhoneNumber.replace(")","")
                handlePhoneNumber = handlePhoneNumber.replace(".","")
                handlePhoneNumber = handlePhoneNumber.replace("+","")

        if(handlePhoneNumber.search(0) == 0){
            handlePhoneNumber = handlePhoneNumber.replace('0',62)
        }

        user.fullname = body.fullname
        user.username = body.username
        user.email = body.email
        user.phoneNumber = handlePhoneNumber

        await userRepository.save(user)

        return response.status(200).send(successResponse('Success update user', {data: user}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
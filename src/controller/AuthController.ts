import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
import { JwtPayload } from "../types/JwtPayload"
import { createJwtToken } from "../utils/createJwtToken"
const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = Joi.extend(joiPasswordExtendCore)
const { successResponse, errorResponse, validationResponse } = require('../utils/response')

const userRepository = AppDataSource.getRepository(User)

export const register = async (request: Request, response: Response, next: NextFunction) => {
    const registerSchema = (input) => Joi.object({
        fullname: Joi.string().required(),
        username: Joi.string().min(5).max(200).required(),
        email: Joi.string().email().required(),
        password: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .noWhiteSpaces()
            .required(),
        phoneNumber: Joi.string().required(),
        role: Joi.string().required(),
    }).validate(input)
    try {
        const body = request.body
        const errors = registerSchema(request.body)
        if ('error' in errors) {
            return response.status(422).send(validationResponse(errors))
        }
        const user = await userRepository.findOneBy({email: body.email})
        if(user){
            return response.status(400).send(errorResponse("User Already Exists", response.statusCode))
        }

        const newUser = new User()
        newUser.fullname = body.fullname
        newUser.username = body.username
        newUser.email = body.email
        newUser.password = body.password
        newUser.phoneNumber = body.phoneNumber
        newUser.role = body.role
        newUser.verified = false

        newUser.hashPassword()
        await userRepository.save(newUser)

        return response.status(200).send(successResponse("Create User Success", {data: newUser}, response.statusCode))
        // return next(customSuccess)
    } catch (error) {
        return response.status(400).send(errorResponse(error, response.statusCode))
    }
}

export const login = async(request: Request, response: Response, next: NextFunction) => {
    try {
        const {email, password} = request.body

        const user = await userRepository.findOne({where: {email: email}})

        if (!user){
            return response.status(409).send(errorResponse('Incorect email or password', 409))
        }

        if (!user.checkIfPasswordMatch(password)) {
            return response.status(409).send(errorResponse('Incorect email or password', 409))
        }

        if (user.verified === false) {
            return response.status(409).send(errorResponse('User need verify', 409))
        }

        const jwtPayload: JwtPayload = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        }

        const token = createJwtToken(jwtPayload)
        const data = { user, token }

        return response.status(200).send(successResponse("Login Success", {data: data}, response.statusCode))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}

export const verify = async(request: Request, response: Response, next: NextFunction) => {
    try {
        const user = await userRepository.findOneBy({id: request.params.id})

        user.verified = true

        await userRepository.save(user)

        return response.status(200).send(successResponse('Success user verify', {data: user}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
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
        phoneNumber: Joi.string().min(10).max(15).required(),
        role: Joi.string().uppercase().required(),
    }).validate(input)
    try {
        const body = request.body
        const schema = registerSchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
        }
        const user_email = await userRepository.findOneBy({email: body.email})
        const user_username = await userRepository.findOneBy({username: body.username})
        if(user_email || user_username){
            return response.status(409).send(errorResponse("User Already Exists", 409))
        }

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

        const newUser = new User()
        newUser.fullname = body.fullname
        newUser.username = body.username
        newUser.email = body.email
        newUser.password = body.password
        newUser.phoneNumber = handlePhoneNumber
        newUser.role = body.role
        newUser.verifyCode = Math.floor(Math.random()*90000) + 10000
        newUser.isVerified = false

        newUser.hashPassword()
        await userRepository.save(newUser)

        const data = {
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            isVerified: newUser.isVerified
        }

        return response.status(200).send(successResponse("Create User Success", {data: data}, 200))
        // return next(customSuccess)
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
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

        if (user.isVerified === false) {
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
        const {verifyCode} = request.body
        const user = await userRepository.findOne({
            where: {
                id: request.params.id,
                verifyCode
            }
        })

        if(!user){
            return response.status(404).send(errorResponse('User not found', 404))
        }

        user.isVerified = true
        await userRepository.save(user)

        const data = {
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isVerified: user.isVerified
        }

        return response.status(200).send(successResponse('Success user verify', {data: data}, 200))
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

export const updateProfile = async (request: Request, response: Response, next: NextFunction) => {
    const updateProfileSchema = (input) => Joi.object({
        fullname: Joi.string(),
        username: Joi.string().min(5).max(200),
        email: Joi.string().email(),
        phoneNumber: Joi.string().min(10).max(15),
    }).validate(input)
    try {
        const body = request.body
        const schema = updateProfileSchema(request.body)
        if ('error' in schema) {
            return response.status(422).send(validationResponse(schema))
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
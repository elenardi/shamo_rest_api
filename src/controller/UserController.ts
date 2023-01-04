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
        const user = await userRepository.find()

        return response.status(200).send(successResponse('List User', {data: user}, 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
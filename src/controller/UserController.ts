import { NextFunction, Request, Response } from "express"
import { User, UserRole } from "../entity/User"
import { AppDataSource } from "../data-source"
import Joi = require("joi")
const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = Joi.extend(joiPasswordExtendCore)
const { successResponse, errorResponse, validationResponse } = require('../utils/response')
import buildPaginator from 'pagination-apis'

const userRepository = AppDataSource.getRepository(User)

export const getUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.jwtPayload.role !== UserRole.ADMIN){
            return response.status(405).send(errorResponse("Don't have access", 405))
        }

        const { skip, limit, paginate } = buildPaginator({page: String(request.query.page), limit: String(request.query.limit)})
        const [data, total] = await userRepository.findAndCount({
            order: {
                fullname: 'ASC'
            },
            skip,
            take: limit,
        })

        return response.status(200).send(successResponse('List User', paginate(data, total), 200))
    } catch (error) {
        return response.status(400).send(errorResponse(error, 400))
    }
}
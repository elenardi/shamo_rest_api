import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/JwtPayload'
const { successResponse, errorResponse, validationResponse } = require('../utils/response')

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.get('Authorization')

  if (!authHeader) {
    return response.status(409).send(errorResponse('Authorization header not provided', 409))
  }

  const token = authHeader.split(' ')[1]

  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET)
    request.jwtPayload = jwtPayload as JwtPayload
    return next()
  } catch (err) {
    return response.status(401).send(errorResponse('JWT Error', 401))
  }
}

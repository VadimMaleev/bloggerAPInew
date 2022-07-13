import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from("admin:qwerty").toString("base64")
    const encode = `Basic ${base64}`
    if (authHeader === encode) {
        next()
    } else {
        res.send(401)
    }
}

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers.authorization)
    if (!req.headers.authorization) {
        res.send(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    const userId = await jwtService.extractUserIdFromToken(token)
    console.log(userId)
    if(userId) {
        req.user = await usersService.findUserById(userId)
        console.log(req.user)
        next()
    } else {
        return res.send(401)
    }
}
import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import { ObjectId } from "mongodb";

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
    if (!req.headers.authorization) {
        res.send(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const _userId = await jwtService.extractUserIdFromToken(token)
    if(_userId) {
        const userId = new ObjectId(_userId)
        req.user = await usersService.findUserById(userId)
        next()
    } else {
        return res.send(401)
    }
}

export const jwtRefreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenFromCookie = req.cookies?.refreshToken
    console.log(req.headers.cookie)
    if (!refreshTokenFromCookie) {
        res.status(401).send('cookies is not exist')
        return
    }

    const refreshToken = await jwtService.findExpiredToken(refreshTokenFromCookie)
    if (refreshToken?.refreshToken) {
        return res.status(401).send("token is expired")
    } else {
        const token = refreshTokenFromCookie.split(' ')[1]
        const _userId = await jwtService.extractUserIdFromToken(token)
        if(_userId) {
            const userId = new ObjectId(_userId)
            req.user = await usersService.findUserById(userId)
            next()
        } else {
            return res.status(401).send("user not exist")
        }
    }


}
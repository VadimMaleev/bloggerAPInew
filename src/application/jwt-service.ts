import {TokenType, UserAccType} from "../repositories/db";
import jwt from 'jsonwebtoken'
import {settings} from "../settings/settings";
import {jwtRepository} from "../repositories/jwt-repository";
import {ObjectId} from "mongodb";


export const jwtService = {
    async createJWT(user: UserAccType) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '10s'})
        return token
    },
    async createRefreshJWT(user: UserAccType) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '20s'})
        return token
    },
    async extractUserIdFromToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },
    async expireRefreshToken(refreshToken: string) {
        const token = {
            _id: new ObjectId,
            refreshToken: refreshToken
        }
        await jwtRepository.expireRefreshToken(token)
    },
    async findExpiredToken(token: string): Promise <TokenType | null> {
        return await jwtRepository.findAllExpiredTokens(token)
    }
}
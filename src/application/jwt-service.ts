import {UserType} from "../repositories/db";
import jwt from 'jsonwebtoken'
import {settings} from "../settings/settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '5d'})
        return token
    },
    async extractUserIdFromToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}
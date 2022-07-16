import {UserAccType, UserType} from "../repositories/db";
import jwt from 'jsonwebtoken'
import {settings} from "../settings/settings";

export const jwtService = {
    async createJWT(user: UserAccType) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '5d'})
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
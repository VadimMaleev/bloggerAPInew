import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";
import {jwtService} from "../application/jwt-service";
import {UserAccType, UserDBType} from "../repositories/db";

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async checkCredential(login:string): Promise<UserAccType | null>{
        const user = await usersRepository.findByLogin(login)
        if (!user) return null
        //if (!user.emailConfirmation.isConfirmed) return null

        return user
    },
    async checkPassword (password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    },
    async createToken(login: string) {
        const user = await authService.checkCredential(login)
        if (user === null) return null
        const token = await jwtService.createJWT(user!)
        return {"accessToken": token}
    },
    async createRefreshToken(login: string) {
        const user = await authService.checkCredential(login)
        if (user === null) return null
        const token = await jwtService.createRefreshJWT(user!)
        return {"refreshToken": token}
    },
}
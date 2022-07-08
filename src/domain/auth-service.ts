import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";
import {jwtService} from "../application/jwt-service";
import {UserDBType} from "../repositories/db";

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async checkCredential(login:string): Promise<UserDBType | null>{
        return await usersRepository.findByLogin(login)
    },
    async checkPassword (password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    },
    async createToken(login: string) {
        const user = await authService.checkCredential(login)
        const token = await jwtService.createJWT(user!)
        return {"token": token}
    }
}
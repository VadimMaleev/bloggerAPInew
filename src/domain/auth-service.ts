import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    // async checkCredential(login: string, password:string) {
    //     const user = await usersRepository.findByLogin(login)
    //     if (!user) {
    //         return false
    //     }
    //     const passwordHash = await authService.generateHash(password)
    //     if (user.passwordHash !== passwordHash) {
    //         return false
    //     }
    //     return true
    // }
}
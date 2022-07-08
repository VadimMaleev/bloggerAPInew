import {UserPagType, UserType} from "../repositories/db";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";

export const usersService = {
    async findAllUsers(page: number, pageSize: number): Promise<UserPagType> {
        const pagesCount = Math.ceil(await usersRepository.forCount()/ pageSize)
        const totalCount = await usersRepository.forCount()

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await usersRepository.findAllUsers(page, pageSize)
        }
    },
    async createUser(login: string, password: string): Promise<{id: string, login: string}> {
        const newUser = {
            id: (+(new Date())).toString(),
            login: login
        }
        const hash = await authService.generateHash(password)
        return usersRepository.createUser(newUser, hash)
    },
    async deleteUser(id:string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}
import {UserPagType, UserDBType, UserType, UserDto} from "../repositories/db";
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
    async createUser(login: string, password: string, email: string): Promise<UserDto> {
        const newUser = {
            id: (+(new Date())).toString(),
            login: login,
            email: email
        }
        const hash = await authService.generateHash(password)
        await usersRepository.createUser(newUser, hash)

        const userDto: UserDto = {
            id: newUser.id,
            login: newUser.login
        }
        return userDto

    },
    async deleteUser(id:string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async findUserById(userId: string): Promise<UserDBType | null> {
        return await usersRepository.findUserById(userId)
    }
}
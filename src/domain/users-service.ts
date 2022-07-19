import {UserPagType, UserDBType, UserType, UserDto, UserAccType} from "../repositories/db";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {emailAdapter} from "../adapters/email-adapter";

export const usersService = {
    async findAllUsers(page: number, pageSize: number): Promise<UserPagType> {
        const pagesCount = Math.ceil(await usersRepository.forCount() / pageSize)
        const totalCount = await usersRepository.forCount()

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await usersRepository.findAllUsers(page, pageSize)
        }
    },
    async createUser(login: string, password: string, email: string): Promise<UserDto | null> {
        const hash = await authService.generateHash(password)
        const newUser: UserAccType = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email: email,
                passwordHash: hash,
                createdAt: new Date().toString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 3}),
                isConfirmed: false
            }
        }

        await usersRepository.createUser(newUser)
        const userDto = {
            id: newUser._id,
            login: newUser.accountData.userName
        }

        await emailAdapter.sendEmailConfirmationCode(newUser.emailConfirmation.confirmationCode, newUser.accountData.email)
        return userDto

    },
    async confirmUser(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByCode(code)
        if (!user) return false
        if( user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        let result = await usersRepository.updateConfirmation(user._id)
        return result
    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async findUserById(userId: ObjectId): Promise<UserAccType | null> {
        return await usersRepository.findUserById(userId)
    },
    async findUserByEmail(email: string): Promise<UserAccType | null> {
        return await usersRepository.findUserByEmail(email)
    },
    async findUserByLogin(login: string): Promise<UserAccType | null> {
        return await usersRepository.findByLogin(login)
    },
    async createNewConfirmCode(user: UserAccType) {
        const confirmCode = uuidv4()
        const expirationDate = add(new Date(), {hours: 3})
        await usersRepository.updateConfirmCode(user, confirmCode, expirationDate)
        await emailAdapter.sendEmailConfirmationCode(confirmCode, user.accountData.email)
    }
}
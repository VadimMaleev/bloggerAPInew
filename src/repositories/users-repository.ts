import {UserAccType, UserDto, usersCollection, UserType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async forCount(): Promise<number> {
        return usersCollection.countDocuments()
    },
    async findAllUsers(page: number, pageSize: number): Promise<UserDto[]> {
        const users = await usersCollection.find({})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray()
        return users.map((u) => ({id: u._id, login: u.accountData.userName}))
    },
    async createUser(newUser: UserAccType) {
    await usersCollection.insertOne(newUser)
    },
    async findByLogin(login:string): Promise<UserAccType | null> {
        return await usersCollection.findOne({"accountData.userName":login})

    },
    async deleteUser(id:ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    },
    async findUserById(userId: ObjectId): Promise<UserAccType | null> {
        return await usersCollection.findOne({_id: userId})
    },
    async findUserByCode(code: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
    },
    async updateConfirmation(id: ObjectId) {
        let result = await usersCollection
            .updateOne({_id: id},{$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    },
    async findUserByEmail(email: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({"accountData.email": email})
    }
}
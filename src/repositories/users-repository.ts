import {UserDBType, usersCollection, UserType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async forCount(): Promise<number> {
        return usersCollection.countDocuments()
    },
    async findAllUsers(page: number, pageSize: number): Promise<UserType[]> {
        return usersCollection.find({}, {projection: {_id: 0, passwordHash: 0, email: 0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray()
    },
    async createUser(newUser: UserType, hash: string) {
        const userDBType = {
            ...newUser,
            passwordHash: hash
        }
        await usersCollection.insertOne(userDBType)
    },
    async findByLogin(login:string): Promise<UserDBType | null> {
        return await usersCollection.findOne({login:login})

    },
    async deleteUser(id:string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findUserById(userId: string): Promise<UserDBType | null> {
        return await usersCollection.findOne({id: userId})
    }
}
import {UserDBType, usersCollection, UserType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async forCount(): Promise<number> {
        return usersCollection.countDocuments()
    },
    async findAllUsers(page: number, pageSize: number): Promise<UserType[]> {
        return usersCollection.find({}, {projection: {_id: 0, passwordHash: 0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray()
    },
    async createUser(newUser: UserType, hash: string): Promise<UserType> {
        const userDBType = {
            _id: new ObjectId,
            ...newUser,
            passwordHash: hash
        }
        await usersCollection.insertOne(userDBType)
        return newUser
    },
    async findByLogin(login:string): Promise<UserDBType | null> {
        return await usersCollection.findOne({login:login})

    },
    async deleteUser(id:string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
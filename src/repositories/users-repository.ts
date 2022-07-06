import {usersCollection, UserType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async forCount(): Promise<number> {
        return usersCollection.countDocuments()
    },
    async findAllUsers(page: number, pageSize: number): Promise<UserType[]> {
        return usersCollection.find({}, {projection: {_id: 0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray()
    },
    async createUser(newUser: UserType, passwordHash: string): Promise<UserType> {
        const userDBType = {
            _id: new ObjectId,
            passwordHash,
            ...newUser
        }
        await usersCollection.insertOne(userDBType)
        return newUser
    },
    async findByLogin(login:string) {
        const user = await usersCollection.findOne({$regex: login})
        return user
    },
    async deleteUser(id:string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
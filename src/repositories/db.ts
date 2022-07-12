import {MongoClient, ObjectId, WithId} from "mongodb";

// export interface pagination {
//     pagesCount: number,
//     page: number,
//     pageSize: number,
//     totalCount: number
//     }
// export interface bloggerWithPag extends pagination {
//     items: BloggerType[]
// }



export type BloggerType = {
    id: string,
    name: string,
    youtubeUrl: string
}

export type BloggerPagType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BloggerType[]
}



export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string
}

export type PostPagType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}



export type UserType = {
    id: string,
    login: string
}

export type UserPagType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserType[]
}

export type UserDBType = WithId<{
    _id: ObjectId
    id: string
    login: string
    passwordHash: string
}>

export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: string
}

export type CommentPagType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentType[]
}

const mongoUri =
    process.env.mongoUri ||
        "mongodb://0.0.0.0:27017";
const mongoUriCloud = "mongodb://adminadmin:qwertyqwerty@ac-elscy7v-shard-00-00.1kg0qnf.mongodb.net:27017,ac-elscy7v-shard-00-01.1kg0qnf.mongodb.net:27017,ac-elscy7v-shard-00-02.1kg0qnf.mongodb.net:27017/?ssl=true&replicaSet=atlas-vr4d13-shard-0&authSource=admin&retryWrites=true&w=majority"
export const client = new MongoClient(mongoUriCloud)

const db = client.db("bloggers-api");
export const bloggersCollection = db.collection<BloggerType>("bloggers");
export const postsCollection = db.collection<PostType>("posts");
export const usersCollection = db.collection<UserDBType>("users");
export const commentsCollection = db.collection<CommentType>("comments");


export async function runDb() {
    try {
        await client.connect()
        await client.db("bloggers-api").command({ping: 1})
        console.log("Connected successfully to mongo")
    } catch {
        await client.close()
        console.log("Not connect to mongo")
    }
}
import {MongoClient} from "mongodb";

export type BloggerType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export type BloggerPagType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BloggerType
}

export type PostType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName: string
}

const mongoUri =
    process.env.mongoUri ||
        "mongodb://0.0.0.0:27017";
const mongoUriCloud = "mongodb://adminadmin:qwertyqwerty@ac-elscy7v-shard-00-00.1kg0qnf.mongodb.net:27017,ac-elscy7v-shard-00-01.1kg0qnf.mongodb.net:27017,ac-elscy7v-shard-00-02.1kg0qnf.mongodb.net:27017/?ssl=true&replicaSet=atlas-vr4d13-shard-0&authSource=admin&retryWrites=true&w=majority"
export const client = new MongoClient(mongoUri)

const db = client.db("bloggers-api");
export const bloggersCollection = db.collection<BloggerType>("bloggers");
export const postsCollection = db.collection<PostType>("posts");

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
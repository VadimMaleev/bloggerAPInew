import {commentsCollection, CommentType} from "./db";
import {ObjectId} from "mongodb";

export const commentsRepository = {

    async forCount(id: string): Promise <number> {
        return commentsCollection.countDocuments({postId: id})
    },
    async findCommentsForPost(id: string, page: number, pageSize: number): Promise <CommentType[]> {
        return commentsCollection.find({postId: id}, {projection: {_id: 0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray();
    },
    async createComment(newComment: CommentType, id: string): Promise <CommentType> {
        const commentDbType = {
            _id: new ObjectId(),
            postId: id,
            ... newComment
        }
        await commentsCollection.insertOne(commentDbType)
        return newComment
    }
}
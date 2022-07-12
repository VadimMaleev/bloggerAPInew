import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {
    contentPostsValidation,
    shortDescriptionPostValidation,
    titlePostValidation
} from "../middlewares/posts-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authMiddleware, jwtAuthMiddleware} from "../middlewares/authorization-middware";
import {bloggersService} from "../domain/bloggers-service";
import {commentsService} from "../domain/comments-service";
import {commentsValidation} from "../middlewares/comments-validation-middleware";


export const postsRouter = Router({})


postsRouter.get('/', async (req: Request, res: Response) => {
    const page = isNaN(Number(req.query.PageNumber)) ? 1 : +req.query.PageNumber!
    const pageSize = isNaN(Number(req.query.PageSize)) ? 10 : +req.query.PageSize!

    let posts = await postsService.findAllPosts(page, pageSize)
    res.status(200).send(posts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postsService.findPostById(req.params.id)
    if (post) {
        res.send(post).status(200)
    } else {
        res.send(404)
    }
})

postsRouter.post('/',
    authMiddleware,
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostsValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const newPost = await postsService.createPost(req.body.title,
            req.body.shortDescription, req.body.content, req.body.bloggerId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).send({
                errorsMessages:
                    [{
                        message: "Blogger not found",
                        field: "bloggerId"
                    }]
            })
        }
    })

postsRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

postsRouter.put('/:id',
    authMiddleware,
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostsValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const blogger = await bloggersService.findBloggerById(req.body.bloggerId)
        if (blogger) {
            const isUpdated = await postsService.updatePost(req.params.id, req.body.title,
                req.body.shortDescription, req.body.content, req.body.bloggerId)
            if (isUpdated) {
                const post = await postsService.findPostById(req.params.id)
                res.status(204).send(post)
            } else {
                res.send(404)
            }
        } else {
            res.status(400).send({
                errorsMessages:
                    [{
                        message: "Blogger not found",
                        field: "bloggerId"
                    }]
            })
        }
    })

postsRouter.get('/:id/comments', async (req: Request, res: Response) => {
    const page = isNaN(Number(req.query.PageNumber)) ? 1 : +req.query.PageNumber!
    const pageSize = isNaN(Number(req.query.PageSize)) ? 10 : +req.query.PageSize!

    let comments = await commentsService.findCommentsForPost(page, pageSize, req.params.id)
    if (comments === null) {
        res.send(404)
    } else {
        res.status(200).send(comments)
    }
})

postsRouter.post('/:id/comments',
    jwtAuthMiddleware,
    commentsValidation,
    async (req: Request, res: Response) => {
        const newComment = await commentsService.createComment(req.params.id, req.body.content, req.user!.id, req.user!.login)
        if (newComment === null) {
            res.send(404)
        } else {
            res.status(201).send(newComment)
        }
    })

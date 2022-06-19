import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {
    contentPostsValidation,
    shortDescriptionPostValidation,
    titlePostValidation
} from "../middlewares/posts-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authMiddleware} from "../middlewares/authorization-middware";

export const postsRouter = Router ({})



postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepository.findAllPosts()
    res.send(posts)
})

postsRouter.get ('/:id', async (req: Request, res: Response) => {
    const post = await postsRepository.findPostById(+req.params.id)
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
        const newPost = await postsRepository.createPost(req.body.title,
            req.body.shortDescription, req.body.content, +req.body.bloggerId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.send(400)
        }
    })

postsRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsRepository.deletePost(+req.params.id)
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
        const isUpdated = await postsRepository.updatePost(+req.params.id, req.body.title,
            req.body.shortDescription, req.body.content, +req.body.bloggerId)
        if (isUpdated) {
            const post = await postsRepository.findPostById(+req.params.id)
            res.status(204).send(post)
        } else {
            res.send(404)
        }
    })

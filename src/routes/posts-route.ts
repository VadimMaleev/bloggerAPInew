import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";

export const postsRouter = Router ({})



postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.findAllPosts()
    res.send(posts)
})

postsRouter.get ('/:id', (req: Request, res: Response) => {
    const post = postsRepository.findPostById(+req.params.id)
    if (post) {
        res.send(post).status(200)
    } else {
        res.send(404)
    }
})

postsRouter.post('/', (req: Request, res: Response) => {
    const newPost = postsRepository.createPost(req.body.title,
        req.body.shortDescription, req.body.content, +req.body.bloggerId)
    if (newPost) {
        res.send(newPost).status(201)
    } else {
        res.send(400)
    }
})

postsRouter.delete('/:id',(req: Request, res: Response)=>{
    const isDeleted = postsRepository.deletePost(+req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})

postsRouter.put('/:id',(req: Request, res: Response)=>{
    const isUpdated = postsRepository.updatePost(+req.params.id, req.body.title,
        req.body.shortDescription, req.body.content, +req.body.bloggerId)
    if (isUpdated) {
        const post = postsRepository.findPostById(+req.params.id)
        res.send(post)
        } else {
        res.send(404)
    }
})

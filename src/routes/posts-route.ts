import {Request, Response, Router} from "express";
import {bloggers} from "./bloggers-route";

export const postsRouter = Router ({})

const posts: Array<{ id: number, title: string, shortDescription: string,
    content: string, bloggerId: number, bloggerName: string}> = []

postsRouter.get('/', (req: Request, res: Response) => {
    res.send(posts)
})

postsRouter.get ('/:id', (req: Request, res: Response) => {
    let post = posts.find(b => b.id === +req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.send(404)
    }
})

postsRouter.post('/', (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === +req.body.bloggerId)
    if (blogger) {
        const newPost = {
            id: +(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: +req.body.bloggerId,
            bloggerName: blogger.name
        }
        posts.push(newPost)
        res.send(newPost).status(201)
    } else {
        res.send(400)
    }
})

postsRouter.delete('/:id',(req: Request, res: Response)=>{
    for (let i=0; i<posts.length; i++) {
        if (posts[i].id === +req.params.id) {
            posts.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

postsRouter.put('/:id',(req: Request, res: Response)=>{
    const blogger = bloggers.find(b => b.id === +req.body.bloggerId)
    if (blogger) {
        let post = posts.find(v => v.id === +req.params.id)
        if (post) {
            post.title = req.body.title
            post.shortDescription = req.body.shortDescription
            post.content = req.body.content
            post.bloggerId = req.body.bloggerId
            post.bloggerName = blogger.name
            res.send(post).status(201)
        } else {
            res.send(404)
        }
    } else {
        res.send(400)
    }
})

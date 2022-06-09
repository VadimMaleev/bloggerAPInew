import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(bodyParser.json())

const bloggers: Array<{ id: number, name: string, youtubeUrl: string}> = []
const posts: Array<{ id: number, title: string, shortDescription: string,
    content: string, bloggerId: number, bloggerName: string}> = []



app.get('/bloggers', (req: Request, res: Response) => {
    res.send(bloggers)
})

app.get ('/bloggers/:id', (req: Request, res: Response) => {
    let blogger = bloggers.find(b => b.id === +req.params.id)
    if (blogger) {
        res.status(200).send(blogger)
        } else {
            res.send(404)
    }
})

app.post('/bloggers', (req: Request, res: Response) => {
    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.send(newBlogger).status(201)
})

app.delete('/bloggers/:id',(req: Request, res: Response)=>{
    for (let i=0; i<bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

app.put('/bloggers/:id',(req: Request, res: Response)=>{
    let blogger = bloggers.find(v => v.id === +req.params.id)
    if (blogger) {
        blogger.name = req.body.name
        blogger.youtubeUrl = req.body.youtubeUrl
        res.send(blogger).status(201)
    } else {
        res.send(404)
    }
})



app.get('/posts', (req: Request, res: Response) => {
    res.send(posts)
})

app.get ('/posts/:id', (req: Request, res: Response) => {
    let post = posts.find(b => b.id === +req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.send(404)
    }
})

app.post('/posts', (req: Request, res: Response) => {
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

app.delete('/posts/:id',(req: Request, res: Response)=>{
    for (let i=0; i<posts.length; i++) {
        if (posts[i].id === +req.params.id) {
            posts.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

app.put('/posts/:id',(req: Request, res: Response)=>{
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
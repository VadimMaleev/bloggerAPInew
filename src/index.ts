import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import {bloggersRouter} from "./routes/bloggers-route";
import {postsRouter} from "./routes/posts-route";
import {usersRouter} from "./routes/users-route";
import {runDb} from './repositories/db'
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {testingRouter} from "./routes/testing-route";

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`App listening port ${port}`)
    })
}

startApp()
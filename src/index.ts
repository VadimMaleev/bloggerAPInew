import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import {bloggersRouter} from "./routes/bloggers-route";
import {postsRouter} from "./routes/posts-route";
import {runDb} from './repositories/db'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`App listening port ${port}`)
    })
}

startApp()
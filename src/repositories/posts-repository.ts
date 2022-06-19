import {bloggers} from "./bloggers-repository";

const posts: Array<{ id: number, title: string, shortDescription: string,
    content: string, bloggerId: number, bloggerName: string}> = []

type PostType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName: string
}

export const postsRepository = {
    async findAllPosts(): Promise<PostType[]> {
        return posts
    },
    async findPostById(id: number): Promise<PostType | undefined> {
        return posts.find(p => p.id === id)
    },
    async createPost(title: string, shortDescription: string,
                     content: string, bloggerId: number): Promise<PostType | undefined> {
        const blogger = bloggers.find(b => b.id === bloggerId)
        if (blogger) {
            const newPost = {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: blogger.name
            }
            posts.push(newPost)
            return newPost
        }
    },
    async deletePost (id: number): Promise<boolean> {
        for (let i=0; i<posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                return true
            }
        }
        return false
    },
    async updatePost (id: number, title: string, shortDescription: string,
                content: string, bloggerId: number): Promise<boolean | /*удалить при переходе на монгу--->*/undefined> {
        const blogger = bloggers.find(b => b.id === bloggerId)
        if (blogger) {
            let post = posts.find(v => v.id === id)
            if (post) {
                post.title = title
                post.shortDescription = shortDescription
                post.content = content
                post.bloggerId = bloggerId
               // post.bloggerName = blogger.name
                return true
            } else {
                return false
            }
        }
    }
}
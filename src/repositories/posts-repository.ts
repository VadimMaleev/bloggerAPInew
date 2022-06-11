import {bloggers} from "./bloggers-repository";

const posts: Array<{ id: number, title: string, shortDescription: string,
    content: string, bloggerId: number, bloggerName: string}> = []

export const postsRepository = {
    findAllPosts(){
        return posts
    },
    findPostById(id: number) {
        return posts.find(p => p.id === id)
    },
    createPost(title: string, shortDescription: string, content: string, bloggerId: number) {
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
    deletePost (id: number) {
        for (let i=0; i<posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                return true
            }
        }
        return false
    },
    updatePost (id: number, title: string, shortDescription: string,
                content: string, bloggerId: number) {
        const blogger = bloggers.find(b => b.id === bloggerId)
        if (blogger) {
            let post = posts.find(v => v.id === id)
            if (post) {
                post.title = title
                post.shortDescription = shortDescription
                post.content = content
                post.bloggerId = bloggerId
                post.bloggerName = blogger.name
                return true
            } else {
                return false
            }
        }
    }
}
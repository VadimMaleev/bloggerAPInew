export const bloggers: Array<{ id: number, name: string, youtubeUrl: string}> = []

export const bloggersRepository = {
    findAllBloggers() {
        return bloggers
    },
    findBloggerById (id: number) {
        return bloggers.find(b => b.id === id)
    },
    createBlogger (name: string, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger
    },
    deleteBlogger (id:number) {
        for (let i=0; i<bloggers.length; i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1)
                return true
            }
        }
        return false
    },
    updateBlogger (id:number, name: string, youtubeUrl: string) {
        let blogger = bloggers.find(v => v.id === id)
        if (blogger) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl
            return true
        } else {
            return false
        }
    }
}

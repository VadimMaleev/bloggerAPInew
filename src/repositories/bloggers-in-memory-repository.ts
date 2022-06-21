export const bloggers: Array<{ id: number, name: string, youtubeUrl: string}> = []
type BloggerType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export const bloggersRepository = {
    async findAllBloggers(): Promise<BloggerType[]> {
        return bloggers
    },
    async findBloggerById (id: number): Promise<BloggerType | undefined> {
        return bloggers.find(b => b.id === id)
    },
    async createBlogger (name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger
    },
    async deleteBlogger (id:number): Promise<boolean> {
        for (let i=0; i<bloggers.length; i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1)
                return true
            }
        }
        return false
    },
    async updateBlogger (id:number, name: string, youtubeUrl: string): Promise<boolean> {
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

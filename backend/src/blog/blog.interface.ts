export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  readTime: number
  tags: string[]
  imageUrl?: string
  featured?: boolean
}

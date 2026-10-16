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
  mediaUrls?: string[]
  featured?: boolean
}

export interface CreateBlogPostDto {
  title: string
  slug?: string
  excerpt: string
  content: string
  tags: string[]
  imageUrl?: string
  mediaUrls?: string[]
  featured?: boolean
  readTime?: number
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {}

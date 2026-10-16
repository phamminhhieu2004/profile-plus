import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto } from './blog.interface'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const INITIAL_POSTS = [
  {
    title: 'Giới thiệu về Google Gemini AI: Hướng dẫn cho developer',
    slug: 'gioi-thieu-ve-google-gemini-ai-huong-dan-cho-developer',
    excerpt:
      'Tìm hiểu về Gemini API của Google, cách tích hợp vào ứng dụng, streaming response và các use case phổ biến.',
    content: `Google Gemini đem đến thế hệ AI đa phương thức đột phá:
- Sử dụng Google Generative AI SDK cho Node.js/TypeScript và Python.
- Streaming response với SSE (Server-Sent Events) để có trải nghiệm người dùng siêu mượt.
- Tùy biến system instructions để định hình phong cách phản hồi của AI.`,
    readTime: 10,
    tags: ['Gemini', 'AI', 'Google'],
    imageUrl: '/assets/picture1.jpg',
    mediaUrls: [],
    featured: true,
  },
]

@Injectable()
export class BlogService implements OnModuleInit {
  async onModuleInit() {
    await this.seedInitialPosts()
  }

  private async seedInitialPosts() {
    try {
      const count = await prisma.blogPost.count()
      if (count === 0) {
        for (const post of INITIAL_POSTS) {
          await prisma.blogPost.create({ data: post })
        }
        console.log(`[BlogService] Seeded ${INITIAL_POSTS.length} default blog posts.`)
      }
    } catch (err: any) {
      console.warn(`[BlogService] Could not seed posts: ${err.message}`)
    }
  }

  private formatPost(p: any): BlogPost {
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags || [],
      imageUrl: p.imageUrl || undefined,
      mediaUrls: p.mediaUrls || [],
      featured: p.featured,
      readTime: p.readTime || 5,
      date: p.createdAt ? p.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    }
  }

  async findAll(query?: { tag?: string; search?: string }): Promise<BlogPost[]> {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      })

      let list = posts.map(this.formatPost)

      if (query?.tag) {
        const tagLower = query.tag.toLowerCase()
        list = list.filter((p) => p.tags.some((t: string) => t.toLowerCase() === tagLower))
      }

      if (query?.search) {
        const s = query.search.toLowerCase()
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.excerpt.toLowerCase().includes(s) ||
            p.content.toLowerCase().includes(s)
        )
      }

      return list
    } catch {
      // Fallback in-memory
      return INITIAL_POSTS.map((p, idx) => ({
        ...p,
        id: String(idx + 1),
        date: '2024-10-01',
      }))
    }
  }

  async findOne(idOrSlug: string): Promise<BlogPost> {
    try {
      const post = await prisma.blogPost.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
      })
      if (!post) throw new NotFoundException(`Blog post with ID or Slug '${idOrSlug}' not found`)
      return this.formatPost(post)
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err
      const fallback = INITIAL_POSTS.find((p, idx) => String(idx + 1) === idOrSlug || p.slug === idOrSlug)
      if (!fallback) throw new NotFoundException(`Blog post '${idOrSlug}' not found`)
      return { ...fallback, id: idOrSlug, date: '2024-10-01' }
    }
  }

  async getAllTags(): Promise<string[]> {
    try {
      const posts = await prisma.blogPost.findMany({ select: { tags: true } })
      const set = new Set<string>()
      posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
      return Array.from(set)
    } catch {
      const set = new Set<string>()
      INITIAL_POSTS.forEach((p) => p.tags.forEach((t) => set.add(t)))
      return Array.from(set)
    }
  }

  async create(dto: CreateBlogPostDto): Promise<BlogPost> {
    let slug = dto.slug ? slugify(dto.slug) : slugify(dto.title)
    if (!slug) slug = `post-${Date.now()}`

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }

    const created = await prisma.blogPost.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        tags: dto.tags || [],
        imageUrl: dto.imageUrl || (dto.mediaUrls && dto.mediaUrls.length > 0 ? dto.mediaUrls[0] : null),
        mediaUrls: dto.mediaUrls || [],
        featured: dto.featured || false,
        readTime: dto.readTime || Math.max(1, Math.ceil(dto.content.split(/\s+/).length / 200)),
      },
    })

    return this.formatPost(created)
  }

  async update(id: string, dto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException(`Blog post '${id}' not found`)

    let slug = post.slug
    if (dto.slug && dto.slug !== post.slug) {
      slug = slugify(dto.slug)
      const existing = await prisma.blogPost.findUnique({ where: { slug } })
      if (existing && existing.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.slug !== undefined && { slug }),
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.mediaUrls !== undefined && { mediaUrls: dto.mediaUrls }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.readTime !== undefined && { readTime: dto.readTime }),
      },
    })

    return this.formatPost(updated)
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException(`Blog post '${id}' not found`)

    await prisma.blogPost.delete({ where: { id } })
    return { success: true, message: 'Đã xóa bài viết thành công' }
  }
}

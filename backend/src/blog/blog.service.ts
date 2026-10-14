import { Injectable, NotFoundException } from '@nestjs/common'
import { BlogPost } from './blog.interface'

@Injectable()
export class BlogService {
  private posts: BlogPost[] = [
    {
      id: '1',
      title: 'Xây dựng RESTful API hiệu năng cao với Spring Boot',
      slug: 'xay-dung-restful-api-hieu-nang-cao-voi-spring-boot',
      excerpt:
        'Khám phá các best practices khi xây dựng API với Spring Boot, từ kiến trúc layered đến tối ưu database queries.',
      content: `Trong bài viết này, chúng ta sẽ tìm hiểu về cách xây dựng một RESTful API hiệu năng cao với Spring Boot:
- Kiến trúc 3 tầng: Controller, Service, Repository.
- Tối ưu truy vấn JPA/Hibernate bằng fetch joins và pagination.
- Caching chiến lược với Redis.
- Asynchronous task processing và message queues.`,
      date: '2024-10-01',
      readTime: 8,
      tags: ['Spring Boot', 'Backend', 'Java', 'API'],
      imageUrl: '/assets/picture1.jpg',
      featured: true,
    },
    {
      id: '2',
      title: 'FastAPI vs Spring Boot: Khi nào dùng cái nào?',
      slug: 'fastapi-vs-spring-boot-khi-nao-dung-cai-nao',
      excerpt:
        'So sánh chi tiết hai framework backend phổ biến nhất. Hiểu khi nào nên chọn Python FastAPI và khi nào Spring Boot Java là lựa chọn đúng.',
      content: `FastAPI và Spring Boot đều là những công cụ tuyệt vời:
- FastAPI: Cực nhẹ, asynchronous native, hoàn hảo cho microservices tích hợp mô hình Machine Learning/AI.
- Spring Boot: Hệ sinh thái phong phú, tính ổn định cấp doanh nghiệp, bảo mật với Spring Security.`,
      date: '2024-09-20',
      readTime: 12,
      tags: ['FastAPI', 'Spring Boot', 'Backend', 'Python'],
      imageUrl: '/assets/picture2.jpg',
      featured: false,
    },
    {
      id: '3',
      title: 'Chẩn đoán lỗi xe ô tô với OBD-II và Python',
      slug: 'chan-doan-loi-xe-o-to-voi-obd-ii-va-python',
      excerpt:
        'Hướng dẫn kết nối cổng OBD-II của xe với Python để đọc dữ liệu ECU, phân tích mã lỗi và xây dựng dashboard giám sát xe.',
      content: `Sử dụng chuẩn giao thức OBD-II cùng Python và thư viện python-OBD:
- Đọc mã chẩn đoán sự cố (DTCs) trực tiếp từ ECU.
- Lấy thông số thời gian thực: Vòng tua máy (RPM), tốc độ, nhiệt độ nước làm mát.
- Xây dựng hệ thống cảnh báo sớm bằng Python script.`,
      date: '2024-09-10',
      readTime: 15,
      tags: ['Python', 'OBD-II', 'Automotive', 'IoT'],
      imageUrl: '/assets/picture3.jpg',
      featured: false,
    },
    {
      id: '4',
      title: 'Giới thiệu về Google Gemini AI: Hướng dẫn cho developer',
      slug: 'gioi-thieu-ve-google-gemini-ai-huong-dan-cho-developer',
      excerpt:
        'Tìm hiểu về Gemini API của Google, cách tích hợp vào ứng dụng, streaming response và các use case phổ biến.',
      content: `Google Gemini đem đến thế hệ AI đa phương thức đột phá:
- Sử dụng Google Generative AI SDK cho Node.js/TypeScript và Python.
- Streaming response với SSE (Server-Sent Events) để có trải nghiệm người dùng siêu mượt.
- Tùy biến system instructions để định hình phong cách phản hồi của AI.`,
      date: '2024-08-25',
      readTime: 10,
      tags: ['Gemini', 'AI', 'Google', 'TypeScript'],
      imageUrl: '/assets/picture1.jpg',
      featured: true,
    },
  ]

  findAll(query?: { tag?: string; search?: string }): BlogPost[] {
    let result = [...this.posts]

    if (query?.tag) {
      const tagLower = query.tag.toLowerCase()
      result = result.filter((p) => p.tags.some((t: string) => t.toLowerCase() === tagLower))
    }

    if (query?.search) {
      const s = query.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.excerpt.toLowerCase().includes(s) ||
          p.content.toLowerCase().includes(s),
      )
    }

    return result
  }

  findOne(idOrSlug: string): BlogPost {
    const post = this.posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
    if (!post) {
      throw new NotFoundException(`Blog post with ID or Slug '${idOrSlug}' not found`)
    }
    return post
  }

  getAllTags(): string[] {
    const set = new Set<string>()
    this.posts.forEach((p) => p.tags.forEach((t: string) => set.add(t)))
    return Array.from(set)
  }
}

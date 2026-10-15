import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, Tag, ArrowRight, Calendar } from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'
import heroImg from '../assets/picture1.jpg'
import picture2 from '../assets/picture2.jpg'
import picture3 from '../assets/picture3.jpg'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: number
  tags: string[]
  image: string
  featured?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Xây dựng RESTful API hiệu năng cao với Spring Boot',
    excerpt: 'Khám phá các best practices khi xây dựng API với Spring Boot, từ kiến trúc layered đến tối ưu database queries.',
    content: 'Trong bài viết này, chúng ta sẽ tìm hiểu về cách xây dựng một RESTful API hiệu năng cao với Spring Boot...',
    date: '2024-10-01',
    readTime: 8,
    tags: ['Spring Boot', 'Backend', 'Java', 'API'],
    image: heroImg,
    featured: true,
  },
  {
    id: '2',
    title: 'FastAPI vs Spring Boot: Khi nào dùng cái nào?',
    excerpt: 'So sánh chi tiết hai framework backend phổ biến nhất. Hiểu khi nào nên chọn Python FastAPI và khi nào Spring Boot Java là lựa chọn đúng.',
    content: 'FastAPI và Spring Boot là hai framework mạnh mẽ với các điểm mạnh riêng...',
    date: '2024-09-20',
    readTime: 12,
    tags: ['FastAPI', 'Spring Boot', 'Backend', 'Python'],
    image: picture2,
  },
  {
    id: '3',
    title: 'Chẩn đoán lỗi xe ô tô với OBD-II và Python',
    excerpt: 'Hướng dẫn kết nối cổng OBD-II của xe với Python để đọc dữ liệu ECU, phân tích mã lỗi và xây dựng dashboard giám sát xe.',
    content: 'OBD-II (On-Board Diagnostics) là giao thức chuẩn trên các xe hiện đại...',
    date: '2024-09-10',
    readTime: 15,
    tags: ['Python', 'OBD-II', 'Automotive', 'IoT'],
    image: picture3,
  },
  {
    id: '4',
    title: 'Giới thiệu về Google Gemini AI: Hướng dẫn cho developer',
    excerpt: 'Tìm hiểu về Gemini API của Google, cách tích hợp vào ứng dụng, streaming response và các use case phổ biến.',
    content: 'Google Gemini là model AI mạnh mẽ với khả năng xử lý đa phương thức...',
    date: '2024-08-25',
    readTime: 10,
    tags: ['Gemini AI', 'Google', 'AI/ML', 'API'],
    image: heroImg,
  },
  {
    id: '5',
    title: 'TensorFlow cho người mới: Phân loại ảnh với CNN',
    excerpt: 'Bắt đầu hành trình machine learning với TensorFlow, xây dựng mô hình Convolutional Neural Network để phân loại ảnh từ đầu.',
    content: 'TensorFlow là một trong những framework deep learning phổ biến nhất...',
    date: '2024-08-10',
    readTime: 20,
    tags: ['TensorFlow', 'Python', 'AI/ML', 'CNN'],
    image: picture2,
  },
  {
    id: '6',
    title: 'Docker Compose cho ứng dụng Full-Stack',
    excerpt: 'Cách container hóa ứng dụng full-stack (React + Node.js + PostgreSQL) với Docker Compose, từ development đến production.',
    content: 'Docker và Docker Compose giúp đơn giản hóa quá trình deploy...',
    date: '2024-07-20',
    readTime: 14,
    tags: ['Docker', 'DevOps', 'Backend', 'PostgreSQL'],
    image: picture3,
  },
]

const allTags = [...new Set(BLOG_POSTS.flatMap((p) => p.tags))]

export default function BlogPage() {
  const { t } = useTranslation()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const postsPerPage = 4

  const filtered = selectedTag ? BLOG_POSTS.filter((p) => p.tags.includes(selectedTag)) : BLOG_POSTS
  const totalPages = Math.ceil(filtered.length / postsPerPage)
  const paged = filtered.slice((page - 1) * postsPerPage, page * postsPerPage)

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('blog.title')}</h1>
            <p className="section-subtitle mx-auto">{t('blog.subtitle')}</p>
          </FadeIn>

          {BLOG_POSTS.find((p) => p.featured) && !selectedTag && page === 1 && (
            <FadeIn className="mb-12">
              <Link to={`/blog/${BLOG_POSTS[0].id}`} id="featured-blog-post">
                <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group">
                  <div className="grid lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="eager" decoding="async" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                          style={{ background: 'linear-gradient(135deg, #dc2626, #facc15)' }}>
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {BLOG_POSTS[0].tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.25)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors"
                        style={{ color: 'var(--color-text-primary)' }}>{BLOG_POSTS[0].title}</h2>
                      <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{BLOG_POSTS[0].excerpt}</p>
                      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        <span className="flex items-center gap-1.5"><Calendar size={14} />{BLOG_POSTS[0].date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} />{BLOG_POSTS[0].readTime} {t('blog.min_read')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeIn>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <StaggerContainer className="space-y-6">
                {paged.filter((p) => !(p.featured && !selectedTag && page === 1)).map((post) => (
                  <StaggerItem key={post.id}>
                    <Link to={`/blog/${post.id}`} id={`blog-post-${post.id}`}>
                      <motion.div whileHover={{ x: 4 }} className="card overflow-hidden group flex gap-0 flex-col sm:flex-row">
                        <div className="sm:w-48 h-40 sm:h-auto overflow-hidden flex-shrink-0">
                          <img src={post.image} alt={post.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                            loading="lazy" decoding="async" />
                        </div>
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded-md text-xs font-medium"
                                  style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444' }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="font-bold mb-2 group-hover:text-red-500 transition-colors line-clamp-2"
                              style={{ color: 'var(--color-text-primary)' }}>{post.title}</h3>
                            <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{post.excerpt}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                              <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                              <span className="flex items-center gap-1"><Clock size={12} />{post.readTime} {t('blog.min_read')}</span>
                            </div>
                            <span className="text-xs font-semibold flex items-center gap-1 text-red-500">
                              {t('blog.read_more')} <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {totalPages > 1 && (
                <FadeIn className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      id={`blog-page-${p}`}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                        page === p ? 'text-white shadow-lg' : ''
                      }`}
                      style={page === p
                        ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                        : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                      }
                    >
                      {p}
                    </button>
                  ))}
                </FadeIn>
              )}
            </div>

            <div className="lg:col-span-1">
              <FadeIn>
                <div className="card p-5 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={16} className="text-red-500" />
                    <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('blog.tags')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedTag(null); setPage(1) }}
                      id="blog-tag-all"
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedTag ? 'text-white' : ''}`}
                      style={!selectedTag
                        ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                        : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                      }
                    >
                      All
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { setSelectedTag(tag); setPage(1) }}
                        id={`blog-tag-${tag.toLowerCase().replace(/\//g, '-')}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTag === tag ? 'text-white' : ''}`}
                        style={selectedTag === tag
                          ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                          : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

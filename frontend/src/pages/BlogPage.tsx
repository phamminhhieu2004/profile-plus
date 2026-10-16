import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, Tag, ArrowRight, Calendar, FilePlus, Shield, Sparkles, Edit } from 'lucide-react'
import axios from 'axios'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'
import { useAuthStore, API_BASE_URL } from '../store/authStore'
import heroImg from '../assets/picture1.jpg'

export interface BlogPost {
  id: string
  title: string
  slug?: string
  excerpt: string
  content: string
  date: string
  readTime: number
  tags: string[]
  imageUrl?: string
  image?: string
  mediaUrls?: string[]
  featured?: boolean
}

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'f918c5a7-ce62-496a-8720-c7e29d994e5a',
    title: 'Giới thiệu về Google Gemini AI: Hướng dẫn cho developer',
    slug: 'gioi-thieu-ve-google-gemini-ai-huong-dan-cho-developer',
    excerpt: 'Tìm hiểu về Gemini API của Google, cách tích hợp vào ứng dụng, streaming response và các use case phổ biến.',
    content: 'Google Gemini là model AI mạnh mẽ với khả năng xử lý đa phương thức...',
    date: '2026-10-15',
    readTime: 10,
    tags: ['Gemini', 'AI', 'Google'],
    image: heroImg,
    imageUrl: '/assets/picture1.jpg',
    featured: true,
  },
]

export const BLOG_POSTS = FALLBACK_BLOG_POSTS

export default function BlogPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_BLOG_POSTS)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const postsPerPage = 4

  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.username === 'phamminhhieu18022004' ||
    user?.email === 'phamminhhieu18022004@gmail.com'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blog`)
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setPosts(res.data.data)
        }
      } catch {
        // Fallback
      }
    }
    fetchPosts()
  }, [])

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))]
  const filtered = selectedTag ? posts.filter((p) => p.tags?.includes(selectedTag)) : posts
  const totalPages = Math.ceil(filtered.length / postsPerPage)
  const paged = filtered.slice((page - 1) * postsPerPage, page * postsPerPage)

  const featuredPost = posts.find((p) => p.featured) || posts[0]

  const getPostImg = (p: BlogPost) => {
    return p.imageUrl || p.image || heroImg
  }

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('blog.title')}</h1>
            <p className="section-subtitle mx-auto mb-6">{t('blog.subtitle')}</p>

            {/* Admin Bar */}
            {isAdmin && (
              <div className="inline-flex items-center gap-3 p-2 px-5 rounded-2xl border shadow-lg"
                style={{ background: 'var(--color-surface)', borderColor: 'rgba(220,38,38,0.3)' }}>
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                  <Shield size={14} /> Chế độ Quản trị viên
                </span>
                <Link
                  to="/admin/blog"
                  className="btn-primary !py-1.5 !px-3.5 !text-xs flex items-center gap-1.5"
                >
                  <FilePlus size={14} />
                  <span>Viết bài / Quản lý bài viết</span>
                </Link>
              </div>
            )}
          </FadeIn>

          {featuredPost && !selectedTag && page === 1 && (
            <FadeIn className="mb-12">
              <Link to={`/blog/${featuredPost.slug || featuredPost.id}`} id="featured-blog-post">
                <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group">
                  <div className="grid lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img src={getPostImg(featuredPost)} alt={featuredPost.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="eager" decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = heroImg
                        }} />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                          style={{ background: 'linear-gradient(135deg, #dc2626, #facc15)' }}>
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex flex-wrap gap-2">
                          {(featuredPost.tags || []).slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                              style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.25)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        {isAdmin && (
                          <Link
                            to={`/admin/blog?edit=${featuredPost.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105 z-10"
                            style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                            title="Chỉnh sửa bài viết này"
                          >
                            <Edit size={13} /> Chỉnh sửa
                          </Link>
                        )}
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors"
                        style={{ color: 'var(--color-text-primary)' }}>{featuredPost.title}</h2>
                      <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        <span className="flex items-center gap-1.5"><Calendar size={14} />{featuredPost.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} />{featuredPost.readTime} {t('blog.min_read')}</span>
                        {featuredPost.mediaUrls && featuredPost.mediaUrls.length > 0 && (
                          <span className="text-amber-500 font-semibold text-xs ml-auto">
                            📎 {featuredPost.mediaUrls.length} đa phương tiện
                          </span>
                        )}
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
                {paged.filter((p) => !(p.featured && !selectedTag && page === 1 && p.id === featuredPost?.id)).map((post) => (
                  <StaggerItem key={post.id}>
                    <Link to={`/blog/${post.slug || post.id}`} id={`blog-post-${post.id}`}>
                      <motion.div whileHover={{ x: 4 }} className="card overflow-hidden group flex gap-0 flex-col sm:flex-row">
                        <div className="sm:w-48 h-40 sm:h-auto overflow-hidden flex-shrink-0">
                          <img src={getPostImg(post)} alt={post.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                            loading="lazy" decoding="async"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = heroImg
                            }} />
                        </div>
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex flex-wrap gap-1.5">
                                {(post.tags || []).slice(0, 3).map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 rounded-md text-xs font-medium"
                                    style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444' }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {isAdmin && (
                                <Link
                                  to={`/admin/blog?edit=${post.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-sm transition-all hover:scale-105 z-10"
                                  style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                                  title="Chỉnh sửa bài viết này"
                                >
                                  <Edit size={12} /> Chỉnh sửa
                                </Link>
                              )}
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

            <div className="space-y-6">
              <FadeIn delay={0.1}>
                <div className="card p-6">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <Tag size={16} className="text-red-500" />
                    {t('blog.tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTag(null)}
                      id="blog-tag-all"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        !selectedTag ? 'text-white' : ''
                      }`}
                      style={!selectedTag
                        ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                        : { background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }
                      }
                    >
                      {t('blog.all_posts')}
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        id={`blog-tag-${tag}`}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedTag === tag ? 'text-white' : ''
                        }`}
                        style={selectedTag === tag
                          ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                          : { background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }
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

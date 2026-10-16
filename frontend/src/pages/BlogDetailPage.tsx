import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, Share2, Video, Image as ImageIcon, Loader2, Edit } from 'lucide-react'
import axios from 'axios'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn from '../components/ui/FadeIn'
import { FALLBACK_BLOG_POSTS, BlogPost } from './BlogPage'
import { useAuthStore, API_BASE_URL } from '../store/authStore'
import toast from 'react-hot-toast'
import heroImg from '../assets/picture1.jpg'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.username === 'phamminhhieu18022004' ||
    user?.email === 'phamminhhieu18022004@gmail.com'

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/blog/${id}`)
        if (res.data?.success && res.data?.data) {
          setPost(res.data.data)
        } else {
          const fallback = FALLBACK_BLOG_POSTS.find((p) => p.id === id || p.slug === id)
          setPost(fallback || null)
        }
      } catch {
        const fallback = FALLBACK_BLOG_POSTS.find((p) => p.id === id || p.slug === id)
        setPost(fallback || null)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPost()
  }, [id])

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blog`)
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setRelated(res.data.data.filter((p: BlogPost) => p.id !== id && p.slug !== id).slice(0, 2))
        } else {
          setRelated([])
        }
      } catch {
        setRelated([])
      }
    }
    fetchRelated()
  }, [id])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép liên kết vào bộ nhớ tạm!')
    } catch {
      toast.error('Không thể sao chép liên kết')
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Đang tải bài viết...</p>
        </div>
      </PageWrapper>
    )
  }

  if (!post) {
    return (
      <PageWrapper>
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Không tìm thấy bài viết</h1>
          <Link to="/blog" className="btn-primary">Quay lại Blog</Link>
        </div>
      </PageWrapper>
    )
  }

  const postImg = post.imageUrl || post.image || heroImg

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center justify-between gap-4 mb-8">
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-sm transition-colors hover:text-red-500"
                style={{ color: 'var(--color-text-secondary)' }}
                id="blog-detail-back"
              >
                <ArrowLeft size={16} />
                {t('blog.all_posts')}
              </button>
              {isAdmin && (
                <Link
                  to={`/admin/blog?edit=${post.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                  id="blog-detail-edit"
                >
                  <Edit size={14} /> Chỉnh sửa bài viết
                </Link>
              )}
            </div>
          </FadeIn>

          <FadeIn className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.25)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1.5"><Calendar size={14} />{post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime} {t('blog.min_read')}</span>
              <button onClick={handleShare} className="flex items-center gap-1.5 transition-colors hover:text-red-500 ml-auto" id="blog-share">
                <Share2 size={14} /> Chia sẻ
              </button>
            </div>
          </FadeIn>

          {/* Cover image */}
          {postImg && (
            <FadeIn delay={0.1} className="mb-10">
              <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: '1px solid var(--color-border)' }}>
                <img
                  src={postImg}
                  alt={post.title}
                  className="w-full h-80 sm:h-96 object-cover object-top"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = heroImg
                  }}
                />
              </div>
            </FadeIn>
          )}

          {/* Main Content */}
          <FadeIn delay={0.2}>
            <div className="card p-6 sm:p-10 mb-12 rounded-3xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              {post.excerpt && (
                <p className="text-lg leading-relaxed mb-8 font-medium italic p-4 rounded-xl border-l-4 border-red-500"
                  style={{ background: 'rgba(220,38,38,0.03)', color: 'var(--color-text-primary)' }}>
                  {post.excerpt}
                </p>
              )}

              <div
                className="prose max-w-none whitespace-pre-wrap leading-relaxed text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {post.content}
              </div>

              {/* ATTACHED MEDIA (Images & Videos) */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <span>Tệp phương tiện đính kèm ({post.mediaUrls.length})</span>
                  </h3>

                  <div className="space-y-6">
                    {post.mediaUrls.map((url, index) => {
                      const isVideo = url.match(/\.(mp4|webm|mov|ogg)$/i)
                      if (isVideo) {
                        return (
                          <div key={index} className="rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="p-2.5 bg-black/60 flex items-center gap-2 text-xs font-medium text-white">
                              <Video size={14} className="text-red-500" />
                              <span>Video đính kèm #{index + 1}</span>
                            </div>
                            <video controls className="w-full max-h-[500px] bg-black" src={url} />
                          </div>
                        )
                      }
                      return (
                        <div key={index} className="rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: 'var(--color-border)' }}>
                          <img
                            src={url}
                            alt={`Hình ảnh đính kèm ${index + 1}`}
                            className="w-full max-h-[600px] object-cover"
                            loading="lazy"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Tags */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="flex items-center gap-1.5 text-sm font-medium mr-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Tag size={14} className="text-red-500" /> Chủ đề:
              </span>
              {(post.tags || []).map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:border-red-500/50"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </FadeIn>

          {/* Related Posts */}
          {related.length > 0 && (
            <FadeIn delay={0.4}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Bài viết liên quan</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {related.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug || p.id}`} id={`related-post-${p.id}`}>
                    <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group">
                      <div className="h-36 overflow-hidden">
                        <img
                          src={p.imageUrl || p.image || heroImg}
                          alt={p.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = heroImg
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors"
                          style={{ color: 'var(--color-text-primary)' }}>{p.title}</h3>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.date} · {p.readTime} {t('blog.min_read')}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

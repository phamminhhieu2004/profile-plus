import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn from '../components/ui/FadeIn'
import { BLOG_POSTS } from './BlogPage'
import toast from 'react-hot-toast'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const post = BLOG_POSTS.find((p) => p.id === id)
  const related = BLOG_POSTS.filter((p) => p.id !== id).slice(0, 2)

  if (!post) {
    return (
      <PageWrapper>
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Post not found</h1>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </PageWrapper>
    )
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-indigo-500"
              style={{ color: 'var(--color-text-secondary)' }} id="blog-detail-back">
              <ArrowLeft size={16} />
              {t('blog.all_posts')}
            </button>
          </FadeIn>

          <FadeIn className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1.5"><Calendar size={14} />{post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime} {t('blog.min_read')}</span>
              <button onClick={handleShare} className="flex items-center gap-1.5 transition-colors hover:text-indigo-500 ml-auto" id="blog-share">
                <Share2 size={14} /> Share
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="mb-10">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
              <img src={post.image} alt={post.title} className="w-full h-72 object-cover" loading="eager" decoding="async" />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="card p-8 mb-12">
              <div className="prose max-w-none" style={{ color: 'var(--color-text-secondary)' }}>
                <p className="text-lg leading-relaxed mb-6 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {post.excerpt}
                </p>
                <p className="leading-relaxed mb-4">{post.content}</p>
                <p className="leading-relaxed mb-4">
                  Trong thế giới phát triển phần mềm hiện đại, việc lựa chọn đúng framework và công nghệ phù hợp là một trong những quyết định quan trọng nhất. Bài viết này sẽ đi sâu vào các khía cạnh thực tế, từ kiến trúc hệ thống đến tối ưu hóa hiệu năng.
                </p>
                <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text-primary)' }}>Tại sao điều này quan trọng?</h2>
                <p className="leading-relaxed mb-4">
                  Khi xây dựng hệ thống backend, việc hiểu rõ các trade-off giữa các công nghệ giúp chúng ta đưa ra quyết định sáng suốt hơn. Mỗi framework đều có điểm mạnh và điểm yếu riêng.
                </p>
                <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text-primary)' }}>Kết luận</h2>
                <p className="leading-relaxed">
                  Không có giải pháp nào là hoàn hảo cho mọi tình huống. Việc lựa chọn phụ thuộc vào yêu cầu cụ thể của dự án, team expertise, và các ràng buộc về hiệu năng.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="flex items-center gap-1.5 text-sm font-medium mr-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Tag size={14} /> Tags:
              </span>
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?tag=${tag}`}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:border-indigo-500/50"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  {tag}
                </Link>
              ))}
            </div>
          </FadeIn>

          {related.length > 0 && (
            <FadeIn delay={0.4}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Bài viết liên quan</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {related.map((p) => (
                  <Link key={p.id} to={`/blog/${p.id}`} id={`related-post-${p.id}`}>
                    <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group">
                      <div className="h-32 overflow-hidden">
                        <img src={p.image} alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy" decoding="async" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-indigo-500 transition-colors"
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

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FilePlus,
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Tag,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react'
import axios from 'axios'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn from '../components/ui/FadeIn'
import { useAuthStore, API_BASE_URL } from '../store/authStore'
import toast from 'react-hot-toast'

interface BlogPostItem {
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

export default function AdminBlogPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editParam = searchParams.get('edit')
  const { user, accessToken } = useAuthStore()

  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.username === 'phamminhhieu18022004' ||
    user?.email === 'phamminhhieu18022004@gmail.com'

  const [posts, setPosts] = useState<BlogPostItem[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(true)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [rememberedTags, setRememberedTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('profile_plus_remembered_tags')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [imageUrl, setImageUrl] = useState('')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [featured, setFeatured] = useState(false)
  const [readTime, setReadTime] = useState(5)

  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!user) {
      toast.error('Vui lòng đăng nhập với tài khoản Admin')
      navigate('/login')
      return
    }
    if (!isAdmin) {
      toast.error('Chỉ tài khoản Admin mới có quyền truy cập trang này')
      navigate('/')
      return
    }
    fetchPosts()
  }, [user, isAdmin, navigate])

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/blog`)
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setPosts(res.data.data)
        const postTags: string[] = res.data.data.flatMap((p: BlogPostItem) => p.tags || [])
        setRememberedTags((prev) => {
          const merged = Array.from(new Set([...prev, ...postTags]))
          try {
            localStorage.setItem('profile_plus_remembered_tags', JSON.stringify(merged))
          } catch {}
          return merged
        })
      }
    } catch (err: any) {
      toast.error('Không thể tải danh sách bài viết')
    } finally {
      setLoadingPosts(false)
    }
  }

  // Handle media file upload (multiple images/videos)
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    setUploading(true)
    const toastId = toast.loading(`Đang tải lên ${files.length} tệp phương tiện...`)
    try {
      const res = await axios.post(`${API_BASE_URL}/blog/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (res.data?.urls) {
        setMediaUrls((prev) => [...prev, ...res.data.urls])
        // If no cover image yet, set first uploaded image as cover
        if (!imageUrl && res.data.urls.length > 0) {
          const firstImg = res.data.urls.find((u: string) => !u.match(/\.(mp4|webm|mov|ogg)$/i))
          if (firstImg) setImageUrl(firstImg)
        }
        toast.success(`Đã tải lên thành công ${res.data.urls.length} tệp!`, { id: toastId })
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tải tệp lên thất bại', { id: toastId })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeMedia = (urlToRemove: string) => {
    setMediaUrls((prev) => prev.filter((u) => u !== urlToRemove))
    if (imageUrl === urlToRemove) {
      setImageUrl('')
    }
  }

  const insertMediaToContent = (url: string) => {
    const isVideo = url.match(/\.(mp4|webm|mov|ogg)$/i)
    const snippet = isVideo
      ? `\n<video controls class="w-full rounded-2xl my-4" src="${url}"></video>\n`
      : `\n![Hình ảnh](${url})\n`

    if (contentTextareaRef.current) {
      const start = contentTextareaRef.current.selectionStart
      const end = contentTextareaRef.current.selectionEnd
      const newContent = content.substring(0, start) + snippet + content.substring(end)
      setContent(newContent)
      toast.success('Đã chèn vào nội dung bài viết!')
    } else {
      setContent((prev) => prev + snippet)
      toast.success('Đã chèn vào cuối bài viết!')
    }
  }

  const handleAddTag = (customVal?: string) => {
    const val = (customVal !== undefined ? customVal : tagInput).trim()
    if (val && !tags.includes(val)) {
      const nextTags = [...tags, val]
      setTags(nextTags)
      if (customVal === undefined) setTagInput('')
      setRememberedTags((prev) => {
        const next = Array.from(new Set([...prev, val]))
        try {
          localStorage.setItem('profile_plus_remembered_tags', JSON.stringify(next))
        } catch {}
        return next
      })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setTags([])
    setImageUrl('')
    setMediaUrls([])
    setFeatured(false)
    setReadTime(5)
  }

  const handleEditPost = (post: BlogPostItem) => {
    setEditingId(post.id)
    setTitle(post.title)
    setSlug(post.slug)
    setExcerpt(post.excerpt)
    setContent(post.content)
    setTags(post.tags || [])
    setImageUrl(post.imageUrl || '')
    setMediaUrls(post.mediaUrls || [])
    setFeatured(post.featured || false)
    setReadTime(post.readTime || 5)
    setFormOpen(true)
    setTimeout(() => {
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    if (editParam && posts.length > 0) {
      const target = posts.find((p) => p.id === editParam || p.slug === editParam)
      if (target) {
        handleEditPost(target)
      }
    }
  }, [editParam, posts])

  const handleDeletePost = async (id: string, postTitle: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${postTitle}" không?`)) return

    try {
      await axios.delete(`${API_BASE_URL}/blog/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      toast.success('Đã xóa bài viết thành công')
      setPosts((prev) => prev.filter((p) => p.id !== id))
      if (editingId === id) resetForm()
    } catch (err: any) {
      toast.error('Xóa bài viết thất bại')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng điền tiêu đề và nội dung bài viết')
      return
    }

    setSubmitting(true)
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || title.trim().slice(0, 160),
      content: content.trim(),
      tags,
      imageUrl: imageUrl.trim() || undefined,
      mediaUrls,
      featured,
      readTime: Number(readTime) || 5,
    }

    try {
      if (editingId) {
        const res = await axios.put(`${API_BASE_URL}/blog/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        toast.success('Cập nhật bài viết thành công! 🎉')
        setPosts((prev) => prev.map((p) => (p.id === editingId ? res.data.data : p)))
        resetForm()
      } else {
        const res = await axios.post(`${API_BASE_URL}/blog`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        toast.success('Đăng bài viết mới thành công! 🚀')
        setPosts((prev) => [res.data.data, ...prev])
        resetForm()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Banner */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <button
                  onClick={() => navigate('/blog')}
                  className="flex items-center gap-1.5 text-sm mb-3 transition-colors hover:text-red-500"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại trang Blog</span>
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                    Quản trị Blog & Đăng bài
                  </h1>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)', color: 'white' }}
                  >
                    <Shield size={12} />
                    ADMIN
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Đăng tải nội dung kỹ thuật, chia sẻ hình ảnh & video bài viết cho Minh Hieu Dev.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    resetForm()
                    setFormOpen(true)
                  }}
                  className="btn-primary !px-5 !py-2.5 flex items-center gap-2"
                >
                  <FilePlus size={16} />
                  <span>Soạn bài viết mới</span>
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Post Editor Card */}
          {formOpen && (
            <FadeIn delay={0.1} className="mb-12">
              <div
                className="card p-6 sm:p-8 rounded-3xl"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: 'var(--color-border)' }}>
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <Edit size={18} className="text-red-500" />
                    <span>{editingId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</span>
                  </h2>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs px-3 py-1.5 rounded-lg border text-red-500 hover:bg-red-500/10"
                      style={{ borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      Hủy chỉnh sửa
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title & Slug */}
                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Tiêu đề bài viết *
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Tối ưu hiệu năng Spring Boot API với Redis Caching..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Slug (Đường dẫn tĩnh)
                      </label>
                      <input
                        type="text"
                        placeholder="tu-dong-tao-tu-tieu-de"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Tóm tắt ngắn (Excerpt) *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả tóm tắt nội dung để hiển thị trên thẻ bài viết và tìm kiếm..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-y"
                      style={{
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Chủ đề / Thẻ (Tags)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold"
                          style={{
                            background: 'rgba(220,38,38,0.12)',
                            color: '#ef4444',
                            border: '1px solid rgba(220,38,38,0.25)',
                          }}
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:opacity-70 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Nhập tag của bạn (Enter hoặc bấm Thêm)..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag()}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium border hover:bg-[var(--color-surface)]"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                        Thêm
                      </button>
                    </div>

                    {/* Remembered custom tags */}
                    {rememberedTags.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                          🏷️ Thẻ bạn đã từng tạo (bấm để chọn nhanh):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rememberedTags.map((rTag) => {
                            const isSelected = tags.includes(rTag)
                            return (
                              <button
                                key={rTag}
                                type="button"
                                onClick={() => handleAddTag(rTag)}
                                disabled={isSelected}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'opacity-40 cursor-not-allowed'
                                    : 'hover:scale-105 hover:border-red-500/50'
                                }`}
                                style={{
                                  background: 'var(--color-surface)',
                                  border: '1px solid var(--color-border)',
                                  color: isSelected ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                                }}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {rTag}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* MULTI MEDIA UPLOAD (Images & Videos) */}
                  <div
                    className="p-5 rounded-2xl border"
                    style={{
                      background: 'rgba(220,38,38,0.02)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                          <Upload size={16} className="text-red-500" />
                          <span>Tải lên nhiều Ảnh hoặc Video</span>
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                          Hỗ trợ định dạng ảnh (.jpg, .png, .webp, .gif) và video (.mp4, .webm, .mov) tối đa 50MB.
                        </p>
                      </div>

                      <label
                        htmlFor="media-file-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer text-white shadow transition-all ${
                          uploading ? 'opacity-50 pointer-events-none' : 'hover:opacity-90'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                      >
                        <Upload size={15} />
                        <span>{uploading ? 'Đang tải lên...' : 'Chọn file từ máy'}</span>
                        <input
                          id="media-file-upload"
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleMediaUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    {/* Uploaded media previews */}
                    {mediaUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                        {mediaUrls.map((url, idx) => {
                          const isVideo = url.match(/\.(mp4|webm|mov|ogg)$/i)
                          return (
                            <div
                              key={idx}
                              className="group relative rounded-xl overflow-hidden border p-1"
                              style={{
                                background: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                              }}
                            >
                              {isVideo ? (
                                <div className="h-28 w-full bg-black/40 rounded-lg flex flex-col items-center justify-center relative">
                                  <Video size={28} className="text-red-500 mb-1" />
                                  <span className="text-[11px] font-medium text-white/90">Video</span>
                                </div>
                              ) : (
                                <img
                                  src={url}
                                  alt=""
                                  className="h-28 w-full object-cover rounded-lg"
                                />
                              )}

                              <div className="p-1.5 flex items-center justify-between gap-1">
                                <button
                                  type="button"
                                  onClick={() => insertMediaToContent(url)}
                                  className="text-[11px] font-semibold text-red-500 hover:underline"
                                  title="Chèn thẻ Markdown vào nội dung"
                                >
                                  + Chèn vào bài
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeMedia(url)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                  title="Xóa tệp này"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Cover image input */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Ảnh bìa đại diện (Cover Image URL)
                      </label>
                      <input
                        type="text"
                        placeholder="https://... hoặc đường dẫn /uploads/... bên trên"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs outline-none"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Content Editor with Tab */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        Nội dung bài viết (Hỗ trợ Markdown) *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('write')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            activeTab === 'write' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Soạn thảo
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('preview')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            activeTab === 'preview' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Xem trước
                        </button>
                      </div>
                    </div>

                    {activeTab === 'write' ? (
                      <textarea
                        ref={contentTextareaRef}
                        rows={14}
                        placeholder={`# Tiêu đề mục lớn\n\nNội dung chi tiết ở đây...\n\n- Gạch đầu dòng 1\n- Gạch đầu dòng 2\n\n\`\`\`ts\nconst code = "example";\n\`\`\`\n\n![Mô tả ảnh](/uploads/anh.jpg)`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl text-sm font-mono outline-none transition-all leading-relaxed resize-y"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                    ) : (
                      <div
                        className="p-6 rounded-2xl border min-h-[300px] overflow-auto prose max-w-none"
                        style={{
                          background: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        <h2 className="text-2xl font-bold mb-4">{title || 'Tiêu đề xem trước'}</h2>
                        <p className="text-sm italic mb-6 text-slate-400">{excerpt}</p>
                        <div className="whitespace-pre-wrap leading-relaxed text-sm">{content || 'Chưa có nội dung.'}</div>
                      </div>
                    )}
                  </div>

                  {/* Options: Featured & ReadTime */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        Đánh dấu là bài viết Nổi bật (Featured)
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Thời gian đọc (phút):</span>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={readTime}
                        onChange={(e) => setReadTime(Number(e.target.value))}
                        className="w-16 px-2.5 py-1.5 rounded-lg text-sm text-center outline-none"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium border hover:bg-[var(--color-surface)]"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                    >
                      Xóa trắng
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary !px-7 !py-3 flex items-center gap-2 shadow-lg"
                    >
                      <Sparkles size={16} />
                      <span>{submitting ? 'Đang lưu...' : editingId ? 'Lưu cập nhật' : 'Đăng bài ngay'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          )}

          {/* Posts List Header */}
          <FadeIn delay={0.2}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Layers size={18} className="text-red-500" />
                <span>Danh sách tất cả bài viết ({posts.length})</span>
              </h2>
            </div>

            {loadingPosts ? (
              <div className="card p-12 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Đang tải danh sách bài viết...
              </div>
            ) : posts.length === 0 ? (
              <div className="card p-12 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Chưa có bài viết nào. Hãy bấm "Soạn bài viết mới" ở trên để đăng bài đầu tiên!
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-red-500/40"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = '/assets/picture1.jpg'
                          }}
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white/50 flex-shrink-0"
                          style={{ background: 'rgba(220,38,38,0.1)' }}
                        >
                          <ImageIcon size={22} className="text-red-500" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {post.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600">
                              Nổi bật
                            </span>
                          )}
                          {post.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                              style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444' }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-base font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                          {post.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {post.readTime} phút đọc
                          </span>
                          {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <span className="text-amber-500 font-medium">
                              📎 {post.mediaUrls.length} file đính kèm
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        target="_blank"
                        className="p-2 rounded-xl border hover:bg-[var(--color-bg)] transition-colors text-slate-400 hover:text-white"
                        style={{ borderColor: 'var(--color-border)' }}
                        title="Xem bài viết"
                      >
                        <ExternalLink size={16} />
                      </Link>

                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 rounded-xl border hover:bg-[var(--color-bg)] transition-colors text-blue-400 hover:text-blue-300"
                        style={{ borderColor: 'var(--color-border)' }}
                        title="Sửa bài viết"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="p-2 rounded-xl border hover:bg-red-500/10 transition-colors text-red-500"
                        style={{ borderColor: 'rgba(239,68,68,0.2)' }}
                        title="Xóa bài viết"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </PageWrapper>
  )
}

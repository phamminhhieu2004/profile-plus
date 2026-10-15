import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../store/authStore'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ef4444, #f97316)' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f97316, #eab308)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border p-8" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{ background: 'rgba(220,38,38,0.1)' }}>
                    <span className="text-3xl">🔐</span>
                  </div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Quên mật khẩu?</h1>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
                  </p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input
                        type="email"
                        placeholder="ban@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    <span>{loading ? 'Đang gửi...' : 'Gửi link đặt lại'}</span>
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    style={{ color: 'var(--color-text-secondary)' }}>
                    <ArrowLeft size={14} />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Email đã được gửi!</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Chúng tôi đã gửi link đặt lại mật khẩu đến <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>.
                  Vui lòng kiểm tra hộp thư của bạn.
                </p>
                <div className="p-4 rounded-xl mb-6 text-left text-sm space-y-1"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  <p>💡 <strong>Lưu ý:</strong></p>
                  <p>• Kiểm tra cả thư mục <strong>Spam/Junk</strong></p>
                  <p>• Link có hiệu lực trong <strong>1 giờ</strong></p>
                  <p>• Chỉ link gần nhất có hiệu lực</p>
                </div>
                <button onClick={() => setSent(false)}
                  className="text-sm font-medium hover:underline" style={{ color: '#dc2626' }}>
                  Gửi lại email
                </button>
                <div className="mt-4">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    style={{ color: 'var(--color-text-secondary)' }}>
                    <ArrowLeft size={14} />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Check } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../store/authStore'

const passwordRules = [
  { label: 'Ít nhất 8 ký tự', test: (p: string) => p.length >= 8 },
  { label: 'Có chữ hoa', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Có chữ số', test: (p: string) => /\d/.test(p) },
]

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ newPassword: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Link đặt lại không hợp lệ')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    const failedRules = passwordRules.filter((r) => !r.test(form.newPassword))
    if (failedRules.length > 0) {
      setError('Mật khẩu chưa đáp ứng yêu cầu')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword: form.newPassword })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Link có thể đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
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
            {!success ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{ background: 'rgba(220,38,38,0.1)' }}>
                    <Lock size={28} className="text-red-500" />
                  </div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Đặt lại mật khẩu</h1>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Tạo mật khẩu mới cho tài khoản của bạn
                  </p>
                </div>

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
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Mật khẩu mới</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                        value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        required
                        className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {form.newPassword && (
                      <div className="mt-2 space-y-1">
                        {passwordRules.map((rule) => (
                          <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${rule.test(form.newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                              {rule.test(form.newPassword) && <Check size={10} className="text-white" />}
                            </div>
                            <span style={{ color: rule.test(form.newPassword) ? '#22c55e' : 'var(--color-text-muted)' }}>{rule.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Xác nhận mật khẩu</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                        value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: `1px solid ${form.confirm && form.confirm !== form.newPassword ? '#ef4444' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)'
                        }}
                        onFocus={(e) => (e.target.style.borderColor = form.confirm !== form.newPassword ? '#ef4444' : '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = form.confirm && form.confirm !== form.newPassword ? '#ef4444' : 'var(--color-border)')} />
                    </div>
                    {form.confirm && form.confirm !== form.newPassword && (
                      <p className="text-xs mt-1" style={{ color: '#ef4444' }}>Mật khẩu không khớp</p>
                    )}
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    <span>{loading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Đặt lại thành công!</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Mật khẩu đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
                </p>
                <Link to="/login" className="btn-primary inline-flex">Đăng nhập ngay</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, Check } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore, API_BASE_URL } from '../store/authStore'

const passwordRules = [
  { label: 'Ít nhất 8 ký tự', test: (p: string) => p.length >= 8 },
  { label: 'Có chữ hoa', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Có chữ số', test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, form)
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken)
      toast.success('Tài khoản đã được tạo thành công! 🎉')
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10" style={{ background: 'var(--color-bg)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ef4444, #f97316)' }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #eab308, #f97316)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border p-8" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}>P</div>
              <span className="font-bold text-xl gradient-text">Profile Plus</span>
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Tạo tài khoản mới</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Tham gia cộng đồng của chúng tôi</p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                label: 'Google', onClick: () => handleOAuth('google'),
                icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              },
              {
                label: 'GitHub', onClick: () => handleOAuth('github'),
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
              },
            ].map(({ label, onClick, icon }) => (
              <button key={label} type="button" onClick={onClick}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>hoặc đăng ký bằng email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Tên hiển thị</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input type="text" placeholder="Nguyễn Văn A" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input type="email" placeholder="ban@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required minLength={8}
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${rule.test(form.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        {rule.test(form.password) && <Check size={10} className="text-white" />}
                      </div>
                      <span style={{ color: rule.test(form.password) ? '#22c55e' : 'var(--color-text-muted)' }}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#dc2626' }}>Đăng nhập</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

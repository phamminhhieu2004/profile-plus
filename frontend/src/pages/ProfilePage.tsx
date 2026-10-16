import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Lock,
  Key,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  LogOut,
  FilePlus,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn from '../components/ui/FadeIn'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, updateProfile, changePassword, logout } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để xem thông tin tài khoản')
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (location.hash === '#password') {
      setActiveTab('password')
    }
  }, [location.hash])

  if (!user) return null

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setLoadingProfile(true)
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim() || undefined,
        phone: profileForm.phone.trim() || undefined,
        avatar: profileForm.avatar.trim() || undefined,
      })
      toast.success('Cập nhật thông tin thành công! 🎉')
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoadingPassword(true)
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Đổi mật khẩu thành công! 🔐')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.')
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh tối đa là 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        setProfileForm((prev) => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Đã đăng xuất')
    navigate('/')
  }

  return (
    <PageWrapper>
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <FadeIn>
            <div
              className="card p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
              />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                {/* Avatar with upload badge */}
                <div className="relative group">
                  {profileForm.avatar ? (
                    <img
                      src={profileForm.avatar}
                      alt={user.name || 'Avatar'}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-red-500/40 shadow-xl"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/assets/avatar.png'
                      }}
                    />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                    >
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110"
                    style={{ background: '#dc2626', color: 'white' }}
                    title="Đổi ảnh đại diện"
                  >
                    <Camera size={14} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                  </label>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {user.name || 'Người dùng'}
                    </h1>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-center sm:self-auto shadow-sm"
                      style={
                        user.role === 'ADMIN'
                          ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)', color: 'white' }
                          : { background: 'rgba(100,116,139,0.15)', color: 'var(--color-text-secondary)' }
                      }
                    >
                      {user.role === 'ADMIN' && <Shield size={13} />}
                      {user.role === 'ADMIN' ? 'QUẢN TRỊ VIÊN (ADMIN)' : 'THÀNH VIÊN'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {user.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} /> {user.email}
                      </span>
                    )}
                    {user.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} /> {user.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick action buttons */}
                <div className="flex items-center gap-2">
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => navigate('/admin/blog')}
                      className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-white shadow-md transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                    >
                      <FilePlus size={16} />
                      <span>Đăng bài Blog</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl border transition-colors hover:bg-red-500/10 text-red-500"
                    style={{ borderColor: 'var(--color-border)' }}
                    title="Đăng xuất"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Navigation Tabs */}
          <FadeIn delay={0.1}>
            <div className="flex gap-3 mb-8 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'info'
                    ? 'text-white shadow-lg'
                    : 'hover:bg-[var(--color-surface)]'
                }`}
                style={
                  activeTab === 'info'
                    ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                    : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                }
              >
                <User size={16} />
                <span>Thông tin cá nhân</span>
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'password'
                    ? 'text-white shadow-lg'
                    : 'hover:bg-[var(--color-surface)]'
                }`}
                style={
                  activeTab === 'password'
                    ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                    : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                }
              >
                <Key size={16} />
                <span>Đổi mật khẩu</span>
              </button>
            </div>
          </FadeIn>

          {/* Tab 1: Profile Information */}
          {activeTab === 'info' && (
            <FadeIn delay={0.2}>
              <div
                className="card p-6 sm:p-8 rounded-3xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Cập nhật thông tin cá nhân
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Quản lý tên hiển thị, số điện thoại, email và ảnh đại diện của bạn.
                  </p>
                </div>

                <AnimatePresence>
                  {profileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3.5 rounded-xl mb-6 text-sm"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{profileError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                        Họ và tên / Tên hiển thị
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          placeholder="Ví dụ: Phạm Minh Hiếu"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                        Địa chỉ Email
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          placeholder="example@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="Ví dụ: 0989 770 905"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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

                    {/* Avatar URL */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                        Đường dẫn Avatar (URL ảnh trực tuyến)
                      </label>
                      <div className="relative">
                        <Camera size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        <input
                          type="url"
                          value={profileForm.avatar}
                          onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                          placeholder="https://... hoặc upload ảnh bên trên"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loadingProfile}
                      className="btn-primary !px-6 !py-3 flex items-center gap-2"
                    >
                      <Save size={16} />
                      <span>{loadingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          )}

          {/* Tab 2: Change Password */}
          {activeTab === 'password' && (
            <FadeIn delay={0.2}>
              <div
                className="card p-6 sm:p-8 rounded-3xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Đổi mật khẩu tài khoản
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Đảm bảo mật khẩu của bạn có ít nhất 6 ký tự để bảo mật an toàn.
                  </p>
                </div>

                <AnimatePresence>
                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3.5 rounded-xl mb-6 text-sm"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{passwordError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Mật khẩu mới (tối thiểu 6 ký tự)
                    </label>
                    <div className="relative">
                      <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="btn-primary !px-6 !py-3 flex items-center gap-2"
                    >
                      <Lock size={16} />
                      <span>{loadingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

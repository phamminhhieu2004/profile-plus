import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Moon,
  Sun,
  Menu,
  X,
  Globe,
  LogIn,
  LogOut,
  ChevronDown,
  UserPlus,
  User as UserIcon,
  Shield,
  FilePlus,
  Key,
  Phone,
  Mail,
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import LogoSVG from '../ui/LogoSVG'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/', key: 'nav.home' },
  { path: '/about', key: 'nav.about' },
  { path: '/skills', key: 'nav.skills' },
  { path: '/portfolio', key: 'nav.portfolio' },
  { path: '/certificates', key: 'nav.certificates' },
  { path: '/blog', key: 'nav.blog' },
  { path: '/contact', key: 'nav.contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, language, toggleLanguage } = useAppStore()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    toast.success('Đã đăng xuất thành công')
    navigate('/')
  }

  const getInitials = (name?: string, email?: string) => {
    const val = name || email || 'U'
    return val.charAt(0).toUpperCase()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
          <LogoSVG className="w-8 h-8" />
          <span className="font-bold text-lg tracking-tight hidden sm:block" style={{ color: 'var(--color-text-primary)' }}>
            Minh Hieu <span className="gradient-text">Dev</span>
          </span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-text-primary)] bg-[var(--color-surface)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label="Toggle language"
          >
            <Globe size={15} />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Auth section */}
          {user ? (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full transition-all border hover:border-red-500/50"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                id="user-profile-button"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || user.email || 'Avatar'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/50"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/assets/avatar.png'
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                  >
                    {getInitials(user.name, user.email)}
                  </div>
                )}
                <span className="text-sm font-medium max-w-[110px] truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {user.name || user.username || user.phone || 'Tài khoản'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-red-500' : ''}`}
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {/* Header info */}
                    <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)', background: 'rgba(220,38,38,0.03)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-red-500/50 shadow"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = '/assets/avatar.png'
                            }}
                          />
                        ) : (
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shadow"
                            style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                          >
                            {getInitials(user.name, user.email)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {user.name || 'Người dùng'}
                          </p>
                          <span
                            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={
                              user.role === 'ADMIN'
                                ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)', color: 'white' }
                                : { background: 'rgba(100,116,139,0.15)', color: 'var(--color-text-secondary)' }
                            }
                          >
                            {user.role === 'ADMIN' && <Shield size={11} />}
                            {user.role === 'ADMIN' ? 'Quản trị viên (Admin)' : 'Thành viên'}
                          </span>
                        </div>
                      </div>

                      {user.email && (
                        <p className="text-xs flex items-center gap-1.5 mt-2 truncate" style={{ color: 'var(--color-text-muted)' }}>
                          <Mail size={12} className="flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </p>
                      )}
                      {user.phone && (
                        <p className="text-xs flex items-center gap-1.5 mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>
                          <Phone size={12} className="flex-shrink-0" />
                          <span>{user.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Menu links */}
                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-500"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <UserIcon size={16} />
                        <span>Hồ sơ & Thông tin cá nhân</span>
                      </Link>

                      <Link
                        to="/profile#password"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-500"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <Key size={16} />
                        <span>Đổi mật khẩu</span>
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/blog"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        >
                          <FilePlus size={16} />
                          <span>Quản trị & Đăng bài Blog</span>
                        </Link>
                      )}

                      <div className="border-t my-1" style={{ borderColor: 'var(--color-border)' }} />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10 text-red-500 text-left"
                      >
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--color-surface)]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <LogIn size={15} />
                <span>Đăng nhập</span>
              </NavLink>
              <NavLink to="/register" className="btn-primary !py-2 !px-3.5 !text-sm">
                <UserPlus size={15} />
                <span>Đăng ký</span>
              </NavLink>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg transition-all hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden glass border-t border-[var(--color-border)] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-red-500/10 text-red-500 font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}

              <div className="border-t pt-3 mt-2 flex flex-col gap-1" style={{ borderColor: 'var(--color-border)' }}>
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/50" />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                        >
                          {getInitials(user.name, user.email)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          {user.name || user.username || 'User'}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={user.role === 'ADMIN' ? { background: '#dc2626', color: 'white' } : { color: 'var(--color-text-muted)' }}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <UserIcon size={16} />
                      Thông tin cá nhân & Đổi mật khẩu
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin/blog"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 bg-red-500/10"
                      >
                        <FilePlus size={16} />
                        Quản trị & Đăng bài Blog
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                    >
                      <LogIn size={16} />
                      Đăng nhập
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 font-semibold"
                    >
                      <UserPlus size={16} />
                      Đăng ký tài khoản
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

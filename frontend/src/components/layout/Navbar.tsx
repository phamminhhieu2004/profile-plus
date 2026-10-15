import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Moon, Sun, Menu, X, Globe, LogIn, LogOut, ChevronDown, UserPlus } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import LogoSVG from '../ui/LogoSVG'
import avatarImg from '../../assets/avatar.png'
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
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label="Toggle language"
          >
            <Globe size={15} />
            <span>{language.toUpperCase()}</span>
          </button>

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
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:bg-[var(--color-surface)]"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || user.email} className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}>
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-muted)' }} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border overflow-hidden"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-card)' }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user.name || 'User'}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: user.role === 'ADMIN' ? 'rgba(220,38,38,0.15)' : 'rgba(100,116,139,0.15)', color: user.role === 'ADMIN' ? '#dc2626' : '#64748b' }}>
                        {user.role}
                      </span>
                    </div>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-red-500/10 hover:text-red-500 text-left"
                      style={{ color: 'var(--color-text-secondary)' }}>
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <NavLink to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--color-surface)]"
                style={{ color: 'var(--color-text-secondary)' }}>
                <LogIn size={15} />
                Đăng nhập
              </NavLink>
              <NavLink to="/register" className="btn-primary !py-2 !px-3 !text-sm">
                <UserPlus size={15} />
                <span>Đăng ký</span>
              </NavLink>
            </div>
          )}

          <NavLink to="/about" className="hidden sm:block">
            <img
              src={avatarImg}
              alt="Phạm Minh Hiếu avatar"
              className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-red-500/40 hover:ring-red-500/80 transition-all cursor-pointer"
            />
          </NavLink>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg transition-all hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

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
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}>
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]">
                      <LogIn size={15} />
                      Đăng nhập
                    </NavLink>
                    <NavLink to="/register" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500">
                      <UserPlus size={15} />
                      Đăng ký
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

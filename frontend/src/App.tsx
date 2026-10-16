import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import PageLoader from './components/ui/PageLoader'
import { useAppStore } from './store/appStore'
import { useAuthStore } from './store/authStore'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AdminBlogPage = lazy(() => import('./pages/AdminBlogPage'))

export default function App() {
  const { theme, language } = useAppStore()
  const { i18n } = useTranslation()
  const { accessToken, refreshAccessToken } = useAuthStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  // Restore axios auth header on app load
  useEffect(() => {
    if (accessToken) {
      import('axios').then(({ default: axios }) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      })
    }
  }, [accessToken])

  // Silently refresh token on startup if we have a refresh token
  useEffect(() => {
    const store = useAuthStore.getState()
    if (store.refreshToken && !store.accessToken) {
      refreshAccessToken()
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth pages (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Main app with layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/certificates" element={<CertificatesPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin/blog" element={<AdminBlogPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

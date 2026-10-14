import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import PageLoader from './components/ui/PageLoader'
import { useAppStore } from './store/appStore'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

export default function App() {
  const { theme, language } = useAppStore()
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <AnimatePresence mode="wait">
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </AnimatePresence>
  )
}

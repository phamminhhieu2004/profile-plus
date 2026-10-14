import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Download, MapPin, Briefcase } from 'lucide-react'
import { Github } from '../components/icons/SocialIcons'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'
import avatarImg from '../assets/avatar.png'
import heroImg from '../assets/picture1.jpg'

const TAGLINES = ['Backend Developer', 'Kỹ thuật Ô tô', 'AI Enthusiast', 'Music Producer']

function TypingEffect() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const current = TAGLINES[currentIndex]

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayed.length < current.length) {
            setDisplayed(current.slice(0, displayed.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 1500)
          }
        } else {
          if (displayed.length > 0) {
            setDisplayed(displayed.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentIndex((i) => (i + 1) % TAGLINES.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, current])

  return (
    <span className="gradient-text font-bold">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="ml-0.5"
        style={{ color: '#14b8a6' }}
      >
        |
      </motion.span>
    </span>
  )
}

function CounterStat({ end, label, prefix = '', suffix = '' }: { end: number; label: string; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="text-center">
      <p className="text-3xl font-black gradient-text">{prefix}{count}{suffix}</p>
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20,184,166,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(244,114,182,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 -z-10"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 -z-10"
          style={{ background: 'radial-gradient(circle, #f472b6, transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ background: 'rgba(20,184,166,0.12)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.25)' }}>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                {t('hero.available')}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="section-title mb-3" style={{ color: 'var(--color-text-primary)' }}>
                {t('hero.greeting')}{' '}
                <span className="gradient-text">{t('hero.name')}</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="text-2xl font-semibold mb-6 h-9 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <TypingEffect />
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="section-subtitle mb-8">{t('hero.description')}</p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="flex items-center gap-3 mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                <MapPin size={16} className="text-teal-400" />
                <span className="text-sm">Thái Nguyên, Việt Nam</span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <Briefcase size={16} className="text-teal-400" />
                <span className="text-sm">ICTU University</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-3">
                <Link to="/portfolio" className="btn-primary" id="hero-view-projects">
                  {t('hero.cta_primary')}
                  <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-secondary" id="hero-contact">
                  {t('hero.cta_secondary')}
                </Link>
                <a
                  href="/assets/cv.pdf"
                  download
                  className="btn-secondary"
                  id="hero-download-cv"
                >
                  <Download size={16} />
                  CV
                </a>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} direction="left" className="flex justify-center lg:justify-end">
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #14b8a6, #06b6d4, #f472b6, #14b8a6)',
                  padding: '3px',
                  borderRadius: '50%',
                }}
              />
              <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden"
                style={{ padding: '4px', background: 'conic-gradient(from 0deg, #14b8a6, #06b6d4, #f472b6, #14b8a6)', borderRadius: '50%' }}>
                <img
                  src={avatarImg}
                  alt="Phạm Minh Hiếu"
                  className="w-full h-full object-cover object-top rounded-full"
                  style={{ background: 'var(--color-surface)' }}
                />
              </div>

              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-2 shadow-lg"
                style={{ border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <Github size={16} className="text-teal-400" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>GitHub</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-2 shadow-lg"
                style={{ border: '1px solid var(--color-border)' }}
              >
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Google Certified</p>
                <p className="text-sm font-semibold gradient-text">Gemini AI ✨</p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 border-y border-[var(--color-border)]" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StaggerItem><CounterStat end={3} suffix="+" label={t('about.stats.years')} /></StaggerItem>
            <StaggerItem><CounterStat end={10} suffix="+" label={t('about.stats.projects')} /></StaggerItem>
            <StaggerItem><CounterStat end={3} label={t('about.stats.certificates')} /></StaggerItem>
            <StaggerItem><CounterStat end={6} suffix="+" label={t('about.stats.technologies')} /></StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="section-title mb-3" style={{ color: 'var(--color-text-primary)' }}>Tech Stack</h2>
          <p className="section-subtitle mx-auto">Những công nghệ tôi sử dụng hàng ngày</p>
        </FadeIn>
        <StaggerContainer className="flex flex-wrap justify-center gap-3">
          {['Spring Boot', 'FastAPI', 'Node.js', 'TensorFlow', 'Python', 'Java', 'PostgreSQL', 'Docker', 'HTML/CSS', 'Git'].map((tech) => (
            <StaggerItem key={tech}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-default"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {tech}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="py-20" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <img
                src={heroImg}
                alt="Phạm Minh Hiếu working"
                className="rounded-2xl w-full object-cover object-top shadow-2xl"
                style={{ maxHeight: 450, border: '1px solid var(--color-border)' }}
                loading="lazy"
                decoding="async"
              />
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <h2 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Automotive meets{' '}
                <span className="gradient-text">Software</span>
              </h2>
              <p className="section-subtitle mb-6">
                Tôi kết hợp kiến thức kỹ thuật ô tô với lập trình phần mềm để xây dựng các giải pháp độc đáo — từ chẩn đoán ECU đến AI backend.
              </p>
              <Link to="/about" className="btn-primary inline-flex" id="home-learn-more">
                Tìm hiểu thêm
                <ArrowRight size={16} />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

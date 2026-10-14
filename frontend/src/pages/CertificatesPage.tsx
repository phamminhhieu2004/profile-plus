import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, ZoomIn, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'

interface Certificate {
  id: string
  title: string
  issuer: string
  year: string
  image: string
  description: string
}

const certificates: Certificate[] = [
  {
    id: 'educator',
    title: 'Google Gemini Certified Educator',
    issuer: 'Google',
    year: '2024',
    image: '/assets/certificates/Gemini Certified Educator.png',
    description: 'Chứng nhận về kỹ năng sử dụng và giảng dạy các công cụ AI Gemini của Google trong môi trường giáo dục.',
  },
  {
    id: 'faculty',
    title: 'Google Gemini Certified Faculty',
    issuer: 'Google',
    year: '2024',
    image: '/assets/certificates/Gemini Certified Faculty.png',
    description: 'Chứng nhận dành cho giảng viên về tích hợp Gemini AI vào chương trình đào tạo và nghiên cứu học thuật.',
  },
  {
    id: 'student',
    title: 'Google Gemini Certified Student',
    issuer: 'Google',
    year: '2024',
    image: '/assets/certificates/Gemini Certified Student.png',
    description: 'Chứng nhận kỹ năng nền tảng về AI và Gemini dành cho sinh viên trong chương trình đào tạo của Google.',
  },
]

export default function CertificatesPage() {
  const { t } = useTranslation()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + certificates.length) % certificates.length : null))
  const goNext = () => setLightboxIndex((i) => (i !== null ? (i + 1) % certificates.length : null))

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Award size={16} />
              Google Certified
            </div>
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('certificates.title')}</h1>
            <p className="section-subtitle mx-auto">{t('certificates.subtitle')}</p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <StaggerItem key={cert.id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index)}
                  id={`certificate-${cert.id}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                  aria-label={`View ${cert.title}`}
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <div className="flex flex-col items-center gap-2 text-white">
                        <ZoomIn size={24} />
                        <span className="text-sm font-medium">{t('certificates.zoom_hint')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{cert.issuer} · {cert.year}</span>
                    </div>
                    <h3 className="font-bold mb-2 leading-tight" style={{ color: 'var(--color-text-primary)' }}>{cert.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{cert.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <Award size={20} className="text-indigo-500" />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Tất cả chứng chỉ được cấp bởi <strong style={{ color: 'var(--color-text-primary)' }}>Google</strong> thông qua chương trình Gemini AI Certification
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-3xl w-full max-h-[90vh] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {certificates[lightboxIndex].title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {certificates[lightboxIndex].issuer} · {certificates[lightboxIndex].year}
                  </p>
                </div>
                <button onClick={closeLightbox} className="p-2 rounded-xl hover:bg-[var(--color-bg)] transition-colors" aria-label="Close lightbox">
                  <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>
              <div className="p-6 flex items-center justify-center" style={{ background: 'var(--color-bg)', minHeight: 400 }}>
                <img
                  src={certificates[lightboxIndex].image}
                  alt={certificates[lightboxIndex].title}
                  className="max-w-full max-h-[60vh] object-contain rounded-xl"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <button onClick={goPrev} className="btn-secondary py-2 px-4 text-sm" id="lightbox-prev" aria-label="Previous certificate">
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {lightboxIndex + 1} / {certificates.length}
                </span>
                <button onClick={goNext} className="btn-secondary py-2 px-4 text-sm" id="lightbox-next" aria-label="Next certificate">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

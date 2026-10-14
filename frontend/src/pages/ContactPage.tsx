import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { Github, Facebook, Instagram, TikTok } from '../components/icons/SocialIcons'
import axios from 'axios'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const socialLinks = [
  { href: 'https://github.com/phamminhhieu2004', icon: Github, label: 'GitHub', username: 'phamminhhieu2004', color: '#ffffff', bg: '#24292e' },
  { href: 'https://www.facebook.com/goodboy.real.minhhieu', icon: Facebook, label: 'Facebook', username: 'Phạm Minh Hiếu', color: '#ffffff', bg: '#1877f2' },
  { href: 'https://www.tiktok.com/@goodboy.real_2004', icon: TikTok, label: 'TikTok', username: '@goodboy.real_2004', color: '#ffffff', bg: '#000000' },
  { href: 'https://www.instagram.com/_.pmh.2004._/', icon: Instagram, label: 'Instagram', username: '@_.pmh.2004._', color: '#ffffff', bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' },
  { href: 'https://t.me/pmh_2004', icon: Send, label: 'Telegram', username: '@pmh_2004', color: '#ffffff', bg: '#2AABEE' },
]

const contactInfo = [
  { icon: Phone, label: 'Điện thoại', value: '0989 770 905', href: 'tel:0989770905' },
  { icon: Mail, label: 'Email', value: 'contact@phamminhhieu.dev', href: 'mailto:contact@phamminhhieu.dev' },
  { icon: MapPin, label: 'Địa chỉ', value: 'Thái Nguyên, Việt Nam', href: null },
]

export default function ContactPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error('Email không hợp lệ!')
      return
    }

    setSubmitting(true)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

    // 1. Try sending via EmailJS official browser SDK if configured
    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
            from_name: form.name,
            from_email: form.email,
            reply_to: form.email,
          },
          publicKey
        )
      } catch (emailJsErr) {
        console.warn('EmailJS browser direct send attempt:', emailJsErr)
      }
    }

    // 2. Also forward to backend to record / send via SMTP if configured
    try {
      await axios.post('/api/contact', form)
    } catch (backendErr) {
      console.warn('Backend contact logging error:', backendErr)
    }

    toast.success(t('contact.success'))
    setForm({ name: '', email: '', subject: '', message: '' })
    setSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('contact.title')}</h1>
            <p className="section-subtitle mx-auto">{t('contact.subtitle')}</p>
          </FadeIn>

          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <FadeIn>
                <div className="card p-8">
                  <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Gửi tin nhắn</h2>
                  <form onSubmit={handleSubmit} id="contact-form" className="space-y-5" noValidate>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                          {t('contact.name')} *
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder={t('contact.placeholders.name')}
                          required
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#14b8a6')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                          {t('contact.email')} *
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder={t('contact.placeholders.email')}
                          required
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#14b8a6')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        {t('contact.subject')} *
                      </label>
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder={t('contact.placeholders.subject')}
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#14b8a6')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        {t('contact.message')} *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder={t('contact.placeholders.message')}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#14b8a6')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id="contact-submit"
                      className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t('contact.sending')}
                        </>
                      ) : (
                        <>
                          <Mail size={16} />
                          {t('contact.send')}
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <FadeIn delay={0.1}>
                <div className="card p-6">
                  <h3 className="font-bold mb-5" style={{ color: 'var(--color-text-primary)' }}>Thông tin liên hệ</h3>
                  <div className="space-y-4">
                    {contactInfo.map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(20,184,166,0.1)' }}>
                          <Icon size={16} className="text-teal-400" />
                        </div>
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                          {href ? (
                            <a href={href} className="text-sm font-medium transition-colors hover:text-teal-400"
                              style={{ color: 'var(--color-text-primary)' }}>{value}</a>
                          ) : (
                            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="card p-6">
                  <h3 className="font-bold mb-5" style={{ color: 'var(--color-text-primary)' }}>{t('contact.social')}</h3>
                  <StaggerContainer className="space-y-3">
                    {socialLinks.map(({ href, icon: Icon, label, username, color, bg }) => (
                      <StaggerItem key={label}>
                        <motion.a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 6, scale: 1.02 }}
                          id={`social-${label.toLowerCase()}`}
                          className="flex items-center gap-3 p-3 rounded-xl transition-all hover:border-teal-500/40"
                          style={{ border: '1px solid var(--color-border)' }}
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: bg, color }}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{username}</p>
                          </div>
                        </motion.a>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="card p-5 text-center"
                  style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(244,114,182,0.1))' }}>
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #14b8a6, #f472b6)' }}>
                    <span className="text-white text-xl">🚗</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Automotive + Software</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Kết hợp độc đáo giữa công nghệ ô tô và lập trình phần mềm
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

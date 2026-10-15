import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Heart, Download } from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'
import avatarImg from '../assets/avatar.png'
import picture2 from '../assets/picture2.jpg'

const educationHistory = [
  {
    period: '2022 – Hiện tại',
    institution: 'ICTU – Đại học Công nghệ Thông tin và Truyền thông',
    major: 'Công nghệ Kỹ thuật Ô tô',
    details: [
      'Hệ thống ô tô, quản lý động cơ và gầm máy',
      'Chẩn đoán lỗi qua cổng OBD, phân tích tín hiệu ECU',
      'Công nghệ xe điện hóa (EV) và xe Hybrid hiện đại',
      'Song song phát triển phần mềm backend',
    ],
  },
  {
    period: '2019 – 2022',
    institution: 'THPT Phổ Yên, Thái Nguyên',
    major: 'Lớp CBA5',
    details: [],
  },
]

const workExperience = [
  {
    period: '2022 – Hiện tại',
    role: 'Backend Developer',
    type: 'Dự án cá nhân & Freelance',
    details: [
      'Thiết kế và phát triển RESTful API với Spring Boot, FastAPI, Node.js',
      'Tích hợp và xử lý dữ liệu ô tô, kết nối phần cứng – phần mềm',
      'Nghiên cứu Machine Learning với TensorFlow',
      'Hoạt động sáng tạo âm nhạc: Producer & DJ',
    ],
  },
  {
    period: '2020 – 2021',
    role: 'Social Media Services',
    type: 'Freelance',
    details: [
      'Cung cấp dịch vụ tối ưu tương tác mạng xã hội',
      'Hỗ trợ bảo mật và mở khóa tài khoản',
    ],
  },
]

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {t('about.title')}
            </h1>
            <p className="section-subtitle mx-auto">{t('about.subtitle')}</p>
          </FadeIn>

          <div className="grid lg:grid-cols-5 gap-12 mb-20">
            <FadeIn className="lg:col-span-2 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-52 h-52 rounded-3xl overflow-hidden shadow-2xl"
                  style={{ border: '3px solid transparent', backgroundImage: 'linear-gradient(var(--color-surface), var(--color-surface)), linear-gradient(135deg, #dc2626, #facc15)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
                  <img src={avatarImg} alt="Phạm Minh Hiếu" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-3 -right-3 glass rounded-xl px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-400/30">
                  Open to work ✓
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Phạm Minh Hiếu</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Backend Developer & Automotive Engineer</p>
                <div className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <p>📍 Thái Nguyên, Việt Nam</p>
                  <p>📞 0989 770 905</p>
                  <p>✉️ Telegram: @minhhieudev</p>
                </div>
              </div>

              <a href="/assets/cv.pdf" download className="btn-primary w-full justify-center" id="about-download-cv">
                <Download size={16} />
                {t('about.download_cv')}
              </a>
            </FadeIn>

            <div className="lg:col-span-3 space-y-8">
              <FadeIn delay={0.1}>
                <div className="card p-6">
                  <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--color-text-primary)' }}>Giới thiệu</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {t('about.bio')}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart size={18} className="text-red-500" />
                    <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>{t('about.interests')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(t('about.interests_list', { returnObjects: true }) as string[])
                      .filter(Boolean)
                      .map((interest: string) => (
                        <span key={interest} className="px-3 py-1.5 rounded-xl text-sm font-medium"
                          style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.25)' }}>
                          {interest}
                        </span>
                      ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <img src={picture2} alt="Phạm Minh Hiếu" className="rounded-2xl w-full h-80 sm:h-96 object-cover object-top shadow-lg"
                  style={{ border: '1px solid var(--color-border)' }} loading="lazy" decoding="async" />
              </FadeIn>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(220,38,38,0.1)' }}>
                  <GraduationCap size={20} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('about.education')}</h2>
              </div>
              <StaggerContainer className="space-y-6">
                {educationHistory.map((edu) => (
                  <StaggerItem key={edu.institution}>
                    <div className="card p-5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ background: 'linear-gradient(180deg, #dc2626, #facc15)' }} />
                      <div className="pl-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md mb-2 inline-block"
                          style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444' }}>{edu.period}</span>
                        <h3 className="font-bold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{edu.major}</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>{edu.institution}</p>
                        {edu.details.length > 0 && (
                          <ul className="space-y-1">
                            {edu.details.map((d) => (
                              <li key={d} className="text-sm flex gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                                <span className="text-red-500 mt-1 flex-shrink-0">▸</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(234,179,8,0.12)' }}>
                  <Briefcase size={20} className="text-amber-500" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('about.experience')}</h2>
              </div>
              <StaggerContainer className="space-y-6">
                {workExperience.map((exp) => (
                  <StaggerItem key={exp.role}>
                    <div className="card p-5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ background: 'linear-gradient(180deg, #eab308, #dc2626)' }} />
                      <div className="pl-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md mb-2 inline-block"
                          style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>{exp.period}</span>
                        <h3 className="font-bold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{exp.role}</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>{exp.type}</p>
                        <ul className="space-y-1">
                          {exp.details.map((d) => (
                            <li key={d} className="text-sm flex gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className="text-amber-500 mt-1 flex-shrink-0">▸</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

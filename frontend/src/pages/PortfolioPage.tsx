import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { Github } from '../components/icons/SocialIcons'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'
import picture2 from '../assets/picture2.jpg'
import picture3 from '../assets/picture3.jpg'
import heroImg from '../assets/picture1.jpg'
import pmhLogo from '../assets/pmh-logo.png'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: 'fullstack' | 'web' | 'desktop'
  github?: string
  demo?: string
  image: string
  featured?: boolean
}

const projects: Project[] = [
  {
    id: 'profile-plus',
    title: 'Profile Plus (Minh Hieu Dev)',
    description: 'Website cá nhân full-stack cao cấp: React 19, NestJS, tích hợp AI Chatbot Gemini, tra cứu thời tiết real-time, đa ngôn ngữ và tối ưu SEO.',
    tags: ['React 19', 'NestJS', 'TypeScript', 'TailwindCSS', 'Gemini AI', 'Vite'],
    category: 'fullstack',
    github: 'https://github.com/phamminhhieu2004/profile-plus',
    image: heroImg,
    featured: true,
  },
  {
    id: 'profile-premium',
    title: 'Profile Premium',
    description: 'Nền tảng portfolio cao cấp triển khai trực tiếp trên Vercel với thiết kế UI/UX hiện đại, hoạt ảnh mượt mà và tương tác tối ưu.',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Vercel'],
    category: 'web',
    github: 'https://github.com/phamminhhieu2004/profile-premium',
    demo: 'https://profile-premium.vercel.app',
    image: picture2,
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description: 'Website hồ sơ năng lực cá nhân giới thiệu hành trình học tập tại ICTU, kỹ năng lập trình phần mềm và các dự án tiêu biểu.',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Vercel'],
    category: 'web',
    github: 'https://github.com/phamminhhieu2004/portfolio',
    demo: 'https://portfolio-pham-minh-hieu.vercel.app',
    image: picture3,
  },
  {
    id: 'my-profile',
    title: 'My Profile',
    description: 'Website profile cá nhân đầu tay xây dựng với giao diện responsive thân thiện, bố cục gọn gàng giới thiệu thông tin và liên hệ.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web', 'Vercel'],
    category: 'web',
    github: 'https://github.com/phamminhhieu2004/my-profile',
    demo: 'https://my-profile-xi-eosin-42.vercel.app',
    image: heroImg,
  },
  {
    id: 'loveyou',
    title: 'LoveYou App (C# / .NET)',
    description: 'Ứng dụng desktop xây dựng bằng C# và .NET với giao diện tương tác độc đáo, hiệu ứng đồ họa động sinh động và thông điệp ý nghĩa.',
    tags: ['C#', '.NET Framework', 'Windows Forms', 'Desktop App'],
    category: 'desktop',
    github: 'https://github.com/phamminhhieu2004/loveyou',
    image: pmhLogo,
  },
]

const categories = [
  { value: 'all', label: 'Tất cả' },
  { value: 'fullstack', label: 'Full-stack' },
  { value: 'web', label: 'Web Apps' },
  { value: 'desktop', label: 'Desktop / C#' },
]

export default function PortfolioPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('portfolio.title')}</h1>
            <p className="section-subtitle mx-auto">{t('portfolio.subtitle')}</p>
          </FadeIn>

          <FadeIn className="flex justify-center gap-3 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                id={`portfolio-filter-${cat.value}`}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === cat.value ? 'text-white shadow-lg' : 'hover:bg-[var(--color-surface)]'
                }`}
                style={filter === cat.value
                  ? { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                  : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                }
              >
                {t(`portfolio.${cat.value}` as any) || cat.label}
              </button>
            ))}
          </FadeIn>

          {projects.find((p) => p.featured) && filter === 'all' && (
            <FadeIn className="mb-12">
              <div className="card overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={projects[0].image}
                      alt={projects[0].title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                        style={{ background: 'linear-gradient(135deg, #dc2626, #eab308)' }}>
                        ⭐ Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{projects[0].title}</h2>
                    <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{projects[0].description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {projects[0].tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.25)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {projects[0].github && (
                        <a href={projects[0].github} target="_blank" rel="noopener noreferrer" className="btn-primary" id="featured-project-github">
                          <Github size={16} />
                          {t('portfolio.view_code')}
                        </a>
                      )}
                      {projects[0].demo && (
                        <a href={projects[0].demo} target="_blank" rel="noopener noreferrer" className="btn-secondary" id="featured-project-demo">
                          <ExternalLink size={16} />
                          {t('portfolio.view_project')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.filter((p) => !(p.featured && filter === 'all')).map((project) => (
              <StaggerItem key={project.id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="card overflow-hidden flex flex-col h-full"
                  id={`project-${project.id}`}
                >
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold text-white uppercase shadow-sm"
                        style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.9), rgba(234,179,8,0.9))' }}>
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{project.title}</h3>
                    <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--color-text-secondary)' }}>{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-xs font-medium"
                          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                          className="flex-1 btn-secondary text-sm py-2" id={`project-${project.id}-github`}>
                          <Github size={14} />
                          Code
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                          className="flex-1 btn-primary text-sm py-2" id={`project-${project.id}-demo`}>
                          <ExternalLink size={14} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </PageWrapper>
  )
}

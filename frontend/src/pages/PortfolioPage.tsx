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

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: 'backend' | 'ai' | 'automotive'
  github?: string
  demo?: string
  image: string
  featured?: boolean
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Profile Plus Website',
    description: 'Website cá nhân full-stack với React + NestJS, tích hợp AI chatbot Gemini, thời tiết real-time, blog system và đa ngôn ngữ.',
    tags: ['React', 'NestJS', 'TypeScript', 'PostgreSQL', 'Gemini AI'],
    category: 'backend',
    github: 'https://github.com/phamminhhieu2004/profile-plus',
    image: heroImg,
    featured: true,
  },
  {
    id: '2',
    title: 'Automotive Data Bridge',
    description: 'Hệ thống kết nối dữ liệu ECU/OBD với backend FastAPI, xử lý tín hiệu real-time và phân tích chẩn đoán lỗi xe.',
    tags: ['FastAPI', 'Python', 'OBD-II', 'WebSocket', 'PostgreSQL'],
    category: 'automotive',
    github: 'https://github.com/phamminhhieu2004',
    image: picture2,
  },
  {
    id: '3',
    title: 'ML Vehicle Classifier',
    description: 'Model TensorFlow phân loại và nhận diện các lỗi xe ô tô dựa trên dữ liệu cảm biến và hình ảnh chẩn đoán.',
    tags: ['TensorFlow', 'Python', 'Machine Learning', 'CNN', 'OpenCV'],
    category: 'ai',
    github: 'https://github.com/phamminhhieu2004',
    image: picture3,
  },
  {
    id: '4',
    title: 'RESTful API Service',
    description: 'Backend service hiệu năng cao sử dụng Spring Boot với JWT auth, rate limiting, và tài liệu Swagger tự động.',
    tags: ['Spring Boot', 'Java', 'JWT', 'PostgreSQL', 'Docker'],
    category: 'backend',
    github: 'https://github.com/phamminhhieu2004',
    image: picture2,
  },
  {
    id: '5',
    title: 'Node.js Microservices',
    description: 'Kiến trúc microservices với Node.js, message queue, và container orchestration cho hệ thống phân tán.',
    tags: ['Node.js', 'Docker', 'RabbitMQ', 'MongoDB', 'Express'],
    category: 'backend',
    github: 'https://github.com/phamminhhieu2004',
    image: picture3,
  },
  {
    id: '6',
    title: 'AI Chatbot Integration',
    description: 'Chatbot AI thông minh tích hợp Gemini API với streaming response, context memory và đa ngôn ngữ.',
    tags: ['Gemini AI', 'Node.js', 'WebSocket', 'React', 'TypeScript'],
    category: 'ai',
    github: 'https://github.com/phamminhhieu2004',
    image: heroImg,
  },
]

const categories = [
  { value: 'all', label: 'All' },
  { value: 'backend', label: 'Backend' },
  { value: 'ai', label: 'AI/ML' },
  { value: 'automotive', label: 'Automotive' },
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
                  ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }
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
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
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
                          style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {projects[0].github && (
                        <a href={projects[0].github} target="_blank" rel="noopener noreferrer" className="btn-primary" id="featured-project-github">
                          <Github size={16} />
                          {t('portfolio.view_code')}
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
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white uppercase"
                        style={{ background: 'rgba(99,102,241,0.8)' }}>
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

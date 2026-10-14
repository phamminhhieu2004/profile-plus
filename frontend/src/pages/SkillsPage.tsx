import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useInView } from 'framer-motion'
import PageWrapper from '../components/ui/PageWrapper'
import FadeIn, { StaggerContainer, StaggerItem } from '../components/ui/FadeIn'

interface Skill {
  name: string
  level: number
  category: 'automotive' | 'software'
  icon?: string
}

const skills: Skill[] = [
  { name: 'Spring Boot', level: 95, category: 'software' },
  { name: 'FastAPI (Python)', level: 90, category: 'software' },
  { name: 'TensorFlow / ML', level: 90, category: 'software' },
  { name: 'Node.js / Express', level: 85, category: 'software' },
  { name: 'HTML5 & Web', level: 85, category: 'software' },
  { name: 'CSS3 / Bootstrap', level: 80, category: 'software' },
  { name: 'Vehicle Systems', level: 85, category: 'automotive' },
  { name: 'ECU / OBD Diagnostics', level: 80, category: 'automotive' },
  { name: 'EV / Hybrid Tech', level: 78, category: 'automotive' },
]

const techIcons = [
  { name: 'Spring Boot', logo: '/assets/logos/spring_boot_logo.svg' },
  { name: 'FastAPI', logo: '/assets/logos/fastapi_logo.svg' },
  { name: 'TensorFlow', logo: '/assets/logos/tensorflow_logo.svg' },
  { name: 'Node.js', logo: '/assets/logos/nodejs_logo.svg' },
  { name: 'HTML5', logo: '/assets/logos/html_logo.svg' },
  { name: 'CSS3', logo: '/assets/logos/css_logo.svg' },
]

function AnimatedProgressBar({ level, delay = 0 }: { level: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => setWidth(level), delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [inView, level, delay])

  return (
    <div ref={ref} className="progress-bar-track">
      <motion.div
        className="progress-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
      />
    </div>
  )
}

function RadialSkillChart({ level, label, size = 100 }: { level: number; label: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const circumference = 2 * Math.PI * 38
  const strokeDasharray = circumference
  const strokeDashoffset = inView ? circumference - (level / 100) * circumference : circumference

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90">
          <circle cx="50" cy="50" r="38" fill="none" strokeWidth="8" style={{ stroke: 'var(--color-border)' }} />
          <motion.circle
            cx="50" cy="50" r="38" fill="none" strokeWidth="8"
            stroke="url(#skill-gradient)"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
          <defs>
            <linearGradient id="skill-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold gradient-text">{level}%</span>
        </div>
      </div>
      <span className="text-xs text-center font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
    </div>
  )
}

export default function SkillsPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<'all' | 'software' | 'automotive'>('all')

  const filtered = activeCategory === 'all' ? skills : skills.filter((s) => s.category === activeCategory)

  return (
    <PageWrapper>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h1 className="section-title mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('skills.title')}</h1>
            <p className="section-subtitle mx-auto">{t('skills.subtitle')}</p>
          </FadeIn>

          <FadeIn className="flex justify-center gap-3 mb-12">
            {(['all', 'software', 'automotive'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                id={`skills-filter-${cat}`}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'text-white shadow-lg'
                    : 'hover:bg-[var(--color-surface)]'
                }`}
                style={activeCategory === cat
                  ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }
                  : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                }
              >
                {cat === 'all' ? 'All' : cat === 'software' ? t('skills.software') : t('skills.automotive')}
              </button>
            ))}
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <FadeIn>
              <div className="card p-8 space-y-6">
                <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Progress Overview
                </h2>
                {filtered.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{skill.name}</span>
                      <span className="text-sm font-bold gradient-text">{skill.level}%</span>
                    </div>
                    <AnimatedProgressBar level={skill.level} delay={i * 0.1} />
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="card p-8">
                <h2 className="font-bold text-lg mb-6" style={{ color: 'var(--color-text-primary)' }}>
                  Skill Radar
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {filtered.map((skill) => (
                    <RadialSkillChart key={skill.name} level={skill.level} label={skill.name} size={90} />
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <h2 className="text-xl font-bold text-center mb-8" style={{ color: 'var(--color-text-primary)' }}>
              Technology Icons
            </h2>
          </FadeIn>
          <StaggerContainer className="flex flex-wrap justify-center gap-6">
            {techIcons.map(({ name, logo }) => (
              <StaggerItem key={name}>
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="card p-5 flex flex-col items-center gap-3 w-28 cursor-default"
                >
                  <img src={logo} alt={name} className="w-10 h-10 object-contain" loading="lazy" />
                  <span className="text-xs font-medium text-center" style={{ color: 'var(--color-text-secondary)' }}>{name}</span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-20 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Languages', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'] },
              { title: 'Frameworks', items: ['Spring Boot', 'FastAPI', 'Node.js', 'Express', 'TensorFlow', 'React'] },
              { title: 'Tools & DevOps', items: ['Git', 'Docker', 'PostgreSQL', 'Prisma', 'Postman', 'VS Code'] },
            ].map((group, i) => (
              <FadeIn key={group.title} delay={i * 0.1}>
                <div className="card p-6">
                  <h3 className="font-bold mb-4 gradient-text">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

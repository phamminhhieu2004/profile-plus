import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { Github, Facebook, Instagram, TikTok } from '../icons/SocialIcons'
import LogoSVG from '../ui/LogoSVG'

const socialLinks = [
  { href: 'https://github.com/phamminhhieu2004', icon: Github, label: 'GitHub', color: 'hover:text-white' },
  { href: 'https://www.facebook.com/goodboy.real.minhhieu', icon: Facebook, label: 'Facebook', color: 'hover:text-blue-400' },
  { href: 'https://www.tiktok.com/@goodboy.real_2004', icon: TikTok, label: 'TikTok', color: 'hover:text-pink-400' },
  { href: 'https://www.instagram.com/_.pmh.2004._/', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400' },
  { href: 'https://t.me/pmh_2004', icon: Send, label: 'Telegram', color: 'hover:text-sky-400' },
]

const footerLinks = [
  { path: '/about', key: 'nav.about' },
  { path: '/skills', key: 'nav.skills' },
  { path: '/portfolio', key: 'nav.portfolio' },
  { path: '/blog', key: 'nav.blog' },
  { path: '/contact', key: 'nav.contact' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-[var(--color-border)] mt-20" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <LogoSVG className="w-8 h-8" />
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Minh Hieu <span className="gradient-text">Dev</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Backend Developer & Automotive Engineer based in Thái Nguyên, Vietnam.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Pages
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:text-teal-400"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              {t('contact.social')}
            </h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2.5 rounded-xl border border-[var(--color-border)] transition-all hover:border-teal-500/50 hover:bg-teal-500/10 ${color}`}
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} Phạm Minh Hiếu. {t('footer.rights')}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {t('footer.made_with')}
          </p>
        </div>
      </div>
    </footer>
  )
}

interface LogoSVGProps {
  className?: string
}

export default function LogoSVG({ className = 'w-8 h-8' }: LogoSVGProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
      <path
        d="M10 28V12L20 8L30 12V20L20 32L10 28Z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M20 8L30 12V20L20 26V8Z"
        fill="white"
        opacity="0.5"
      />
      <circle cx="20" cy="18" r="4" fill="url(#logo-gradient)" />
    </svg>
  )
}

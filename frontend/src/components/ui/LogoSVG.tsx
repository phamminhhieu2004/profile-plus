interface LogoSVGProps {
  className?: string
}

export default function LogoSVG({ className = 'w-8 h-8' }: LogoSVGProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {/* Nền cờ đỏ sao vàng Việt Nam */}
      <rect width="40" height="40" rx="9" fill="#DA251D" />
      <polygon
        points="20,7.5 22.81,16.14 31.89,16.14 24.54,21.48 27.35,30.11 20,24.77 12.65,30.11 15.46,21.48 8.11,16.14 17.19,16.14"
        fill="#FFFF00"
      />
    </svg>
  )
}

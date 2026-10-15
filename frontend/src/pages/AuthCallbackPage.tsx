import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// This page handles the OAuth callback redirect from backend
export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userStr = searchParams.get('user')

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr)
        setAuth(user, accessToken, refreshToken)
        toast.success(`Chào mừng, ${user.name || user.email}! 👋`)
        navigate('/')
      } catch {
        toast.error('Đăng nhập thất bại')
        navigate('/login')
      }
    } else {
      toast.error('Thông tin xác thực không hợp lệ')
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="text-center">
        <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: '#dc2626' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}

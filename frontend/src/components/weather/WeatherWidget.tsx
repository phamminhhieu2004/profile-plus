import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Droplets, Thermometer, X, ChevronDown } from 'lucide-react'

interface WeatherData {
  city: string
  temp: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
}

const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  import.meta.env.VITE_WEATHER_API_KEY ||
  'demo'

const DEFAULT_WEATHER: WeatherData = {
  city: 'Thái Nguyên',
  temp: 28,
  feelsLike: 31,
  humidity: 75,
  description: 'Partly cloudy',
  icon: '02d',
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  )
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()
  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  }
}

export default function WeatherWidget() {
  const { t } = useTranslation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'demo') {
      setWeather(DEFAULT_WEATHER)
      setLoading(false)
      return
    }

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchWeather(pos.coords.latitude, pos.coords.longitude)
          setWeather(data)
        } catch {
          setWeather(DEFAULT_WEATHER)
        } finally {
          setLoading(false)
        }
      },
      async () => {
        try {
          const data = await fetchWeather(21.5928, 105.8442)
          setWeather(data)
        } catch {
          setWeather(DEFAULT_WEATHER)
        } finally {
          setLoading(false)
        }
      }
    )
  }, [])

  if (dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="fixed bottom-24 left-4 z-40 max-w-[180px]"
      >
        <div className="glass rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden">
          <div
            className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none"
            onClick={() => setExpanded((v) => !v)}
          >
            {loading ? (
              <div className="w-full text-xs text-center py-1" style={{ color: 'var(--color-text-muted)' }}>
                {t('weather.loading')}
              </div>
            ) : error ? (
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('weather.error')}</div>
            ) : weather ? (
              <>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt={weather.description}
                  className="w-8 h-8"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>
                    {weather.temp}°C
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {weather.city}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </>
            ) : null}
          </div>

          <AnimatePresence>
            {expanded && weather && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-[var(--color-border)]"
              >
                <div className="px-3 py-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Thermometer size={12} className="text-orange-400" />
                    <span>{t('weather.feels_like')} {weather.feelsLike}°C</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Droplets size={12} className="text-blue-400" />
                    <span>{t('weather.humidity')} {weather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <MapPin size={12} className="text-indigo-400" />
                    <span className="truncate capitalize">{weather.description}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-opacity"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
            aria-label="Close weather widget"
          >
            <X size={10} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

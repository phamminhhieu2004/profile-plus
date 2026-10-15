import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music } from 'lucide-react'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.5

    const attemptPlay = () => {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setShowHint(false)
          })
          .catch(() => {
            setIsPlaying(false)
            setShowHint(true)

            // Browsers require a user interaction before playing audio
            const handleFirstGesture = () => {
              if (audioRef.current) {
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true)
                    setShowHint(false)
                  })
                  .catch(() => {})
              }
              cleanup()
            }

            const cleanup = () => {
              window.removeEventListener('click', handleFirstGesture)
              window.removeEventListener('touchstart', handleFirstGesture)
              window.removeEventListener('keydown', handleFirstGesture)
              window.removeEventListener('scroll', handleFirstGesture)
            }

            window.addEventListener('click', handleFirstGesture, { passive: true })
            window.addEventListener('touchstart', handleFirstGesture, { passive: true })
            window.addEventListener('keydown', handleFirstGesture, { passive: true })
            window.addEventListener('scroll', handleFirstGesture, { passive: true })
          })
      }
    }

    attemptPlay()
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setShowHint(false)
        })
        .catch(() => {})
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/music.mp3"
        loop
        preload="auto"
      />

      <div className="fixed bottom-6 left-4 z-40 flex items-center gap-2">
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
          className={`flex items-center gap-2 px-3 py-2 rounded-full glass shadow-lg border transition-all text-xs font-medium cursor-pointer ${
            isPlaying
              ? 'border-red-500/50 text-red-500 bg-red-950/30 shadow-red-500/10'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {isPlaying ? (
            <>
              {/* Animated audio visualizer bars */}
              <div className="flex items-end gap-0.5 h-3.5 w-3.5" aria-hidden="true">
                <span className="w-0.5 bg-red-500 rounded-full animate-bounce h-full" style={{ animationDuration: '0.6s' }} />
                <span className="w-0.5 bg-yellow-400 rounded-full animate-bounce h-2/3" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }} />
                <span className="w-0.5 bg-red-500 rounded-full animate-bounce h-5/6" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
              </div>
              <span className="hidden sm:inline font-semibold">Đang phát nhạc</span>
              <Volume2 size={14} className="text-red-500" />
            </>
          ) : (
            <>
              <VolumeX size={14} className="text-gray-400" />
              <span className="hidden sm:inline">Phát nhạc nền</span>
              <Music size={12} className="text-gray-400 opacity-60" />
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {showHint && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-[11px] px-2.5 py-1 rounded-full glass border border-amber-500/30 text-amber-400 bg-amber-950/20 shadow-sm hidden md:inline-block pointer-events-none"
            >
              🎵 Bấm để phát nhạc
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

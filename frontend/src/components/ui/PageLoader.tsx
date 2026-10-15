import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #dc2626, #ea580c, #facc15)',
              opacity: 0.2,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, #dc2626, #facc15)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-3 rounded-full" style={{ background: 'var(--color-bg)' }} />
        </div>
        <p className="text-sm font-medium gradient-text">Loading...</p>
      </motion.div>
    </div>
  )
}

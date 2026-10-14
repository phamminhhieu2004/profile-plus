import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'
type Language = 'vi' | 'en'

interface AppState {
  theme: Theme
  language: Language
  chatbotOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  setChatbotOpen: (open: boolean) => void
  toggleChatbot: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') as Theme,
      language: 'vi',
      chatbotOpen: false,
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(next)
      },
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => {
        const next = get().language === 'vi' ? 'en' : 'vi'
        set({ language: next })
      },
      setChatbotOpen: (chatbotOpen) => set({ chatbotOpen }),
      toggleChatbot: () => set((s) => ({ chatbotOpen: !s.chatbotOpen })),
    }),
    {
      name: 'profile-plus-store',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
)

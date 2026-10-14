import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatbotWidget from '../chatbot/ChatbotWidget'
import WeatherWidget from '../weather/WeatherWidget'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WeatherWidget />
      <ChatbotWidget />
    </div>
  )
}

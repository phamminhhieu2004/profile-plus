import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

import axios from 'axios'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.5-flash-lite'

const SYSTEM_CONTEXT = `You are the AI assistant for Minh Hieu Dev (Phạm Minh Hiếu)'s personal portfolio website. 
Here is his profile:
- Name: Phạm Minh Hiếu (Minh Hieu Dev)
- Born: 2004, Thái Nguyên, Vietnam
- Major: Automotive Engineering at ICTU (2022-present)
- Skills: Spring Boot (95%), FastAPI (90%), TensorFlow (90%), Node.js (85%), HTML/CSS (85%)
- Automotive: Vehicle Systems (85%), ECU/OBD Diagnostics (80%), EV/Hybrid Tech (78%)
- Hobbies: Backend development, AI/ML, Music Production (DJ/Producer)
- Social: GitHub(phamminhhieu2004), Instagram(https://www.instagram.com/_.pmh.2004._/ or @_.pmh.2004._), Telegram(@pmh_2004), Facebook, TikTok
- Certificates: Google Gemini Certified Educator, Faculty, Student
- Open to work / collaboration opportunities
Answer questions about Hiếu in the language the user writes in (Vietnamese or English). Be friendly, helpful, rapid, and keep responses concise (under 3-4 sentences) so that the user receives the answer as fast as possible.`

async function streamGeminiResponse(
  userMessage: string,
  history: Message[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const candidateModels = [
    GEMINI_MODEL,
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
  ]

  const conversationHistory = history
    .filter((m) => m.content && m.id !== '0')
    .slice(-6)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  let streamedAny = false

  // 1. Try streaming directly from Google Gemini API
  if (GEMINI_API_KEY) {
    for (const model of candidateModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
              contents: [
                ...conversationHistory,
                { role: 'user', parts: [{ text: userMessage }] },
              ],
              generationConfig: { temperature: 0.6, maxOutputTokens: 350 },
            }),
          }
        )

        if (!res.ok || !res.body) {
          continue
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data: ')) continue
            try {
              const json = JSON.parse(trimmed.slice(6))
              const chunk = json?.candidates?.[0]?.content?.parts?.[0]?.text
              if (chunk) {
                onChunk(chunk)
                streamedAny = true
              }
            } catch { }
          }
        }

        if (streamedAny) return
      } catch {
        // try next model or fallback
      }
    }
  }

  // 2. Fallback to backend /api/chat
  try {
    const backendRes = await axios.post('/api/chat', { message: userMessage })
    const reply = backendRes.data?.data?.content
    if (reply) {
      for (const char of reply) {
        onChunk(char)
        await new Promise((r) => setTimeout(r, 10))
      }
      return
    }
  } catch (err) {
    console.warn('Backend chat fallback error:', err)
  }

  // 3. Fallback to smart local contextual responder
  const lower = userMessage.toLowerCase()
  let fallback = ''
  if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
    fallback = 'Chào bạn! Mình là trợ lý AI của Minh Hiếu (Minh Hieu Dev). Bạn muốn tìm hiểu về kỹ năng lập trình, các dự án công nghệ ô tô hay cách kết nối với Hiếu?'
  } else if (lower.includes('kỹ năng') || lower.includes('skill') || lower.includes('công nghệ') || lower.includes('stack')) {
    fallback = 'Hiếu thành thạo Spring Boot (95%), FastAPI (90%), TensorFlow (90%), Node.js (85%) và có chuyên môn về hệ thống chẩn đoán ô tô ECU/OBD!'
  } else if (lower.includes('liên hệ') || lower.includes('contact') || lower.includes('email') || lower.includes('sđt') || lower.includes('phone') || lower.includes('instagram')) {
    fallback = 'Bạn có thể kết nối với Hiếu qua Instagram @_.pmh.2004._, Telegram @pmh_2004, hoặc qua trang Liên hệ!'
  } else if (lower.includes('học vấn') || lower.includes('trường') || lower.includes('ictu') || lower.includes('sinh viên')) {
    fallback = 'Hiếu hiện là sinh viên chuyên ngành Kỹ thuật Công nghệ Ô tô tại Đại học Công nghệ Thông tin & Truyền thông (ICTU) từ năm 2022 đến nay.'
  } else if (lower.includes('nhạc') || lower.includes('music') || lower.includes('dj') || lower.includes('producer')) {
    fallback = 'Ngoài lập trình Backend và AI, Hiếu còn là DJ/Music Producer đam mê sáng tạo âm nhạc điện tử!'
  } else {
    fallback = 'Cảm ơn câu hỏi của bạn! Hiếu là một Backend & AI Developer từ Thái Nguyên, Việt Nam, luôn sẵn sàng kết nối và hợp tác trên các dự án thú vị.'
  }

  for (const char of fallback) {
    onChunk(char)
    await new Promise((r) => setTimeout(r, 12))
  }
}

export default function ChatbotWidget() {
  const { t } = useTranslation()
  const { chatbotOpen, toggleChatbot } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '0',
        role: 'assistant',
        content: t('chatbot.greeting'),
        timestamp: new Date(),
      }])
    }
  }, [t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (chatbotOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatbotOpen])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }])

    try {
      await streamGeminiResponse(text, messages, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
        )
      })
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!' } : m))
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={toggleChatbot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white"
        style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4, #f472b6)' }}
        aria-label="Toggle chatbot"
        id="chatbot-toggle"
      >
        <AnimatePresence mode="wait">
          {chatbotOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {!chatbotOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400 border-2 border-[var(--color-bg)] animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] max-h-[520px] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, #0d9488, #06b6d4, #f472b6)', color: 'white' }}
            >
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <div>
                  <p className="font-semibold text-sm">{t('chatbot.title')}</p>
                  <p className="text-xs opacity-85">Minh Hieu Dev · Gemini Fast AI</p>
                </div>
              </div>
              <button onClick={toggleChatbot} className="p-1 rounded-lg hover:bg-white/20 transition-colors" aria-label="Minimize chatbot">
                <Minimize2 size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin" style={{ maxHeight: '360px' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs"
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #0d9488, #f472b6)'
                        : 'linear-gradient(135deg, #06b6d4, #14b8a6)',
                    }}
                  >
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                    }`}
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #0d9488, #06b6d4)'
                        : 'var(--color-bg)',
                      color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                      border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center py-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-current"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-[var(--color-border)]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t('chatbot.placeholder')}
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#14b8a6')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  id="chatbot-input"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4)' }}
                  aria-label="Send message"
                  id="chatbot-send"
                >
                  <Send size={15} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

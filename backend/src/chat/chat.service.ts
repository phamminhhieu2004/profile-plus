import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const PROFILE_CONTEXT = `You are an AI assistant for Phạm Minh Hiếu's personal website.
Profile:
- Name: Phạm Minh Hiếu (Pham Minh Hieu), born 2004, Thái Nguyên, Vietnam
- Major: Automotive Engineering at ICTU (Information and Communication Technology University), 2022-present
- Skills: Spring Boot (95%), FastAPI (90%), TensorFlow (90%), Node.js (85%), HTML/CSS (85%), ECU/OBD Diagnostics (80%), EV/Hybrid Tech (78%)
- Interests: Backend development, AI/ML, Music Production (DJ/Producer)
- Social: GitHub(phamminhhieu2004), Telegram(@pmh_2004), Facebook(goodboy.real.minhhieu), TikTok(@goodboy.real_2004)
- Certificates: Google Gemini Certified Educator, Google Gemini Certified Faculty, Google Gemini Certified Student
- Open to work and collaboration
Answer in the same language as the user (Vietnamese or English). Keep responses concise and friendly.`

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)
  private genAI: GoogleGenerativeAI | null = null

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey)
    }
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.genAI) {
      return 'Hiếu là Backend Developer từ Thái Nguyên, chuyên Spring Boot, FastAPI và TensorFlow. Liên hệ qua GitHub: phamminhhieu2004!'
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: PROFILE_CONTEXT,
      })
      const result = await model.generateContent(message)
      return result.response.text()
    } catch (error) {
      this.logger.error('Gemini API error', error)
      return 'Xin lỗi, tôi không thể trả lời ngay lúc này. Vui lòng thử lại sau!'
    }
  }
}

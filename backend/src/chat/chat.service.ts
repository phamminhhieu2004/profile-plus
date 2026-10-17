import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const PROFILE_CONTEXT = `You are an AI assistant for Phạm Minh Hiếu (Minh Hieu Dev)'s personal portfolio website.
Profile:
- Name: Phạm Minh Hiếu (Minh Hieu Dev), born 2004, Thái Nguyên, Vietnam
- Major: Automotive Engineering at ICTU (Information and Communication Technology University), 2022-present
- Skills: Spring Boot (95%), FastAPI (90%), TensorFlow (90%), Node.js (85%), HTML/CSS (85%), ECU/OBD Diagnostics (80%), EV/Hybrid Tech (78%)
- Interests: Backend development, AI/ML, Music Production (DJ/Producer)
- Social: GitHub(phamminhhieu2004), Telegram(@minhhieudev), Instagram(https://www.instagram.com/minhhieudev.site/), Facebook(https://www.facebook.com/minhhieudev.site/), TikTok(@goodboy.real_minhhieu)
- Contact: Email(phamminhhieu18022004@gmail.com), Phone(0989 770 905)
- Certificates: Google Gemini Certified Educator, Google Gemini Certified Faculty, Google Gemini Certified Student
- Open to work and collaboration
Answer in the same language as the user (Vietnamese or English). Keep responses rapid, concise, friendly, and directly to the point (2-4 sentences max unless detailed code is asked).`

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
      return 'Hiếu là Backend Developer từ Thái Nguyên, chuyên Spring Boot, FastAPI và TensorFlow. Liên hệ qua GitHub: phamminhhieu2004 hoặc Instagram: @minhhieudev.site!'
    }

    const candidateModels = [
      this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
    ]

    for (const modelName of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: PROFILE_CONTEXT,
        })
        const result = await model.generateContent(message)
        const text = result?.response?.text()
        if (text) return text
      } catch (error: any) {
        this.logger.warn(`Gemini attempt with ${modelName} failed: ${error?.message || error}`)
      }
    }

    return 'Hiếu là một Backend Developer đam mê công nghệ từ Thái Nguyên, Việt Nam. Bạn có thể kết nối với Hiếu qua GitHub: phamminhhieu2004 hoặc Instagram: @minhhieudev.site!'
  }
}

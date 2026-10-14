import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ChatService } from './chat.service'

import { IsNotEmpty, IsString } from 'class-validator'

class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async chat(@Body() body: ChatMessageDto) {
    const reply = await this.chatService.generateResponse(body.message || '')
    return {
      success: true,
      data: {
        role: 'assistant',
        content: reply,
      },
    }
  }
}

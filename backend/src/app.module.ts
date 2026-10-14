import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ContactModule } from './contact/contact.module'
import { ChatModule } from './chat/chat.module'
import { BlogModule } from './blog/blog.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    ContactModule,
    ChatModule,
    BlogModule,
  ],
})
export class AppModule {}

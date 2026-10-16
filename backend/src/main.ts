import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const uploadsDir = path.join(process.cwd(), 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
  app.use('/uploads', express.static(uploadsDir))

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  )
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3001
  await app.listen(port, '0.0.0.0')
  console.log(`Application running on port ${port}`)
}

bootstrap()

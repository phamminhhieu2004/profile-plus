import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import * as fs from 'fs'
import { BlogService } from './blog.service'
import { CreateBlogPostDto, UpdateBlogPostDto } from './blog.interface'
import { JwtAuthGuard, AdminGuard } from '../auth/guards/auth.guard'

const storage = diskStorage({
  destination: (_req: any, _file: any, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = './uploads'
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (_req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = extname(file.originalname) || '.bin'
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAll(@Query('tag') tag?: string, @Query('search') search?: string) {
    const data = await this.blogService.findAll({ tag, search })
    return {
      success: true,
      data,
    }
  }

  @Get('tags')
  async getTags() {
    const data = await this.blogService.getAllTags()
    return {
      success: true,
      data,
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const data = await this.blogService.findOne(id)
    return {
      success: true,
      data,
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateBlogPostDto) {
    if (!dto.title || !dto.content) {
      throw new BadRequestException('Tiêu đề và nội dung bài viết không được để trống')
    }
    const data = await this.blogService.create(dto)
    return {
      success: true,
      data,
      message: 'Đăng bài viết thành công!',
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    const data = await this.blogService.update(id, dto)
    return {
      success: true,
      data,
      message: 'Cập nhật bài viết thành công!',
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id)
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for video/image
    })
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Chưa có file nào được tải lên')
    }
    const urls = files.map((file) => `/uploads/${file.filename}`)
    return {
      success: true,
      urls,
      files: files.map((f) => ({
        originalName: f.originalname,
        url: `/uploads/${f.filename}`,
        mimetype: f.mimetype,
        size: f.size,
      })),
    }
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common'
import { BlogService } from './blog.service'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getAll(@Query('tag') tag?: string, @Query('search') search?: string) {
    return {
      success: true,
      data: this.blogService.findAll({ tag, search }),
    }
  }

  @Get('tags')
  getTags() {
    return {
      success: true,
      data: this.blogService.getAllTags(),
    }
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return {
      success: true,
      data: this.blogService.findOne(id),
    }
  }
}

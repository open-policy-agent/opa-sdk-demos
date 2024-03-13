import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { Authz } from '../authz/decorators/action';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Authz({ action: 'create', resource: 'cat' })
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  @Authz({ action: 'list', resource: 'cats' })
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':name')
  @Authz({ action: 'get', resource: 'cat' })
  async findByName(@Param('name') name: string): Promise<Cat> {
    return this.catsService.findByName(name);
  }
}

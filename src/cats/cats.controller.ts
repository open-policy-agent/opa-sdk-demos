import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import {
  Authz,
  AuthzStatic,
  Query as AuthzQuery,
} from '../authz/decorators/action';

@Controller('cats')
@AuthzQuery('cats/allow')
@AuthzStatic({ resource: 'cat' })
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Authz(({ body: { name } }) => ({ name, action: 'create' }))
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  @AuthzStatic({ action: 'list', resource: 'cats' })
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':name')
  @Authz(({ params: { name } }) => ({
    name,
    action: 'get',
  }))
  async findByName(@Param('name') name: string): Promise<Cat> {
    return this.catsService.findByName(name);
  }
}

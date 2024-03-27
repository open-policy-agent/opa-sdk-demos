import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import {
  Authz,
  AuthzStatic,
  Decision,
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
  @AuthzQuery('cats') // For illustration, we're querying the package extent
  // These are all equivalent here:
  // @DecisionStatic('allow')
  // @Decision((r) => r['allow'])
  @Decision(pluckAllow)
  @Authz(({ params: { name } }) => ({
    name,
    action: 'get',
  }))
  async findByName(@Param('name') name: string): Promise<Cat> {
    return this.catsService.findByName(name);
  }
}

function pluckAllow(r: Record<string, unknown>): boolean {
  return r['allow'] as boolean;
}

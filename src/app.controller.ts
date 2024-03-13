import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/decorators';
import { AuthzService } from './authz/authz.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private authzService: AuthzService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public() // So global JWT guard doesn't prohibit logins
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('hello')
  @Public()
  getInfo() {
    return { hello: 'world' };
  }
}

import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './authn/local-auth.guard';
import { AuthService } from './authn/auth.service';
import { Public } from './authn/decorators/public';
import { AuthzStatic, Query as AuthzQuery } from './authz/decorators/action';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public() // So global JWT guard doesn't prohibit logins
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @AuthzStatic({ action: 'read', resource: 'profile' })
  @AuthzQuery('profile/allow')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('hello')
  @Public()
  getInfo() {
    return { hello: 'world' };
  }
}

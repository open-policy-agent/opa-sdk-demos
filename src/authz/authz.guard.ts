import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth/decorators/public';
import { AuthzService } from './authz.service';
import { AUTHZ_PROPERTY } from './decorators/action';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzService: AuthzService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const authzProps = this.reflector.getAllAndMerge<Record<string, any>>(
      AUTHZ_PROPERTY,
      [context.getHandler(), context.getClass()],
    );
    if (!authzProps) {
      return true; // no authz data attached, nothing to query OPA for
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return await this.authzService.authorize({
      ...authzProps,
      user: user.username,
    });
  }
}

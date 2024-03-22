import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../auth/decorators/public';
import { AuthzService } from './authz.service';
import {
  AUTHZ_PATH,
  AUTHZ_PROPERTY,
  AUTHZ_EXTRA,
  Request,
} from './decorators/action';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzService: AuthzService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authzProps = this.reflector.getAllAndMerge<Record<string, any>>(
      AUTHZ_PROPERTY,
      [context.getClass(), context.getHandler()],
    );

    const authzExtra = this.reflector.getAll<
      ((_: Request) => Record<string, any>)[]
    >(AUTHZ_EXTRA, [context.getClass(), context.getHandler()]);
    const extra = authzExtra.reduce(
      (acc, add) => (add ? { ...acc, ...add(request) } : acc),
      {},
    );

    const authzPath =
      this.reflector.getAllAndOverride<string>(AUTHZ_PATH, [
        context.getHandler(),
        context.getClass(),
      ]) || this.configService.getOrThrow('OPA_PATH');

    return await this.authzService.authorize(
      {
        ...authzProps,
        ...extra,
        user: request.user.username, // TODO(sr): make this configurable
      },
      authzPath,
    );
  }
}

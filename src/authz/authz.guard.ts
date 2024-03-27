import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../auth/decorators/public';
import { AuthzService } from './authz.service';
import {
  AUTHZ_EXTRA,
  AUTHZ_DECISION,
  AUTHZ_PATH,
  Request,
} from './decorators/action';
import { Input, ToInput, Result } from 'opa/highlevel';

class InputPayload implements ToInput {
  private input: Input;
  constructor(extra: ((_: Request) => Record<string, any>)[], req: Request) {
    this.input = extra.reduce(
      (acc, add) => (add ? { ...acc, ...add(req) } : acc),
      { user: req.user.username },
    );
  }

  toInput(): Input {
    return this.input;
  }
}

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
    const inp = new InputPayload(
      this.reflector.getAll<((_: Request) => Record<string, any>)[]>(
        AUTHZ_EXTRA,
        [context.getClass(), context.getHandler()],
      ),
      request,
    );

    const authzPath =
      this.reflector.getAllAndOverride<string>(AUTHZ_PATH, [
        context.getHandler(),
        context.getClass(),
      ]) || this.configService.getOrThrow('OPA_PATH');

    const fromResult = this.reflector.getAllAndOverride<(_: Result) => boolean>(
      AUTHZ_DECISION,
      [context.getHandler(), context.getClass()],
    );
    return await this.authzService.authorize(inp, authzPath, fromResult);
  }
}

import { SetMetadata } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

export const AUTHZ_PROPERTY = 'authz:opa:property';
export const Authz = (extra: Record<string, any>) =>
  SetMetadata(AUTHZ_PROPERTY, extra);

export const AUTHZ_PATH = 'authz:opa:path';
export const Query = (r: string) => SetMetadata(AUTHZ_PATH, r);

export interface Request extends ExpressRequest {
  user?: any;
  session?: any;
}

export const AUTHZ_EXTRA = 'authz:opa:extra';
export const Extra = (f: (_: Request) => Record<string, any>) =>
  SetMetadata(AUTHZ_EXTRA, f);

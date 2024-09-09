import { SetMetadata } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Result } from '@styra/opa';

export interface Request extends ExpressRequest {
  user?: any;
  session?: any;
}

export const AUTHZ_EXTRA = 'authz:opa:extra';
export const Authz = (f: (_: Request) => Record<string, any>) =>
  SetMetadata(AUTHZ_EXTRA, f);
export const AuthzStatic = (extra: Record<string, any>) =>
  SetMetadata(AUTHZ_EXTRA, () => extra);

export const AUTHZ_DECISION = 'authz:opa:decision';
export const Decision = (f: (_: Result) => boolean) =>
  SetMetadata(AUTHZ_DECISION, f);
export const DecisionStatic = (key: string) =>
  SetMetadata(AUTHZ_DECISION, (x: Result) => x[key] as boolean);

export const AUTHZ_PATH = 'authz:opa:path';
export const Query = (r: string) => SetMetadata(AUTHZ_PATH, r);

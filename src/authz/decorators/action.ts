import { SetMetadata } from '@nestjs/common';

export const AUTHZ_PROPERTY = 'authzProperty';
export const Authz = (r: Record<string, any>) => SetMetadata(AUTHZ_PROPERTY, r);
export const AUTHZ_PATH = 'authzPath';
export const Query = (r: string) => SetMetadata(AUTHZ_PATH, r);

import { SetMetadata } from '@nestjs/common';

export const AUTHZ_PROPERTY = 'authzProperty';
export const Authz = (r: Record<string, any>) => SetMetadata(AUTHZ_PROPERTY, r);

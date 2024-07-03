import { SetMetadata } from '@nestjs/common';

export const IS_UNAUTHENTICATED_KEY = 'isUnauthenticated';
export const Unauthenticated = () => SetMetadata(IS_UNAUTHENTICATED_KEY, true);

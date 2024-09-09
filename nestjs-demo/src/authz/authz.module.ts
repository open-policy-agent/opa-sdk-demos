import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthzService } from './authz.service';
import { AuthzGuard } from './authz.guard';

@Module({
  imports: [ConfigModule],
  providers: [
    AuthzService,
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
  ],
  exports: [AuthzService],
})
export class AuthzModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthzService } from './authz/authz.service';
import { AuthzModule } from './authz/authz.module';

@Module({
  imports: [
    CatsModule,
    AuthModule,
    UsersModule,
    AuthzModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AuthzService],
})
export class AppModule {}

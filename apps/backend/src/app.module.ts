import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ParticipantesModule } from './modules/participantes/participantes.module';
import { IngressosModule } from './modules/ingressos/ingressos.module';
import { AuthModule } from './modules/auth/auth.module';
import { TestAuthModule } from './modules/test-auth/test-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TestAuthModule,
    ParticipantesModule,
    IngressosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

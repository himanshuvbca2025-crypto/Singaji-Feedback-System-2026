import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AdminModule } from './admin/admin.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),

  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('DB_URL'),
      dbName: configService.get<string>('DB_NAME'),
    }),
  }),

  AdminModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

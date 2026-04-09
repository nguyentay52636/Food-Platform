import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { ReviewModule } from './modules/review/review.module';
import { LanguageModule } from './modules/language/language.module';
import { PoiModule } from './modules/poi/poi.module';
import { RouterModule } from './modules/router/router.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UserModule,
    AuthModule,
    VisitorModule,
    ReviewModule,
    LanguageModule,
    PoiModule,
    RouterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

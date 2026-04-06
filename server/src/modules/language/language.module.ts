// src/modules/language/language.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { PoiTranslationController } from './poi-translation.controller';
import { PoiTranslationService } from './poi-translation.service';
import { Language, LanguageSchema } from './schema/language.schema';
import { PoiTranslation, PoiTranslationSchema } from './schema/poi-translation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
      { name: PoiTranslation.name, schema: PoiTranslationSchema }
    ]),
  ],
  controllers: [LanguageController, PoiTranslationController],
  providers: [LanguageService, PoiTranslationService],
  exports: [LanguageService, PoiTranslationService, MongooseModule]
})
export class LanguageModule { }

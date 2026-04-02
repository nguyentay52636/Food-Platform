// language.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from './schema/language.schema';
import { POILanguage, POINgonNguSchema } from './schema/poi-language.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
      { name: POILanguage.name, schema: POINgonNguSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class LanguageModule { }

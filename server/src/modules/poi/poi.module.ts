// poi.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';
import { POI, POISchema } from './schema/poi.schema';
import { LanguageModule } from '../language/language.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: POI.name, schema: POISchema }]),
    LanguageModule, // Access to LanguageModels
  ],
  controllers: [PoiController],
  providers: [PoiService],
  exports: [PoiService],
})
export class PoiModule {}

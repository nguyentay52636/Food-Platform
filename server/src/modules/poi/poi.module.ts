import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageModule } from '../language/language.module';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';
import { Poi, PoiSchema } from './schema/poi.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poi.name, schema: PoiSchema }]),
    LanguageModule,
  ],
  controllers: [PoiController],
  providers: [PoiService],
  exports: [PoiService]
})
export class PoiModule {}

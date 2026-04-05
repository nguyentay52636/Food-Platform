import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';
import { Poi, PoiSchema } from './schema/poi.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poi.name, schema: PoiSchema }])
  ],
  controllers: [PoiController],
  providers: [PoiService],
  exports: [PoiService]
})
export class PoiModule {}

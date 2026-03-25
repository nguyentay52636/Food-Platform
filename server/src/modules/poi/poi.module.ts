import { Module } from '@nestjs/common';
import { PoiController } from './poi.controller';

@Module({
  controllers: [PoiController]
})
export class PoiModule {}

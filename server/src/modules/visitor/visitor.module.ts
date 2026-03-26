// visitor.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorSession, VisitorSessionSchema } from './schema/visitor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitorSession.name, schema: VisitorSessionSchema },
    ]),
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}

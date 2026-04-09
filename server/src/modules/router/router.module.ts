import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Router, RouterSchema } from './schema/router.schema';
import { RouterPoi, RouterPoiSchema } from './schema/router-poi.schema';
import { RouterController } from './router.controller';
import { RouterService } from './router.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Router.name, schema: RouterSchema },
            { name: RouterPoi.name, schema: RouterPoiSchema },
        ])
    ],
    controllers: [RouterController],
    providers: [RouterService],
})
export class RouterModule {}

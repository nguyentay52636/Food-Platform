import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Router, RouterDocument } from './schema/router.schema';
import { RouterPoi, RouterPoiDocument } from './schema/router-poi.schema';
import { CreateRouterDto } from './dto/create-router.dto';

@Injectable()
export class RouterService {
    constructor(
        @InjectModel(Router.name) private routerModel: Model<RouterDocument>,
        @InjectModel(RouterPoi.name) private routerPoiModel: Model<RouterPoiDocument>,
    ) { }

    async create(createRouterDto: CreateRouterDto): Promise<RouterDocument> {
        const { pois, ...routerData } = createRouterDto;
        
        // 1. Create Router
        const createdRouter = new this.routerModel(routerData);
        await createdRouter.save();

        // 2. Create RouterPoi links
        if (pois && pois.length > 0) {
            const routerPois = pois.map(p => ({
                maRouter: createdRouter._id,
                maPoi: new Types.ObjectId(p.maPoi),
                thuTu: p.thuTu
            }));
            await this.routerPoiModel.insertMany(routerPois);
        }

        return this.findOne(createdRouter._id.toString());
    }

    async findAll(): Promise<RouterDocument[]> {
        return this.routerModel.find()
            .populate({
                path: 'pois',
                populate: { path: 'maPoi' }
            })
            .exec();
    }

    async findOne(id: string): Promise<RouterDocument> {
        const router = await this.routerModel.findById(id)
            .populate({
                path: 'pois',
                populate: { path: 'maPoi' }
            })
            .exec();

        if (!router) {
            throw new NotFoundException(`Router with ID ${id} not found`);
        }
        return router;
    }

    async remove(id: string): Promise<void> {
        await this.routerPoiModel.deleteMany({ maRouter: new Types.ObjectId(id) });
        const result = await this.routerModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Router with ID ${id} not found`);
        }
    }
}

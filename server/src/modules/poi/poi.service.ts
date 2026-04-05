import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Poi, PoiDocument } from './schema/poi.schema';
import { CreatePoiDto } from './dto/create-poi.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';

@Injectable()
export class PoiService {
  constructor(
    @InjectModel(Poi.name) private readonly poiModel: Model<PoiDocument>,
  ) { }

  async create(createPoiDto: CreatePoiDto): Promise<PoiDocument> {
    const createdPoi = new this.poiModel(createPoiDto);
    return createdPoi.save();
  }

  async findAll(): Promise<PoiDocument[]> {
    return this.poiModel.find().exec();
  }

  async findOne(id: string): Promise<PoiDocument> {
    const poi = await this.poiModel.findById(id).exec();
    if (!poi) {
      throw new NotFoundException(`POI with ID ${id} not found`);
    }
    return poi;
  }

  async update(id: string, updatePoiDto: UpdatePoiDto): Promise<PoiDocument> {
    const updatedPoi = await this.poiModel
      .findByIdAndUpdate(id, updatePoiDto, { new: true })
      .exec();
    if (!updatedPoi) {
      throw new NotFoundException(`POI with ID ${id} not found`);
    }
    return updatedPoi;
  }

  async remove(id: string): Promise<PoiDocument> {
    const deletedPoi = await this.poiModel.findByIdAndDelete(id).exec();
    if (!deletedPoi) {
      throw new NotFoundException(`POI with ID ${id} not found`);
    }
    return deletedPoi;
  }

  async findByLoai(loai: string): Promise<PoiDocument[]> {
    return this.poiModel.find({ loaiPOI: loai }).exec();
  }
}

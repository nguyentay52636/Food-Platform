import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { userCreateDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async findByEmailOrUsername(account: string) {
        return this.userModel.findOne({
            $or: [{ email: account }, { username: account }],
        }).exec();
    }

    async create(createDto: userCreateDto) {
        const createdUser = new this.userModel(createDto);
        return createdUser.save();
    }

    async findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async findAll() {
        return this.userModel.find().select('-password').lean().exec();
    }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    GUEST = 'guest',
    ADMIN = 'admin',
    STAFF = 'staff',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: UserRole, default: UserRole.GUEST })
    role: UserRole;

    @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Prop({ default: null })
    avatar?: string;

    @Prop({ default: null, trim: true })
    phone?: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
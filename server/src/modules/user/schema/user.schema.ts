import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: UserRole, default: UserRole.OWNER })
    role: UserRole;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
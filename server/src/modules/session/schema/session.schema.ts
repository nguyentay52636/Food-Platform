import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SessionDocument = Session & Document;

@Schema({
    timestamps: false,
    collection: 'Tbl_Session'
})
export class Session {
    @Prop({ type: String, required: true, unique: true })
    _id: string;
    @Prop({ type: Date, default: Date.now })
    thoiDiemBatDau: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

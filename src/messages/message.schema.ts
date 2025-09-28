import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { createMongoSchema } from "src/common/utils/mongo-schema.util";

@Schema()
export class Message {
    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    groupId: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

export type MessageDocument = Message & Document;

export const MessageSchema = createMongoSchema(Message);

MessageSchema.index({ groupId: 1, createdAt: 1 });

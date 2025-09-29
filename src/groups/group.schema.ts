import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { createMongoSchema } from "src/common/utils/mongo-schema.util";

@Schema()
export class Group {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    createdBy: string;
    
    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

export type GroupDocument = Group & Document;

export const GroupSchema = createMongoSchema(Group);

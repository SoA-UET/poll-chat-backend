import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { createMongoSchema } from "src/common/utils/mongo-schema.util";

@Schema()
export class GroupUser {
    @Prop({ required: true })
    group_id: string;

    @Prop({ required: true })
    user_id: string;
}

export type GroupUserDocument = GroupUser & Document;

export const GroupUserSchema = createMongoSchema(GroupUser);

GroupUserSchema.index({ group_id: 1 });
GroupUserSchema.index({ user_id: 1 });
GroupUserSchema.index({ group_id: 1, user_id: 1 }, { unique: true }); 

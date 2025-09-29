import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { createMongoSchema } from "src/common/utils/mongo-schema.util";

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    hashed_password: string;

    @Prop({ required: true })
    fullName: string;
}

export type UserDocument = User & Document;

export const UserSchema = createMongoSchema(User);

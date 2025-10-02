import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./message.schema";
import { Model } from "mongoose";
import { MessageDto } from "./dto/message.dto";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) {}

    async findByGroupIdAndCreatedAtAfter(
        groupId: string,
        createdAtAfter?: Date,
    ): Promise<MessageDto[]> {
        return await this.messageModel
            .find({
                groupId,
                ...(
                    createdAtAfter ? { createdAt: { $gt: createdAtAfter } } : {}
                ),
            })
            .sort({ createdAt: 1 })
            .exec();
    }

    async create(
        createMessageDto: CreateMessageDto,
    ): Promise<MessageDocument> {
        const newMessage = new this.messageModel(createMessageDto);
        return newMessage.save();
    }
}

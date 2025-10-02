import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import assert from 'assert';

export type NewMessagesInfo = {
    groupId: string;
};

export type OnNewMessagesCallback = (newMessagesInfo: NewMessagesInfo) => Promise<void>;

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.ChannelModel;
    private channel: amqp.Channel;
    private readonly exchange = 'chat_exchange';
    private groupIdToCallbackKeyToCallbackMap: Map<string, Map<string, OnNewMessagesCallback>> = new Map();

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
        assert.ok(RABBITMQ_URL != null && RABBITMQ_URL.length > 0, 'RABBITMQ_URL is not set in environment variables');
        this.connection = await amqp.connect(RABBITMQ_URL);
        console.log('Connected to RabbitMQ');
        this.channel = await this.connection.createChannel();

        // Fanout = pub/sub
        await this.channel.assertExchange(this.exchange, 'fanout', { durable: false });

        await this.start();
    }

    async publishNewMessagesInfo(newMessagesInfo: NewMessagesInfo) {
        this.channel.publish(this.exchange, '', Buffer.from(JSON.stringify(newMessagesInfo)));
    }

    async subscribe(groupId: string, callbackKey: string, callback: OnNewMessagesCallback) {
        const callbackKeyToCallbackMap = this.groupIdToCallbackKeyToCallbackMap.get(groupId) || new Map();
        this.groupIdToCallbackKeyToCallbackMap.set(groupId, callbackKeyToCallbackMap);

        callbackKeyToCallbackMap.set(callbackKey, callback);

        // Immediately check for new messages once upon subscription - even if there are no new messages yet
        callback({ groupId }).then(() => { }).catch(error => {
            console.error(`Error in RabbitmqService immediate callback [${callbackKey}]:`, error);
        });
    }

    async unsubscribe(groupId: string, callbackKey: string) {
        const callbackKeyToCallbackMap = this.groupIdToCallbackKeyToCallbackMap.get(groupId);
        if (!callbackKeyToCallbackMap) {
            return;
        }

        callbackKeyToCallbackMap.delete(callbackKey);
    }

    private async start() {
        const q = await this.channel.assertQueue('', { exclusive: true });
        await this.channel.bindQueue(q.queue, this.exchange, '');

        this.channel.consume(q.queue, (msg) => {
            if (msg) {
                // TODO: validate this
                const newMessagesInfo: NewMessagesInfo = JSON.parse(msg.content.toString());

                this.channel.ack(msg);

                const groupId = newMessagesInfo.groupId;
                if (!groupId) {
                    return;
                }
                const callbackKeyToCallbackMap = this.groupIdToCallbackKeyToCallbackMap.get(groupId);
                if (!callbackKeyToCallbackMap) {
                    return;
                }
                Promise.all(
                    [...callbackKeyToCallbackMap.entries()].map(async ([key, callback]) => {
                        try {
                            await callback(newMessagesInfo);
                        } catch (error) {
                            console.error(`Error in RabbitmqService callback [key=${key}] in [groupId=${groupId}]:`, error);
                        }
                    })
                ).then(() => {}).catch(error => {
                    console.error(`Error in RabbitmqService Promise.all [groupId=${groupId}]:`, error);
                });
            }
        });
    }

    async onModuleDestroy() {
        await this.channel?.close();
        await this.connection?.close();
    }
}

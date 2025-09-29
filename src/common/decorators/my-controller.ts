import { applyDecorators, ClassSerializerInterceptor, Controller, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

export type MyControllerOptions = {
    prefix: string;
    tags?: string[];
    disableAutoAddingPrefixToTags?: boolean;
};

export function MyController(options: MyControllerOptions) {
    const tags = options.tags ?? [];

    if (!options.disableAutoAddingPrefixToTags) {
        const prefix = options.prefix?.replace(/^\//, '');
        if (prefix) {
            tags.push(prefix);
        }
    }

    const decorators = [
        ApiTags(...tags),
        Controller(options.prefix),
        UseInterceptors(ClassSerializerInterceptor),
    ];

    return applyDecorators(...decorators);
}

import { applyDecorators, SerializeOptions, Type } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtherApiResponses } from '../other-api-responses.decorator';
import { JwtAuth } from '../jwt-auth.decorator';
import { MustBeInGroup } from '../must-be-in-group.decorator';

export type MyRouteOptions = {
    path?: string;
    summary: string;
    response: {
        status: number;
        description: string;
        type?: Type<any>;
        isArray?: boolean;
    };
    otherResponses?: {
        status: number;
        description: string;
        type?: Type<any>;
        isArray?: boolean;
    }[];
    jwtAuth?: boolean;
    mustBeInGroup?: boolean;
}

export function MyRoute(options: MyRouteOptions) {
    const decorators = [
        SerializeOptions({
            type: options.response.type,
        }),

        ApiOperation({ summary: options.summary }),

        ApiResponse({
            status: options.response.status,
            description: options.response.description,
            type: options.response.type,
            isArray: options.response.isArray || false,
        }),

        OtherApiResponses(),
    ];

    if (options.otherResponses) {
        for (const error of options.otherResponses) {
            decorators.push(ApiResponse({
                status: error.status,
                description: error.description,
                type: error.type,
                isArray: error.isArray || false,
            }));
        }
    }

    if (options.jwtAuth || options.mustBeInGroup) {
        decorators.push(JwtAuth());

        if (options.mustBeInGroup) {
            decorators.push(MustBeInGroup());
        }
    }

    return applyDecorators(...decorators);
}

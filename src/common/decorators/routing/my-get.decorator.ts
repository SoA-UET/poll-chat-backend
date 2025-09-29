import { applyDecorators, Get } from '@nestjs/common';
import { MyRoute, MyRouteOptions } from './my-route.decorator';

export type MyGetOptions = MyRouteOptions;

export function MyGet(options: MyGetOptions) {
  return applyDecorators(
    Get(options.path),
    MyRoute(options),
  );
}

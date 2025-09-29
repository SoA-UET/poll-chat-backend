import { applyDecorators, Put } from '@nestjs/common';
import { MyRoute, MyRouteOptions } from './my-route.decorator';

export type MyPutOptions = MyRouteOptions;

export function MyPut(options: MyPutOptions) {
  return applyDecorators(
    Put(options.path),
    MyRoute(options),
  );
}

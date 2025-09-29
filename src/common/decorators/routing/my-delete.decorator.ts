import { applyDecorators, Delete } from '@nestjs/common';
import { MyRoute, MyRouteOptions } from './my-route.decorator';

export type MyDeleteOptions = MyRouteOptions;

export function MyDelete(options: MyDeleteOptions) {
  return applyDecorators(
    Delete(options.path),
    MyRoute(options),
  );
}

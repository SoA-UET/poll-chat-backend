import { applyDecorators, Patch } from '@nestjs/common';
import { MyRoute, MyRouteOptions } from './my-route.decorator';

export type MyPatchOptions = MyRouteOptions;

export function MyPatch(options: MyPatchOptions) {
  return applyDecorators(
    Patch(options.path),
    MyRoute(options),
  );
}

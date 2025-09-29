import { applyDecorators, Post } from '@nestjs/common';
import { MyRoute, MyRouteOptions } from './my-route.decorator';

export type MyPostOptions = MyRouteOptions;

export function MyPost(options: MyPostOptions) {
  return applyDecorators(
    Post(options.path),
    MyRoute(options),
  );
}

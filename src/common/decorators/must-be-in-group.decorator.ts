import { applyDecorators, UseGuards } from '@nestjs/common';
import { MustBeInGroupGuard } from '../guards/must-be-in-group.guard';

export function MustBeInGroup() {
  return applyDecorators(
    UseGuards(MustBeInGroupGuard),
  );
}

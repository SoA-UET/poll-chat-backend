import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAuthErrorResponseDTO } from '../dto/jwt-auth-error-response.dto';

export function JwtAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),

    ApiBearerAuth('jwt'),

    ApiResponse({
      status: 401,
      description: 'Bạn chưa đặt bearer token (JWT) hợp lệ.',
      type: JwtAuthErrorResponseDTO,
    }),
  );
}

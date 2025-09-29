import { ApiProperty } from '@nestjs/swagger';

export class JwtAuthErrorResponseDTO {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Bạn cần đăng nhập để thực hiện hành động này' })
  message: string;
}

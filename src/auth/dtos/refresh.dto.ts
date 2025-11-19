import { ApiProperty } from '@nestjs/swagger';

export class RotateRefreshDto {
  @ApiProperty()
  refreshToken: string;
}

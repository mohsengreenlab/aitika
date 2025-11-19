import { ApiProperty } from '@nestjs/swagger';

export class RotateRefreshResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

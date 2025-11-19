import { ApiProperty } from '@nestjs/swagger';

import { ExposeUserDto } from './expose-user.dto';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: () => ExposeUserDto })
  user: ExposeUserDto;
}

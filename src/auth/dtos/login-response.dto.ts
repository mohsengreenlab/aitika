import { ApiProperty } from '@nestjs/swagger';

import { ExposeUserDto } from './expose-user.dto';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: () => ExposeUserDto })
  user: ExposeUserDto;
}

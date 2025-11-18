import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { ErrorResponseDto } from 'src/shared/dtos/error-response.dto';
import { ExposeUserDto } from './dtos/expose-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: ExposeUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation Error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponseDto,
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}

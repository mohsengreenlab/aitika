import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';
import { ExposeUserDto } from './dtos/expose-user.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Successful login',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: ExposeUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  getMe(@Req() req: any) {
    // Passport attaches user to request from JwtStrategy validate()
    return req.user;
  }
}

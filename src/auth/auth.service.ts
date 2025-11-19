import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dtos/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);
    const { password, ...safe } = user;

    return {
      accessToken,
      refreshToken,
      user: safe,
    };
  }

  async rotateRefresh(old: string) {
    // TODO:
  }

  // TODO: Add Role, Permissions, Level, etc
  async generateAccessToken(userId: number) {
    const payload = { sub: userId };
    const secret = this.cfg.get('JWT_SECRET');
    const expiresIn = this.cfg.get('JWT_EXPIRES_IN');

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async generateRefreshToken(userId: number) {
    const payload = { sub: userId };
    const secret = this.cfg.get('JWT_REFRESH_SECRET');
    const expiresIn = this.cfg.get('JWT_REFRESH_EXPIRES_IN');

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}

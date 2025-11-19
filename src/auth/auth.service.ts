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
        hashedRefreshToken: true,
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
    // Store new hashed refresh token
    await this.storeRefreshToken(user.id, refreshToken);
    const { password, hashedRefreshToken, ...safe } = user;

    return {
      accessToken,
      refreshToken,
      user: safe,
    };
  }

  async rotateRefresh(oldRefreshToken: string) {
    // Decode and verify refresh token
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: this.cfg.get('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    // Compare old refresh token with stored hashed token
    const isValid = await bcrypt.compare(
      oldRefreshToken,
      user.hashedRefreshToken,
    );
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    // Generate new tokens
    const newAccessToken = await this.generateAccessToken(user.id);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    // Store new hashed refresh token
    await this.storeRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
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

  // ------------------------
  // TODO: userService
  // ------------------------
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async storeRefreshToken(userId: number, newToken: string) {
    const hashed = await bcrypt.hash(newToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashed },
    });
  }
}

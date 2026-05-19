import { Role } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { JwtPayload } from '../types/jwt-payload.interface';
import { ConflictError, UnauthorizedError } from '../utils/errors.util';
import { comparePassword, hashPassword } from '../utils/hash.util';
import { signToken } from '../utils/jwt.util';
import { RegisterDto } from '../validators/register.validator';
import { LoginDto } from '../validators/login.validator';
import { prisma } from './prisma.service';

const userSelect = {
  id: true,
  email: true,
  role: true,
  profileCompleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
      },
      select: userSelect,
    });

    const accessToken = this.createToken(user);

    return {
      accessToken,
      user: new UserEntity(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordValid = await comparePassword(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: new UserEntity({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }),
    };
  }

  private createToken(user: { id: string; email: string; role: Role }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return signToken(payload);
  }
}

export const authService = new AuthService();

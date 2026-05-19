import { Role } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { ConflictError } from '../utils/errors.util';
import { hashPassword } from '../utils/hash.util';
import { CreateAdminDto } from '../validators/create-admin.validator';
import { prisma } from './prisma.service';

const userSelect = {
  id: true,
  email: true,
  role: true,
  profileCompleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AdminService {
  async createAdmin(dto: CreateAdminDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const hashedPassword = await hashPassword(dto.password);

    const admin = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
      select: userSelect,
    });

    return new UserEntity(admin);
  }
}

export const adminService = new AdminService();

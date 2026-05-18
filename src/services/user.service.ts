import { UserEntity } from '../entities/user.entity';
import { BadRequestError, NotFoundError } from '../utils/errors.util';
import { prisma } from './prisma.service';

const userSelect = {
  id: true,
  email: true,
  role: true,
  profileCompleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserService {
  async completeProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, profileCompleted: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.profileCompleted) {
      throw new BadRequestError('Profile is already completed');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { profileCompleted: true },
      select: userSelect,
    });

    return new UserEntity(updated);
  }
}

export const userService = new UserService();

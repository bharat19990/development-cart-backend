import { Role } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { ConflictError } from '../utils/errors.util';
import { hashPassword } from '../utils/hash.util';
import { CreateOrganizationDto } from '../validators/create-organization.validator';
import { prisma } from './prisma.service';

const userSelect = {
  id: true,
  email: true,
  role: true,
  profileCompleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class OrganizationService {
  async create(dto: CreateOrganizationDto) {
    const existingSlug = await prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (existingSlug) {
      throw new ConflictError('Organization slug already exists');
    }

    if (dto.accountEmail && !dto.accountPassword) {
      throw new ConflictError(
        'accountPassword is required when accountEmail is provided',
      );
    }

    if (dto.accountEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: dto.accountEmail },
      });
      if (existingEmail) {
        throw new ConflictError('Organization account email already exists');
      }
    }

    return prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
        },
      });

      let account: UserEntity | undefined;

      if (dto.accountEmail && dto.accountPassword) {
        const user = await tx.user.create({
          data: {
            email: dto.accountEmail,
            password: await hashPassword(dto.accountPassword),
            role: Role.ORGANIZATION,
            organizationId: organization.id,
          },
          select: userSelect,
        });
        account = new UserEntity(user);
      }

      return { organization, account };
    });
  }
}

export const organizationService = new OrganizationService();

import 'reflect-metadata';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERADMIN_EMAIL ?? 'superadmin@system.local';
  const password = process.env.SUPERADMIN_PASSWORD ?? 'SuperAdmin123!';

  const existing = await prisma.user.findFirst({
    where: { role: Role.SUPERADMIN },
  });

  if (existing) {
    console.log('Superadmin already exists:', existing.email);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: Role.SUPERADMIN,
    },
  });

  console.log('Superadmin seeded:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

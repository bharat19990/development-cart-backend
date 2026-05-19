import request from 'supertest';
import { createApp } from '../src/app';
import { Role } from '../src/enums/role.enum';
import { disconnectPrisma } from '../src/services/prisma.service';
import { prisma } from '../src/services/prisma.service';

describe('Auth (e2e)', () => {
  const app = createApp();
  let accessToken: string;

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  beforeAll(async () => {
    const superadmin = await prisma.user.findFirst({
      where: { role: Role.SUPERADMIN },
    });

    if (!superadmin) {
      throw new Error('Run npm run prisma:seed before e2e tests');
    }
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('POST /auth/register', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const body = res.body as {
      accessToken: string;
      user: { email: string; role: Role };
    };

    expect(body.user.role).toBe(Role.USER);
    expect(body.user.email).toBe(testUser.email);
    accessToken = body.accessToken;
  });

  it('POST /auth/login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    const body = res.body as { accessToken: string };
    accessToken = body.accessToken;
  });

  it('GET /users/me (protected)', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res: { body: { user: { email: string } } }) => {
        expect(res.body.user.email).toBe(testUser.email);
      });
  });

  it('GET /users/me without token returns 401', async () => {
    await request(app).get('/users/me').expect(401);
  });
});
